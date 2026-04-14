// src/controllers/locationController.js
import { pool } from "../configs/database.js";

/**
 * Get all divisions (for dropdown)
 */
export const getDivisions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT division_id, division_name FROM divisions ORDER BY division_name ASC",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ error: "Failed to fetch divisions" });
  }
};

/**
 * Get districts for a specific division
 */
export const getDistricts = async (req, res) => {
  try {
    const { divisionId } = req.params;

    const [rows] = await pool.query(
      "SELECT district_id, district_name FROM districts WHERE division_id = ? ORDER BY district_name ASC",
      [divisionId],
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching districts:", error);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
};

/**
 * Get upazilas for a specific district
 */
export const getUpazilas = async (req, res) => {
  try {
    const { districtId } = req.params;

    const [rows] = await pool.query(
      "SELECT upazila_id, upazila_name FROM upazilas WHERE district_id = ? ORDER BY upazila_name ASC",
      [districtId],
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching upazilas:", error);
    res.status(500).json({ error: "Failed to fetch upazilas" });
  }
};
