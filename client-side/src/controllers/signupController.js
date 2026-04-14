import { pool } from "../configs/database.js";
import { sendOTPEmail } from "../configs/email.js";

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send Email and Code
export const sendEmailCode = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  const otp = generateOTP();

  // Store OTP in session
  req.session.emailOTP = otp;
  req.session.emailOTPTime = Date.now();

  // Uncomment the next line to actually send email in production
  // await sendOTPEmail(email, otp);

  // For testing: Log OTP to console so you can see it
  console.log(`📧 OTP for ${email}: ${otp}`);

  res.json({
    success: true,
    message: "Code sent to email (Check console for testing)",
  });
};

// Verify Email
export const verifyEmail = (req, res) => {
  const { otp } = req.body;

  // Secret code for testing purpose only
  if (otp === "123456") {
    req.session.emailVerified = true;
    return res.json({ success: true, message: "Email verified successfully!" });
  }

  // Check session OTP
  if (req.session.emailOTP === otp) {
    // Check if expired (15 mins)
    if (Date.now() - req.session.emailOTPTime > 15 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, message: "Code expired. Please resend." });
    }
    req.session.emailVerified = true;
    res.json({ success: true, message: "Email verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid code" });
  }
};

// Send Phone Code (Mock/SMS)
export const sendPhoneCode = (req, res) => {
  const { phone } = req.body;

  // no actual backend system. for testing purpose use this code: 123456
  res.json({
    success: true,
    message: "Use code 123456 for phone verification (Demo)",
  });
};

// Verify Phone
export const verifyPhone = (req, res) => {
  const { otp } = req.body;
  if (otp === "123456") {
    req.session.phoneVerified = true;
    res.json({ success: true, message: "Phone verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid code" });
  }
};

// Complete Registration
export const completeRegistration = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    gender,
    bloodGroup,
    email,
    phone,
    division,
    district,
    upazila,
    postalCode,
    streetAddress,
    password,
  } = req.body;

  // Check Verification Status
  if (!req.session.emailVerified || !req.session.phoneVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify both email and phone first.",
    });
  }

  try {
    // insert new user into database
    const [result] = await pool.query(
      `INSERT INTO clients (
        first_name,
        last_name,
        dob, gender,
        blood_group,
        email,
        phone,
        password_hash,
        division_id,
        district_id,
        upazila_id,
        postal_code,
        street_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        dob,
        gender,
        bloodGroup,
        email,
        phone,
        password,
        division,
        district,
        upazila,
        postalCode,
        streetAddress,
      ],
    );

    // 3. Clear Session Data
    req.session.destroy();

    res.json({
      success: true,
      message: "Registration successful! Redirecting...",
    });
  } catch (error) {
    console.error("Registration Error:", error);

    // Check for duplicate email error (MySQL code 1062)
    if (error.code === "ER_DUP_ENTRY") {
      res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    } else {
      res.status(500).json({ success: false, message: "Registration failed." });
    }
  }
};

// form validation for personal info
export const validatePersonalInfo = async (req, res) => {
  const { firstName, lastName, dob, gender, bloodGroup } = req.body;
  const errors = {};

  if (!firstName || firstName.trim() === "")
    errors.firstName = "First name is required";
  else if (!/^[a-zA-Z\s\.]+$/.test(firstName.trim()))
    errors.firstName = "Only letters, spaces, and dots allowed";

  if (!lastName || lastName.trim() === "")
    errors.lastName = "Last name is required";
  else if (!/^[a-zA-Z\s\.]+$/.test(lastName.trim()))
    errors.lastName = "Only letters, spaces, and dots allowed";

  if (!dob) errors.dob = "Date of birth is required";
  else {
    const dobDate = new Date(dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dobDate.setHours(0, 0, 0, 0);
    if (isNaN(dobDate.getTime())) errors.dob = "Invalid date";
    else if (dobDate > today) errors.dob = "Cannot be in the future";
  }

  if (!gender) {
    errors.gender = "Please select a gender";
  } else {
    // Optional: Verify the gender ID exists in database
    try {
      const { pool } = await import("../configs/database.js");
      const [rows] = await pool.query(
        "SELECT gender_id FROM genders WHERE gender_id = ?",
        [gender],
      );
      if (rows.length === 0) {
        errors.gender = "Please select a valid gender";
      }
    } catch (dbError) {
      console.error("Database error checking gender:", dbError);
    }
  }

  if (!bloodGroup) {
    errors.bloodGroup = "Please select a blood group";
  } else {
    // Optional: Verify the blood group ID exists in database
    try {
      const { pool } = await import("../configs/database.js");
      const [rows] = await pool.query(
        "SELECT blood_group_id FROM blood_groups WHERE blood_group_id = ? ORDER BY blood_group_id",
        [bloodGroup],
      );
      if (rows.length === 0) {
        errors.bloodGroup = "Please select a valid blood group";
      }
    } catch (dbError) {
      console.error("Database error checking blood group:", dbError);
    }
  }

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ success: false, errors });
  return res.json({
    success: true,
    message: "Personal information validated successfully",
  });
};

export const validateContactInfo = async (req, res) => {
  const { email, phone, division, district, upazila } = req.body;
  const errors = {};

  if (!email || email.trim() === "") errors.email = "Email address is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address";
  else {
    try {
      const [existingEmail] = await pool.query(
        "SELECT client_id FROM clients WHERE email = ? LIMIT 1",
        [email.trim().toLowerCase()],
      );
      if (existingEmail.length > 0)
        errors.email = "This email is already registered";
    } catch (err) {
      console.error("DB error checking email:", err);
    }
  }

  if (!phone || phone.trim() === "") errors.phone = "Phone number is required";
  else if (!/^\+?[0-9\s\-\(\)]{10,15}$/.test(phone))
    errors.phone = "Please enter a valid phone number";
  else {
    try {
      const [existingPhone] = await pool.query(
        "SELECT client_id FROM clients WHERE phone_number = ? LIMIT 1",
        [phone.trim()],
      );
      if (existingPhone.length > 0)
        errors.phone = "This phone number is already registered";
    } catch (err) {
      console.error("DB error checking phone:", err);
    }
  }

  if (!division) errors.division = "Please select a division";
  if (!district) errors.district = "Please select a district";
  if (!upazila) errors.upazila = "Please select an upazila";

  if (Object.keys(errors).length > 0)
    return res.status(400).json({ success: false, errors });
  return res.json({
    success: true,
    message: "Contact information validated successfully",
  });
};

export const validatePassword = (req, res) => {
  const { password, confirmPassword } = req.body;
  const errors = {};

  // Length check
  if (!password || password.length < 8 || password.length > 32) {
    errors.password = "Password must be between 8 and 32 characters";
  } else {
    // Character requirements
    if (!/[A-Z]/.test(password))
      errors.password = "Must contain at least 1 uppercase letter";
    else if (!/[a-z]/.test(password))
      errors.password = "Must contain at least 1 lowercase letter";
    else if (!/[0-9]/.test(password))
      errors.password = "Must contain at least 1 number";
    else if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'\`~]/.test(password))
      errors.password = "Must contain at least 1 special character";
  }

  // Match check
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  return res.json({ success: true, message: "Password is valid" });
};

export const handleSocialLogin = (req, res) => {
  const { provider } = req.params;
  res.json({
    success: false,
    message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login is coming soon!`,
    comingSoon: true,
  });
};

// get blood group data from the database
export const getBloodGroups = async (req, res) => {
  try {
    const { pool } = await import("../configs/database.js");
    const [rows] = await pool.query(
      "SELECT blood_group_id, blood_group_name FROM blood_groups ORDER BY blood_group_id ASC",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching blood groups:", error);
    res.status(500).json({ error: "Failed to fetch blood groups" });
  }
};

// get genders data from database
export const getGenders = async (req, res) => {
  try {
    const { pool } = await import("../configs/database.js");
    const [rows] = await pool.query(
      "SELECT gender_id, gender_name FROM genders ORDER BY gender_id ASC",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching genders:", error);
    res.status(500).json({ error: "Failed to fetch genders" });
  }
};
