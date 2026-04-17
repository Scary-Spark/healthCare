import { pool } from "../configs/database.js";

// ✅ 1. Get all departments
export const getDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT department_id, department_name 
       FROM vw_doctor_full_schedule 
       WHERE department_id IS NOT NULL 
       ORDER BY department_name ASC`,
    );

    // ✅ FIX: Return "data" key to match frontend expectation
    res.json({
      success: true,
      data: rows, // ← Changed from "rows" to "data"
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM vw_doctor_full_schedule`);
    const doctorsMap = new Map();

    rows.forEach((row) => {
      const doctorId = row.staff_id;
      if (!doctorsMap.has(doctorId)) {
        doctorsMap.set(doctorId, {
          id: `d${doctorId}`,
          name: row.staff_name || "Unknown Doctor",
          dept: row.department_name?.toLowerCase() || "general",
          profile_pic_path: row.profile_pic_path || null, // ✅ ADDED
          availableDates: [],
          availableDays: [],
          timeSlots: [],
          department_id: row.department_id,
          department_name: row.department_name,
          specialization_id: row.specialization_id,
          specialization_name: row.specialization_name,
          staff_id: row.staff_id,
          slot_id: row.slot_id,
          start_time: row.start_time,
          end_time: row.end_time,
          day_id: row.day_id,
          day_name: row.day_name,
        });
      }

      const doctor = doctorsMap.get(doctorId);
      if (row.day_name && !doctor.availableDays.includes(row.day_name))
        doctor.availableDays.push(row.day_name);
      if (row.start_time && !doctor.timeSlots.includes(row.start_time))
        doctor.timeSlots.push(row.start_time);
    });

    res.json({ success: true, data: Array.from(doctorsMap.values()) });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Failed" });
  }
};
