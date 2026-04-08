import express from "express";
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

export default router;
