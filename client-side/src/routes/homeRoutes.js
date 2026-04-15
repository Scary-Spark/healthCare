import express from "express";
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

const router = express.Router();

// routes for pages
router.get("/", (req, res) => res.render("home"));
router.get("/login", (req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/dashboard", (req, res) => res.render("dashboard"));
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

// api routes: for email and phone verification
router.post("/api/signup/send-email-code", sendEmailCode);
router.post("/api/signup/verify-email", verifyEmail);
router.post("/api/signup/send-phone-code", sendPhoneCode);
router.post("/api/signup/verify-phone", verifyPhone);
router.post("/api/signup/complete", completeRegistration);

// api routes: for locations
router.get("/api/locations/divisions", getDivisions);
router.get("/api/locations/districts/:divisionId", getDistricts);
router.get("/api/locations/upazilas/:districtId", getUpazilas);
router.get("/api/locations/upazila/:upazilaId", getUpazilaDetails);

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
