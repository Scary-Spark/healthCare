import { pool } from "../configs/database.js";

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
