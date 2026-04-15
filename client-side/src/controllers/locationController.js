import { pool } from "../configs/database.js";

// Get all divisions (for dropdown)
export const getDivisions = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL GetDivisions()");
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching divisions:", error);
    res.status(500).json({ error: "Failed to fetch divisions" });
  }
};

// Get districts for a specific division
export const getDistricts = async (req, res) => {
  try {
    const { divisionId } = req.params;

    const [rows] = await pool.query("CALL GetDistrictsByDivision(?)", [
      divisionId,
    ]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching districts:", error);
    res.status(500).json({ error: "Failed to fetch districts" });
  }
};

// Get upazilas for a specific district
export const getUpazilas = async (req, res) => {
  try {
    const { districtId } = req.params;

    const [rows] = await pool.query("CALL GetUpazilasByDistrict(?)", [
      districtId,
    ]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching upazilas:", error);
    res.status(500).json({ error: "Failed to fetch upazilas" });
  }
};

// get upazila details
export const getUpazilaDetails = async (req, res) => {
  try {
    const { upazilaId } = req.params;

    const [rows] = await pool.query("CALL GetUpazilaDetails(?)", [upazilaId]);

    if (rows[0].length === 0) {
      return res.status(404).json({ error: "Upazila not found" });
    }

    res.json(rows[0][0]);
  } catch (error) {
    console.error("Error fetching upazila details:", error);
    res.status(500).json({ error: "Database error" });
  }
};