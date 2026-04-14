// src/main/main.js
import express from "express";
import session from "express-session";
import __dirname from "../../clientPath.js";
import path from "path";
import router from "../routes/homeRoutes.js";
import dotenv from "dotenv";

// Load environment variables (supports both local and cPanel)
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.resolve(__dirname, "../../", envFile) });

// Creating server
const app = express();
const PORT = process.env.PORT || 3000;

// Session Middleware (for OTP and Verification State)
app.use(
  session({
    secret: "novlife_secret_key_123", 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 15 * 60 * 1000 }, // 15 minutes
  }),
);

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
