import { pool } from "../configs/database.js";

export const getDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT department_id, department_name 
       FROM vw_doctor_full_schedule 
       WHERE department_id IS NOT NULL 
       ORDER BY department_name ASC`,
    );

    res.json({
      success: true,
      data: rows,
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
          profile_pic_path: row.profile_pic_path || null,
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

export const createAppointment = async (req, res) => {
  try {
    const {
      personId,
      doctorId,
      departmentId,
      specializationId,
      scheduleId,
      preferredDate, // "YYYY-MM-DD"
      bookingType, // 1 = self, 2 = other
      patientInfo,
      reasonForVisit,
    } = req.body;

    if (
      !personId ||
      !doctorId ||
      !departmentId ||
      !scheduleId ||
      !preferredDate ||
      !bookingType
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (bookingType === 2) {
      if (
        !patientInfo?.firstName ||
        !patientInfo?.lastName ||
        !patientInfo?.contactNumber ||
        !patientInfo?.address
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Patient first name, last name, contact number, and address are required",
        });
      }
    }

    // Call stored procedure
    const [result] = await pool.query(
      `CALL CreateAppointment(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        personId,
        doctorId,
        departmentId,
        specializationId,
        scheduleId,
        preferredDate,
        bookingType,
        patientInfo?.firstName || null,
        patientInfo?.lastName || null,
        patientInfo?.contactNumber || null,
        patientInfo?.email || null,
        patientInfo?.address || null,
        reasonForVisit || null,
      ],
    );

    const appointmentId = result[0][0]?.appointment_id;

    if (!appointmentId) {
      throw new Error("Failed to create appointment");
    }

    res.json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("❌ Error creating appointment:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
    });
  }
};

export const getCurrentUserProfile = async (req, res) => {
  try {
    const personId = req.session.client?.personId;

    if (!personId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Fetch address components from view
    const [rows] = await pool.query(
      `SELECT 
        first_name,
        last_name,
        email,
        phone_number,
        upazila_name,
        district_name,
        division_name
       FROM vw_client_full_profile 
       WHERE person_id = ?`,
      [personId],
    );

    console.log("Profile query result for personId", personId, ":", rows);

    if (rows.length === 0) {
      const client = req.session.client;
      if (client) {
        return res.json({
          success: true,
          data: {
            fullName:
              `${client.firstName || ""} ${client.lastName || ""}`.trim(),
            email: client.email,
            phone: client.phone || null,
            address: null,
          },
        });
      }

      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    const profile = rows[0];

    // Concatenate upazila, district, division (skip street_address)
    const addressParts = [
      profile.upazila_name,
      profile.district_name,
      profile.division_name,
    ].filter(Boolean);

    const addressString =
      addressParts.length > 0 ? addressParts.join(", ") : null;

    res.json({
      success: true,
      data: {
        fullName:
          `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
        email: profile.email,
        phone: profile.phone_number,
        address: addressString,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load profile",
    });
  }
};
