// src/controllers/logsController.js

import { pool } from "../configs/database.js";

export const getActivityLogs = async (req, res) => {
  try {
    const personId = req.session.client?.personId;
    const { action, days } = req.query;

    if (!personId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    let query = `SELECT * FROM client_logs WHERE person_id = ?`;
    const params = [personId];

    // Filter by action type
    if (action) {
      query += ` AND action_type = ?`;
      params.push(action);
    }

    // Filter by date range
    if (days && days !== "all") {
      query += ` AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`;
      params.push(parseInt(days));
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load activity logs",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
