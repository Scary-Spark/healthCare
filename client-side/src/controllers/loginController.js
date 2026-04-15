import { pool } from "../configs/database.js";
import { verifyPassword } from "../configs/passwordHashing.js";

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
