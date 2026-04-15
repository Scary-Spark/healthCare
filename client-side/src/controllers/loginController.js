import crypto from "crypto";
import { pool } from "../configs/database.js";
import { verifyPassword } from "../configs/passwordHashing.js";
import { sendPasswordResetEmail } from "../configs/email.js";

// handle client login
export const loginClient = async (req, res) => {
  const { identifier, password, remember } = req.body;

  // validate input
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Email/phone and password are required",
    });
  }

  try {
    // validate email or phone
    const [rows] = await pool.query("CALL LoginClient(?)", [
      identifier.trim().toLowerCase(),
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone or password",
      });
    }

    const client = rows[0][0];

    // verify password with Argon2
    const isPasswordValid = await verifyPassword(
      password,
      client.password_hash,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone or password",
      });
    }

    // update last login
    await pool.query("CALL UpdateLastLogin(?, ?)", [
      client.person_id,
      req.ip || req.connection.remoteAddress,
    ]);

    // create a secure session
    req.session.client = {
      clientId: client.client_id,
      personId: client.person_id,
      email: client.email,
      firstName: client.first_name,
      lastName: client.last_name,
      isAuthenticated: true,
    };

    // if remember me is checked
    // then login for 30 days
    if (remember) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    }

    // return success
    res.json({
      success: true,
      message: "Login successful",
      user: {
        firstName: client.first_name,
        lastName: client.last_name,
        email: client.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

// password reset request handler
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }

  try {
    const [rows] = await pool.query("CALL CheckClientEmail(?)", [
      email.trim().toLowerCase(),
    ]);

    const user = rows[0][0];

    // always return success for security reasons
    if (!user) {
      return res.json({
        success: true,
        message: "A reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // store the token
    await pool.query("CALL CreatePasswordResetToken(?, ?, ?)", [
      user.person_id,
      tokenHash,
      expiresAt,
    ]);

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, resetLink);

    res.json({
      success: true,
      message: "A reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing token.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await pool.query("CALL VerifyPasswordResetToken(?)", [
      tokenHash,
    ]);

    const record = rows[0][0];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const passwordHash = await hashPassword(password);

    await pool.query("CALL ResetClientPassword(?, ?)", [
      record.person_id,
      passwordHash,
    ]);

    res.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred.",
    });
  }
};

// logout logic
export const logoutClient = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Adjust cookie name if using custom session config
    res.json({ success: true, message: "Logged out successfully" });
  });
};

// get current authenticate client (for dashboard)
export const getCurrentClient = (req, res) => {
  if (req.session.client?.isAuthenticated) {
    res.json({
      success: true,
      user: req.session.client,
    });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
};
