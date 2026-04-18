import { pool } from "../configs/database.js";
import { hashPassword, verifyPassword } from "../configs/passwordHashing.js";

// retrive user data from database
export const getUserData = async (personId) => {
  try {
    console.log("🔍 Fetching user data for personId:", personId);

    const [rows] = await pool.query("CALL GetNavbarProfile(?)", [personId]);

    console.log("📊 Stored procedure result:", rows);

    const user = rows[0]?.[0]; // Stored procedures return nested arrays

    if (!user) {
      console.log("❌ No user found for personId:", personId);
      return null;
    }

    console.log("✅ User found:", {
      fullName: user.full_name,
      email: user.email,
      profilePic: user.profile_pic_path,
    });

    return {
      fullName: user.full_name,
      email: user.email,
      profilePic: user.profile_pic_path,
      personId: user.person_id,
    };
  } catch (error) {
    console.error("❌ Error fetching user ", error);
    return null;
  }
};

// push user data into res.locals for all views
export const getClientData = async (req, res, next) => {
  try {
    if (req.session.client?.isAuthenticated && req.session.client.personId) {
      // Fetch fresh data from database
      const userData = await getUserData(req.session.client.personId);

      if (userData) {
        res.locals.user = userData;
      } else {
        res.locals.user = null;
      }
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    console.error("Error in getClientData:", error);
    res.locals.user = null;
  }
  next();
};

// render dashboard
export const getDashboard = async (req, res) => {
  // Ensure user data is loaded
  if (!res.locals.user && req.session.client?.personId) {
    res.locals.user = await getUserData(req.session.client.personId);
  }

  res.render("dashboard", {
    user: res.locals.user,
    stats: {
      appointments: 2,
      reports: 1,
      prescriptions: 3,
      messages: 5,
    },
  });
};

// render profile page
export const getProfile = async (req, res) => {
  if (!res.locals.user && req.session.client?.personId) {
    res.locals.user = await getUserData(req.session.client.personId);
  }

  res.render("profile-settings", {
    user: res.locals.user,
  });
};

// render appointment page
export const getAppointments = async (req, res) => {
  if (!res.locals.user && req.session.client?.personId) {
    res.locals.user = await getUserData(req.session.client.personId);
  }

  res.render("appointment", {
    user: res.locals.user,
  });
};

export const getProfileSettings = async (req, res) => {
  try {
    const personId = req.session.client?.personId;

    if (!personId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Fetch full profile using stored procedure
    const [rows] = await pool.query(`CALL GetPersonFullProfile(?)`, [personId]);

    const profileData = rows[0]?.[0];

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Format response for frontend
    const profile = {
      personId: profileData.person_id,
      firstName: profileData.first_name || "",
      lastName: profileData.last_name || "",
      dateOfBirth: profileData.date_of_birth
        ? new Date(profileData.date_of_birth).toISOString().split("T")[0]
        : "",
      gender: profileData.gender_name?.toLowerCase() || "",
      bloodGroup: profileData.blood_group_name || "not-tested",
      profilePic:
        profileData.profile_pic_path ||
        "/uploads/profilePictures/defaultProfilePic.jpg",
      email: profileData.email || "",
      phone: profileData.phone_number || "",
      // Address fields
      upazilaId: profileData.upazila_id || null,
      postalCode: profileData.postal_code || "",
      streetAddress: profileData.street_address || "",
      // For location cascade: fetch upazila details if upazilaId exists
      upazilaDetails: null,
    };

    // If user has an upazila, fetch its details for cascade population
    if (profile.upazilaId) {
      const [upazilaRows] = await pool.query(`CALL GetUpazilaDetails(?)`, [
        profile.upazilaId,
      ]);
      const upazilaData = upazilaRows[0]?.[0];
      if (upazilaData) {
        profile.upazilaDetails = {
          upazilaId: upazilaData.upazila_id,
          upazilaName: upazilaData.upazila_name,
          districtId: upazilaData.district_id,
          districtName: upazilaData.district_name,
          divisionId: upazilaData.division_id,
          divisionName: upazilaData.division_name,
        };
      }
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching profile settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load profile settings",
    });
  }
};

// Update personal information
export const updatePersonalInfo = async (req, res) => {
  try {
    const personId = req.session.client?.personId;
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      currentPassword,
    } = req.body;

    if (!personId || !currentPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Verify current password
    const [clientRows] = await pool.query(
      "SELECT password_hash FROM clients WHERE person_id = ?",
      [personId],
    );

    if (
      !clientRows[0] ||
      !(await verifyPassword(currentPassword, clientRows[0].password_hash))
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect current password" });
    }

    // Get gender_id and blood_group_id from names
    const [genderRow] = await pool.query(
      "SELECT gender_id FROM genders WHERE gender_name = ?",
      [gender],
    );

    const [bloodRow] = await pool.query(
      "SELECT blood_group_id FROM blood_groups WHERE blood_group_name = ?",
      [bloodGroup || "Not Tested"],
    );

    // Update persons table
    await pool.query(
      `UPDATE persons SET 
        first_name = ?, 
        last_name = ?, 
        date_of_birth = ?, 
        gender_id = ?, 
        blood_group_id = ? 
       WHERE person_id = ?`,
      [
        firstName,
        lastName,
        dateOfBirth,
        genderRow[0]?.gender_id,
        bloodRow[0]?.blood_group_id,
        personId,
      ],
    );

    res.json({
      success: true,
      message: "Personal information updated successfully",
    });
  } catch (error) {
    console.error("Error updating personal info:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update personal information",
      });
  }
};

// Update contact information
export const updateContactInfo = async (req, res) => {
  try {
    const personId = req.session.client?.personId;
    const { email, phone, currentPassword } = req.body;

    if (!personId || !currentPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Verify current password
    const [clientRows] = await pool.query(
      "SELECT password_hash FROM clients WHERE person_id = ?",
      [personId],
    );

    if (
      !clientRows[0] ||
      !(await verifyPassword(currentPassword, clientRows[0].password_hash))
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect current password" });
    }

    // Check for duplicate email/phone (excluding current user)
    const [emailCheck] = await pool.query(
      "SELECT client_id FROM clients WHERE email = ? AND person_id != ?",
      [email, personId],
    );

    if (emailCheck.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const [phoneCheck] = await pool.query(
      "SELECT client_id FROM clients WHERE phone_number = ? AND person_id != ?",
      [phone, personId],
    );

    if (phoneCheck.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already registered" });
    }

    // Update clients table
    await pool.query(
      `UPDATE clients SET email = ?, phone_number = ? WHERE person_id = ?`,
      [email, phone, personId],
    );

    res.json({
      success: true,
      message: "Contact information updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact info:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update contact information",
      });
  }
};

// Update address information
export const updateAddressInfo = async (req, res) => {
  try {
    const personId = req.session.client?.personId;
    const { upazilaId, postalCode, streetAddress, currentPassword } = req.body;

    if (!personId || !currentPassword || !upazilaId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Verify current password
    const [clientRows] = await pool.query(
      "SELECT password_hash FROM clients WHERE person_id = ?",
      [personId],
    );

    if (
      !clientRows[0] ||
      !(await verifyPassword(currentPassword, clientRows[0].password_hash))
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect current password" });
    }

    // Use INSERT ... ON DUPLICATE KEY UPDATE for person_address (composite primary key)
    await pool.query(
      `INSERT INTO person_address (person_id, upazila_id, postal_code, street_address)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         postal_code = VALUES(postal_code),
         street_address = VALUES(street_address)`,
      [personId, upazilaId, postalCode || null, streetAddress || null],
    );

    res.json({ success: true, message: "Address updated successfully" });
  } catch (error) {
    console.error("Error updating address:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update address" });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const personId = req.session.client?.personId;
    const { newPassword, currentPassword } = req.body;

    if (!personId || !newPassword || !currentPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 8 characters",
        });
    }

    // Verify current password
    const [clientRows] = await pool.query(
      "SELECT password_hash FROM clients WHERE person_id = ?",
      [personId],
    );

    if (
      !clientRows[0] ||
      !(await verifyPassword(currentPassword, clientRows[0].password_hash))
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect current password" });
    }

    // Hash and update new password
    const newPasswordHash = await hashPassword(newPassword);

    await pool.query(
      "UPDATE clients SET password_hash = ? WHERE person_id = ?",
      [newPasswordHash, personId],
    );

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update password" });
  }
};

// Update profile picture (avatar)
export const updateProfilePicture = async (req, res) => {
  try {
    const personId = req.session.client?.personId;

    if (!personId || !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // ✅ FIX: Normalize path to use forward slashes (for web URLs)
    // Replace backslashes with forward slashes
    let filePath = req.file.path.replace(/\\/g, "/");

    // Ensure the path starts with /uploads (not C:/uploads or similar)
    if (!filePath.startsWith("/uploads")) {
      const uploadIndex = filePath.indexOf("/uploads");
      if (uploadIndex !== -1) {
        filePath = filePath.substring(uploadIndex);
      } else {
        // Fallback: construct the path manually
        filePath = "/uploads/profilePictures/" + req.file.filename;
      }
    }

    // Update profile_pic_path in persons table
    await pool.query(
      "UPDATE persons SET profile_pic_path = ? WHERE person_id = ?",
      [filePath, personId],
    );

    res.json({
      success: true,
      message: "Profile picture updated",
      data: { profilePic: filePath },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile picture" });
  }
};
