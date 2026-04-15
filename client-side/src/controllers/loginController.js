import crypto from "crypto";
import { pool } from "../configs/database.js";
import { verifyPassword, hashPassword } from "../configs/passwordHashing.js";
import { sendPasswordResetEmail } from "../configs/email.js";

// validate password requirements (for forget password)
function validatePasswordRequirements(password) {
  const errors = [];

  if (!password || password.length < 8 || password.length > 32) {
    errors.push("Password must be between 8 and 32 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain at least 1 uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Must contain at least 1 lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Must contain at least 1 number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'\`~]/.test(password)) {
    errors.push("Must contain at least 1 special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

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
    console.log(user.person_id);

    // always return success for security reasons
    if (!user) {
      return res.json({
        success: true,
        message: "A reset link has been sent.",
      });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    console.log("🔑 Generated token for person_id:", user.person_id);

    const result = await pool.query("CALL CreatePasswordResetToken(?, ?, ?)", [
      user.person_id,
      tokenHash,
      expiresAt,
    ]);

    const baseUrl = process.env.BASE_URL;
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    console.log("📧 Sending reset email to:", user.email);
    console.log("🔗 Reset link:", resetLink);

    const emailResult = await sendPasswordResetEmail(user.email, resetLink);

    if (!emailResult.success) {
      console.error("❌ Email sending failed:", emailResult.error);
    }

    res.json({
      success: true,
      message: "A reset link has been sent.",
    });
  } catch (error) {
    console.log("password reset error: ", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
    });

    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again. From page loginController",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  console.log("🔍 Reset password attempt:");
  console.log(
    "  Token received:",
    token ? token.substring(0, 20) + "..." : "MISSING",
  );
  // console.log("  Password match:", password === confirmPassword);

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
    console.log("  Token hash:", tokenHash.substring(0, 20) + "...");

    const [rows] = await pool.query("CALL VerifyPasswordResetToken(?)", [
      tokenHash,
    ]);
    console.log("📦 RAW DB RESULT:", JSON.stringify(rows, null, 2));

    console.log("  Database result:", rows);
    const record = rows?.[0]?.[0] || rows?.[0] || rows?.[1]?.[0] || null;
    console.log("📦 Parsed record:", record);

    if (!record) {
      console.log("  ❌ No record found - token invalid/expired/used");

      // Debug: Check if token exists at all
      const [debugRows] = await pool.query(
        "SELECT * FROM password_resets WHERE token_hash = ? LIMIT 1",
        [tokenHash],
      );

      if (debugRows.length > 0) {
        const debugToken = debugRows[0];
        console.log("  🔍 Token found but not valid:");
        console.log("    - Expires at:", debugToken.expires_at);
        console.log("    - Used:", debugToken.used);
        console.log("    - Now:", new Date());
        console.log(
          "    - Is expired:",
          new Date() > new Date(debugToken.expires_at),
        );
      } else {
        console.log("  🔍 Token not found in database at all");
      }

      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    console.log("  ✅ Token valid for person_id:", record.person_id);

    const passwordHash = await hashPassword(password);

    await pool.query("CALL ResetClientPassword(?, ?)", [
      record.person_id,
      passwordHash,
    ]);

    console.log("  ✅ Password reset successful");

    res.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
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
