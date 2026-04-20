// src/controllers/chatController.js

import { pool } from "../configs/database.js";

// Get recent public chat messages
export const getChatMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    // Fetch recent messages using the view
    const [rows] = await pool.query(
      `SELECT * FROM vw_public_chat_messages ORDER BY sent_at DESC LIMIT ?`,
      [limit],
    );

    // Reverse to show oldest first in UI
    const messages = rows.reverse();

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load chat messages",
    });
  }
};

// Send a new chat message (also handled via Socket.io, but keep REST endpoint for fallback)
export const sendChatMessage = async (req, res) => {
  try {
    const personId = req.session.client?.personId;
    const { text } = req.body;

    if (!personId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!text || text.trim().length === 0 || text.length > 500) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid message" });
    }

    // Insert message
    const [result] = await pool.query(
      `INSERT INTO public_chat_messages (person_id, message_text) VALUES (?, ?)`,
      [personId, text.trim()],
    );

    // Fetch the inserted message with sender details
    const [rows] = await pool.query(
      `SELECT * FROM vw_public_chat_messages WHERE message_id = ?`,
      [result.insertId],
    );

    res.json({
      success: true,
      message: "Message sent",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
