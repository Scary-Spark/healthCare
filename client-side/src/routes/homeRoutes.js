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
} from "../controllers/locationController.js";

const router = express.Router();

// ===== PAGE ROUTES =====
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

// API ROUTES FOR SIGNUP
router.post("/api/signup/personal-info", validatePersonalInfo);
router.post("/api/signup/contact-info", validateContactInfo);
router.get("/api/signup/social/:provider", handleSocialLogin);
router.post("/api/signup/validate-password", validatePassword);
router.get("/api/locations/blood-groups", getBloodGroups);
router.get("/api/locations/genders", getGenders);

// API ROUTES FOR VERIFICATION
router.post("/api/signup/send-email-code", sendEmailCode);
router.post("/api/signup/verify-email", verifyEmail);
router.post("/api/signup/send-phone-code", sendPhoneCode);
router.post("/api/signup/verify-phone", verifyPhone);
router.post("/api/signup/complete", completeRegistration);

// API ROUTES LOCATION
router.get("/api/locations/divisions", getDivisions);
router.get("/api/locations/districts/:divisionId", getDistricts);
router.get("/api/locations/upazilas/:districtId", getUpazilas);
router.get("/api/locations/upazila/:upazilaId", async (req, res) => {
  try {
    const { pool } = await import("../configs/database.js");
    const [rows] = await pool.query(
      `
      SELECT 
        u.upazila_id,
        u.upazila_name,
        d.district_id,
        d.district_name,
        v.division_id,
        v.division_name
      FROM upazilas u
      JOIN districts d ON u.district_id = d.district_id
      JOIN divisions v ON d.division_id = v.division_id
      WHERE u.upazila_id = ?
    `,
      [req.params.upazilaId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Upazila not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching upazila path:", error);
    res.status(500).json({ error: "Database error" });
  }
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
