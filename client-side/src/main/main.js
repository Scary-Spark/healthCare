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

app.set("trust proxy", 1); // trust proxy for cpanel
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
app.set("view cache", false);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// send data into all view
app.use(async (req, res, next) => {
  try {
    if (req.session.client?.isAuthenticated && req.session.client.personId) {
      console.log("👤 Session client:", {
        personId: req.session.client.personId,
        firstName: req.session.client.firstName,
        email: req.session.client.email,
      });

      // ✅ CORRECT IMPORT PATH
      const { getUserData } =
        await import("../controllers/clientController.js");
      const userData = await getUserData(req.session.client.personId);

      if (userData) {
        console.log("✅ User data injected:", userData);
        res.locals.user = userData;
      } else {
        console.log("⚠️ No user data found, using session fallback");
        // Fallback to session data if DB query fails
        res.locals.user = {
          fullName: `${req.session.client.firstName} ${req.session.client.lastName}`,
          email: req.session.client.email,
          profilePic: `/uploads/profilePictures/defaultProfilePic.jpg`,
          personId: req.session.client.personId,
        };
      }
    } else {
      console.log("⚠️ No authenticated session");
      res.locals.user = null;
    }
  } catch (error) {
    console.error("❌ Error injecting user ", error);
    // Fallback to session data on error
    if (req.session.client?.isAuthenticated) {
      res.locals.user = {
        fullName: `${req.session.client.firstName} ${req.session.client.lastName}`,
        email: req.session.client.email,
        profilePic: `/uploads/profilePictures/defaultProfilePic.jpg`,
        personId: req.session.client.personId,
      };
    } else {
      res.locals.user = null;
    }
  }
  next();
});

// Routes
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`);
});
