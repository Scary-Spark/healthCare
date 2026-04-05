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

export default router;
