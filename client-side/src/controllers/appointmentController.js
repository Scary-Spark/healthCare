import { pool } from "../configs/database.js";
import { generateAppointmentPDF } from "../configs/pdfGenerator.js";

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

// src/controllers/appointmentController.js

// ✅ NEW: Get patient's appointment history
export const getAppointmentHistory = async (req, res) => {
  try {
    const personId = req.session.client?.personId;

    if (!personId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("🔍 Fetching appointment history for personId:", personId);

    // Call stored procedure
    const [rows] = await pool.query(`CALL GetPatientAppointmentHistory(?)`, [
      personId,
    ]);

    console.log("📊 Stored procedure result:", rows);

    // Stored procedures return nested arrays - get first result set
    const appointments = rows[0] || [];

    console.log(`✅ Found ${appointments.length} appointments`);

    // ✅ Map visit_status to proper type
    const VISIT_TYPE_MAP = {
      ADMISSION: "admission",
      OUTPATIENT: "outpatient",
      EMERGENCY: "emergency",
      "FOLLOW-UP": "followup",
      // Fallbacks
      admission: "admission",
      outpatient: "outpatient",
      emergency: "emergency",
      "follow-up": "followup",
      followup: "followup",
    };

    // Format data for frontend - handle ALL nullable fields
    const formattedHistory = appointments.map((apt) => {
      // ✅ Get type from visit_status (not from check_in/check_out times)
      const rawStatus = apt.visit_status || apt.appointment_status || "";
      const type = VISIT_TYPE_MAP[rawStatus.toUpperCase()] || "outpatient";

      return {
        id: apt.appointment_id,
        visitId: apt.visit_id || null,
        type: type, // ✅ Now properly mapped from visit_status
        doctor: apt.doctor_name || "Unknown Doctor",
        department: apt.department_name || "General",
        diagnosis: apt.diagnosis_name || "No diagnosis recorded",
        appointmentDate: apt.appointment_date,
        admissionDate: apt.check_in_time || null,
        dischargeDate: apt.check_out_time || null,
        status: apt.appointment_status?.toLowerCase() || "pending",
        visitStatus: apt.visit_status || null,
        appointmentStatus: apt.appointment_status || null,
      };
    });

    res.json({
      success: true,
      data: formattedHistory, // ✅ Changed to "data" to match frontend
      count: formattedHistory.length,
    });
  } catch (error) {
    console.error("❌ Error fetching appointment history:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    res.status(500).json({
      success: false,
      message: "Failed to load appointment history",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const downloadAppointmentPDF = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const personId = req.session.client?.personId;

    if (!personId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Fetch specific appointment data using updated stored procedure
    const [rows] = await pool.query(`CALL GetPatientAppointmentHistory(?)`, [
      personId,
    ]);

    const appointments = rows[0] || [];
    const record = appointments.find((a) => a.appointment_id == appointmentId);

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Generate PDF
    const pdfBuffer = await generateAppointmentPDF(record);

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Appointment-${record.visit_id || record.appointment_id}.pdf"`,
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const personId = req.session.client?.personId;

    if (!personId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("🔍 Fetching prescriptions for personId:", personId);

    // Call stored procedure
    const [rows] = await pool.query(`CALL GetPersonPrescriptions(?)`, [
      personId,
    ]);

    console.log("📊 Stored procedure result:", rows);

    // Stored procedures return nested arrays - get first result set
    const prescriptionRows = rows[0] || [];

    console.log(`✅ Found ${prescriptionRows.length} prescription rows`);

    // Group medicines by prescription (since one prescription can have multiple medicines)
    const prescriptionsMap = new Map();

    prescriptionRows.forEach((row) => {
      const prescriptionId = row.prescription_code;

      if (!prescriptionsMap.has(prescriptionId)) {
        prescriptionsMap.set(prescriptionId, {
          id: prescriptionId,
          refNumber: row.prescription_code,
          appointmentId: row.appointment_id,
          doctor: row.staff_full_name,
          datePrescribed: row.prescription_date,
          status: row.prescription_status_name?.toLowerCase() || "active",
          medications: [],
        });
      }

      // Add medicine if exists
      if (row.medicine_name) {
        const prescription = prescriptionsMap.get(prescriptionId);
        prescription.medications.push({
          name: row.medicine_name,
          dosage: row.dosage,
          frequency: row.frequency,
          duration: row.duration,
          instructions: row.instructions,
        });
      }
    });

    // Convert map to array
    const prescriptions = Array.from(prescriptionsMap.values());

    // Sort by date descending
    prescriptions.sort(
      (a, b) => new Date(b.datePrescribed) - new Date(a.datePrescribed),
    );

    console.log(`✅ Grouped into ${prescriptions.length} unique prescriptions`);

    res.json({
      success: true,
      data: prescriptions,
      count: prescriptions.length,
    });
  } catch (error) {
    console.error("❌ Error fetching prescriptions:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    res.status(500).json({
      success: false,
      message: "Failed to load prescriptions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getTestReports = async (req, res) => {
  try {
    const personId = req.session.client?.personId;

    if (!personId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("🔍 Fetching test reports for personId:", personId);

    // Call stored procedure
    const [rows] = await pool.query(`CALL GetPatientTestReports(?)`, [
      personId,
    ]);

    console.log("📊 Stored procedure result:", rows);

    // Stored procedures return nested arrays - get first result set
    const reportRows = rows[0] || [];

    // Group results by test report (since one test can have multiple result parameters)
    const reportsMap = new Map();

    reportRows.forEach((row) => {
      const reportRef = row.report_reference;

      if (!reportsMap.has(reportRef)) {
        reportsMap.set(reportRef, {
          id: reportRef, // Use reference as ID
          refNumber: row.report_reference,
          testName: row.test_name,
          testType: row.test_name?.toLowerCase().includes("blood")
            ? "blood"
            : row.test_name?.toLowerCase().includes("urine")
              ? "urine"
              : row.test_name?.toLowerCase().includes("x-ray")
                ? "xray"
                : row.test_name?.toLowerCase().includes("mri")
                  ? "mri"
                  : row.test_name?.toLowerCase().includes("ct")
                    ? "ct"
                    : "other",
          doctor: row.doctor_name,
          performedBy: row.test_status_name || "Lab",
          date: row.test_date,
          status: row.test_status_name?.toLowerCase() || "pending",
          appointmentDate: row.appointment_date,
          department: row.department_name,
          results: [],
        });
      }

      // Add result parameter if exists
      if (row.parameter_name) {
        const report = reportsMap.get(reportRef);
        report.results.push({
          parameter: row.parameter_name,
          value: row.result_value,
          unit: row.unit,
          referenceRange: row.reference_range,
          remarks: row.result_remarks,
          // Determine if normal based on reference range (simple check)
          normal:
            row.result_value && row.reference_range
              ? row.reference_range.toLowerCase().includes("normal") ||
                !row.result_remarks?.toLowerCase().includes("abnormal")
              : true,
        });
      }
    });

    // Convert map to array and sort by date descending
    const reports = Array.from(reportsMap.values());
    reports.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log(`✅ Grouped into ${reports.length} unique test reports`);

    res.json({
      success: true,
      reports,
      count: reports.length,
    });
  } catch (error) {
    console.error("❌ Error fetching test reports:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    res.status(500).json({
      success: false,
      message: "Failed to load test reports",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
