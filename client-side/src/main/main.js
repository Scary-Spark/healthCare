import express from "express";
import session from "express-session";
import __dirname from "../../clientPath.js";
import path from "path";
import rateLimit from "express-rate-limit";
import router from "../routes/homeRoutes.js";
import dotenv from "dotenv";

// Load environment variables (supports both local and cPanel)
dotenv.config({
  path: path.resolve(
    __dirname,
    "../../",
    process.env.NODE_ENV === "production" ? ".env.production" : ".env",
  ),
});

// Creating server
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      httpOnly: true, // Prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours default
      sameSite: "strict", // Prevent CSRF
    },
  }),
);

// // login rate limit
// // 5 attempts per 15 minutes per ip
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 login attempts per window
//   message: {
//     success: false,
//     message: "Too many login attempts. Please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// router.post("/api/auth/login", loginLimiter, loginClient);

// // Session Middleware (for OTP and Verification State)
// app.use(
//   session({
//     secret: "novlife_secret_key_123",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 15 * 60 * 1000 }, // 15 minutes
//   }),
// );

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "publicFolder")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Routes
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`);
});
