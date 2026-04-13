import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect environment (fallback included for cPanel safety)
const env = process.env.NODE_ENV || "development";

// Load correct .env file BEFORE using any env variables
const envFile = env === "production" ? ".env.production" : ".env";

dotenv.config({
  path: path.resolve(__dirname, "../../", envFile),
});

// Now import MySQL AFTER dotenv is loaded
import mysql from "mysql2/promise";

// Create connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_MAX || 5),
  queueLimit: 0,
});

// Optional: test connection (safe for dev, silent in production)
(async () => {
  try {
    const conn = await pool.getConnection();

    if (env !== "production") {
      console.log(`✅ DB Connected: ${process.env.DB_NAME} (${env})`);
    }

    conn.release();
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
})();
