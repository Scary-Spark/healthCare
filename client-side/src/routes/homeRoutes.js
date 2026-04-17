import express from "express";
import rateLimit from "express-rate-limit";
import {
  validatePersonalInfo,
  handleSocialLogin,
  validateContactInfo,
  validatePassword,
  sendEmailCode,
  verifyEmail,
  sendPhoneCode,
  verifyPhone,
  completeRegistration,
  getBloodGroups,
  getGenders,
} from "../controllers/signupController.js";
import {
  getDivisions,
  getDistricts,
  getUpazilas,
  getUpazilaDetails,
} from "../controllers/locationController.js";
import {
  requestPasswordReset,
  resetPassword,
  loginClient,
  logoutClient,
  getCurrentClient,
} from "../controllers/loginController.js";
import {
  // getClientData,
  getDashboard,
  getProfile,
  getAppointments,
} from "../controllers/clientController.js";
import {
  getDepartments,
  getDoctors,
  createAppointment,
  getCurrentUserProfile,
  getAppointmentHistory,
  downloadAppointmentPDF,
} from "../controllers/appointmentController.js";

const router = express.Router();

// login rate limit
// 5 attempts per 15 minutes per ip
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per window
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// middlewares
const requireAuth = (req, res, next) => {
  if (req.session.client?.isAuthenticated) {
    // user data is already injected by main.js middleware
    next();
  } else {
    res.redirect("/login"); // Redirect to login if not authenticated
  }
};

// public routes
router.get("/", (req, res) => res.render("home"));
// router.get("/login", (req, res) => res.render("login"));
router.get("/login", (req, res) => {
  if (req.session.client?.isAuthenticated) {
    return res.redirect("/dashboard");
  }
  res.render("login");
});
router.get("/signup", (req, res) => res.render("signup"));

// protected routes (required login)
router.get("/dashboard", requireAuth, (req, res) => {
  // res.locals.user is already set by main.js middleware
  res.render("dashboard", {
    user: res.locals.user,
    stats: {
      /* ... */
    },
  });
});
router.get("/appointment", requireAuth, getAppointments);
router.get("/test-reports", requireAuth, (req, res) => {
  res.render("test-reports", { user: res.locals.user });
});
router.get("/prescriptions", requireAuth, (req, res) => {
  res.render("prescriptions", { user: res.locals.user });
});
router.get("/appointment-history", requireAuth, (req, res) => {
  res.render("appointment-history", { user: res.locals.user });
});
router.get("/invoices", requireAuth, (req, res) => {
  res.render("invoices", { user: res.locals.user });
});
router.get("/payment", requireAuth, (req, res) => {
  res.render("payment", { user: res.locals.user });
});
router.get("/forum", requireAuth, (req, res) => {
  res.render("forum", { user: res.locals.user });
});
router.get("/suggestions", requireAuth, (req, res) => {
  res.render("suggestions", { user: res.locals.user });
});
router.get("/others-settings", requireAuth, (req, res) => {
  res.render("others-settings", { user: res.locals.user });
});
router.get("/profile-settings", requireAuth, getProfile);

// api routes for signup
router.post("/api/signup/personal-info", validatePersonalInfo);
router.post("/api/signup/contact-info", validateContactInfo);
router.get("/api/signup/social/:provider", handleSocialLogin);
router.post("/api/signup/validate-password", validatePassword);
router.get("/api/locations/blood-groups", getBloodGroups);
router.get("/api/locations/genders", getGenders);
router.post("/api/signup/send-email-code", sendEmailCode);
router.post("/api/signup/verify-email", verifyEmail);
router.post("/api/signup/send-phone-code", sendPhoneCode);
router.post("/api/signup/verify-phone", verifyPhone);
router.post("/api/signup/complete", completeRegistration);
router.get("/api/locations/divisions", getDivisions);
router.get("/api/locations/districts/:divisionId", getDistricts);
router.get("/api/locations/upazilas/:districtId", getUpazilas);
router.get("/api/locations/upazila/:upazilaId", getUpazilaDetails);

// authentication api routes
router.post("/api/auth/login", loginClient);
router.post("/api/auth/logout", logoutClient);
router.get("/api/auth/me", getCurrentClient); // get current user for dashboard

// routes for password reset
router.post("/api/auth/request-password-reset", requestPasswordReset);
router.post("/api/auth/reset-password", resetPassword);
router.get("/reset-password", (req, res) => {
  // Check if token is present in query params
  const token = req.query.token;
  if (!token) {
    return res.redirect("/login?error=invalid_token");
  }
  res.render("reset-password", { token });
});

// api routes for appointment
router.get("/api/appointments/departments", getDepartments);
router.get("/api/appointments/doctors", getDoctors);
router.get("/api/appointments/profile", getCurrentUserProfile);
router.post("/api/appointments/book", createAppointment);
router.get("/api/appointments/history", getAppointmentHistory);
router.get("/api/appointments/history/:id/pdf", downloadAppointmentPDF);

// Database test route (for debugging)
router.get("/test-db", async (req, res) => {
  try {
    const { pool } = await import("../configs/database.js");
    const [rows] = await pool.query("SELECT 1 + 1 AS result");

    res.json({
      success: true,
      message: "Database connected successfully",
      result: rows[0].result,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

export default router;
