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
    next();
  } else {
    res.redirect("/login"); // Redirect to login if not authenticated
  }
};

// routes for pages
router.get("/", (req, res) => res.render("home"));
router.get("/login", (req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));

// dashboard (requires login)
router.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", {
    user: {
      name: `${req.session.client.firstName} ${req.session.client.lastName}`,
      email: req.session.client.email,
    },
  });
});

router.get("/appointment", (req, res) => res.render("appointment"));
router.get("/test-reports", (req, res) => res.render("test-reports"));
router.get("/prescriptions", (req, res) => res.render("prescriptions"));
router.get("/appointment-history", (req, res) =>
  res.render("appointment-history"),
);

router.get("/invoices", (req, res) => res.render("invoices"));
router.get("/payment", (req, res) => res.render("payment"));
router.get("/forum", (req, res) => res.render("forum"));
router.get("/suggestions", (req, res) => res.render("suggestions"));
router.get("/others-settings", (req, res) => res.render("others-settings"));
router.get("/profile-settings", (req, res) => res.render("profile-settings"));

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

// authentication routes
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
