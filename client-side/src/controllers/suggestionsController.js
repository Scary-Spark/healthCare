// src/controllers/suggestionsController.js

import { pool } from "../configs/database.js";

// Get all suggestions with filtering
export const getSuggestions = async (req, res) => {
  try {
    const { search, type, status } = req.query;

    // Base query using your view
    let query = `SELECT * FROM vw_suggestions_full_details`;
    const params = [];
    const conditions = [];

    // Add search filter
    if (search) {
      conditions.push(
        `(title LIKE ? OR description LIKE ? OR person_name LIKE ?)`,
      );
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    // Add type filter (suggestion/complaint)
    if (type) {
      conditions.push(`suggestion_type_name = ?`);
      params.push(type);
    }

    // Add status filter
    if (status) {
      conditions.push(`suggestion_status_name = ?`);
      params.push(status);
    }

    // Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Order by newest first
    query += ` ORDER BY created_at DESC`;

    const [rows] = await pool.query(query, params);

    // Format response for frontend
    const suggestions = rows.map((row) => ({
      id: row.suggestion_id,
      type: row.suggestion_type_name?.toLowerCase() || "suggestion",
      category: row.priority_id ? getPriorityLabel(row.priority_id) : "other",
      title: row.title,
      description: row.description,
      status:
        row.suggestion_status_name?.toLowerCase().replace(/\s+/g, "-") ||
        "pending",
      priority: getPriorityLabel(row.priority_id)?.toLowerCase() || "medium",
      author: row.person_name || "Anonymous",
      avatar: getAvatarInitials(row.person_name),
      date: row.created_at,
      votes: row.total_votes || 0,
      declinedReason:
        row.suggestion_status_name === "Declined"
          ? row.declined_reason || ""
          : "",
      // For voting: check if current user already voted
      isVoted: false, // Will be set per-user in frontend or via separate endpoint
    }));

    res.json({
      success: true,
      suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load suggestions",
    });
  }
};

// Create new suggestion
export const createSuggestion = async (req, res) => {
  try {
    const personId = req.session.client?.personId;
    const { title, description, priority, type } = req.body;

    if (!personId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!title || !description || !priority || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Map frontend values to database IDs
    const priorityId = getPriorityId(priority);
    const suggestionTypeId = getSuggestionTypeId(type);

    if (!priorityId || !suggestionTypeId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid priority or type" });
    }

    // Call stored procedure
    const [rows] = await pool.query(`CALL CreateSuggestion(?, ?, ?, ?, ?)`, [
      personId,
      title,
      description,
      priorityId,
      suggestionTypeId,
    ]);

    const suggestionId = rows[0][0]?.suggestion_id;

    res.json({
      success: true,
      message: "Feedback submitted successfully!",
      data: { suggestionId },
    });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

// In suggestionsController.js, voteSuggestion function:

export const voteSuggestion = async (req, res) => {
  try {
    const personId = req.session.client?.personId;
    const { suggestionId } = req.body;

    console.log("🗳️ Vote request:", { personId, suggestionId });

    // ✅ Validate inputs
    if (!personId) {
      console.warn("⚠️ Vote rejected: No personId in session");
      return res.status(401).json({
        success: false,
        message: "Please log in to vote",
      });
    }

    if (!suggestionId) {
      console.warn("⚠️ Vote rejected: Missing suggestionId");
      return res.status(400).json({
        success: false,
        message: "Missing suggestion ID",
      });
    }

    // Check if already voted
    const [existing] = await pool.query(
      `SELECT vote_id FROM suggestion_votes WHERE suggestion_id = ? AND person_id = ?`,
      [suggestionId, personId],
    );

    if (existing.length > 0) {
      console.log("ℹ️ User already voted");
      return res.status(400).json({
        success: false,
        message: "You already voted on this suggestion",
        alreadyVoted: true, // ✅ Flag for frontend
      });
    }

    // Insert vote
    await pool.query(
      `INSERT INTO suggestion_votes (suggestion_id, person_id) VALUES (?, ?)`,
      [suggestionId, personId],
    );

    // Get updated vote count
    const [count] = await pool.query(
      `SELECT COUNT(*) as total FROM suggestion_votes WHERE suggestion_id = ?`,
      [suggestionId],
    );

    console.log("✅ Vote recorded, new count:", count[0]?.total);

    res.json({
      success: true,
      message: "Vote recorded!",
      data: {
        votes: count[0]?.total || 1,
      },
    });
  } catch (error) {
    console.error("❌ Error voting on suggestion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record vote",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get suggestion details for modal
export const getSuggestionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const personId = req.session.client?.personId;

    const [rows] = await pool.query(
      `SELECT * FROM vw_suggestions_full_details WHERE suggestion_id = ?`,
      [id],
    );

    if (!rows[0]) {
      return res
        .status(404)
        .json({ success: false, message: "Suggestion not found" });
    }

    const suggestion = rows[0];

    // Check if current user voted
    let isVoted = false;
    if (personId) {
      const [vote] = await pool.query(
        `SELECT vote_id FROM suggestion_votes WHERE suggestion_id = ? AND person_id = ?`,
        [id, personId],
      );
      isVoted = vote.length > 0;
    }

    res.json({
      success: true,
      data: {
        ...suggestion,
        isVoted,
        type: suggestion.suggestion_type_name?.toLowerCase(),
        status: suggestion.suggestion_status_name
          ?.toLowerCase()
          .replace(/\s+/g, "-"),
        priority: getPriorityLabel(suggestion.priority_id)?.toLowerCase(),
        author: suggestion.person_name || "Anonymous",
        avatar: getAvatarInitials(suggestion.person_name),
        date: suggestion.created_at,
        votes: suggestion.total_votes || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching suggestion details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load suggestion details",
    });
  }
};

// ===== HELPER FUNCTIONS =====

function getPriorityLabel(id) {
  const labels = { 1: "low", 2: "medium", 3: "high", 4: "critical" };
  return labels[id] || "medium";
}

function getPriorityId(label) {
  const ids = { low: 1, medium: 2, high: 3, critical: 4 };
  return ids[label?.toLowerCase()] || 2;
}

function getSuggestionTypeId(type) {
  const ids = { suggestion: 1, complaint: 2 };
  return ids[type?.toLowerCase()] || 1;
}

function getAvatarInitials(name) {
  if (!name || name === "Anonymous") return "AN";
  const parts = name.split(" ");
  return parts
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
