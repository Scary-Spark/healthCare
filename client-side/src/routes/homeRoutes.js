import express from "express";
import { pool } from "../configs/database.js"; // 👈 ADD THIS
const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.render("home");
});

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// main dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

// ------------------------------
// 🧪 DATABASE TEST ROUTE (NEW)
// ------------------------------
router.get("/test-db", async (req, res) => {
  try {
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

// Other routes
router.get("/appointment", (req, res) => {
  res.render("appointment");
});

router.get("/test-reports", (req, res) => {
  res.render("test-reports");
});

router.get("/prescriptions", (req, res) => {
  res.render("prescriptions");
});

router.get("/appointment-history", (req, res) => {
  res.render("appointment-history");
});

router.get("/invoices", (req, res) => {
  res.render("invoices");
});

router.get("/payment", (req, res) => {
  res.render("payment");
});

router.get("/forum", (req, res) => {
  res.render("forum");
});

router.get("/suggestions", (req, res) => {
  res.render("suggestions");
});

router.get("/others-settings", (req, res) => {
  res.render("others-settings");
});

router.get("/profile-settings", (req, res) => {
  res.render("profile-settings");
});

export default router;
