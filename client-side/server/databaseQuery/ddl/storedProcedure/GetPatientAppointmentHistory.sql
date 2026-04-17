DELIMITER $$

CREATE PROCEDURE GetPatientAppointmentHistory(
    IN p_person_id BIGINT
)
BEGIN
    SELECT
        a.appointment_id,

        v.visit_id,

        vs.status_name AS visit_status,
        aps.status_name AS appointment_status,

        CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,

        d.department_name,

        a.preferred_date AS appointment_date,

        v.check_in_time,
        v.check_out_time,

        ad.diagnosis_name

    FROM appointments a

    LEFT JOIN visits v 
        ON a.appointment_id = v.appointment_id

    LEFT JOIN visit_status vs 
        ON v.visit_status_id = vs.visit_status_id

    INNER JOIN appointment_status aps 
        ON a.appointment_status_id = aps.appointment_status_id

    INNER JOIN staff s 
        ON a.staff_id = s.staff_id

    INNER JOIN departments d 
        ON a.department_id = d.department_id

    LEFT JOIN appointment_diagnoses ad 
        ON a.appointment_id = ad.appointment_id

    WHERE a.person_id = p_person_id

    ORDER BY a.preferred_date DESC;

END$$

DELIMITER ;



drop Procedure `GetPatientAppointmentHistory`;


-- new
DELIMITER $$

CREATE PROCEDURE GetPatientAppointmentHistory(
    IN p_person_id BIGINT
)
BEGIN
    SELECT
        -- Appointment / Visit
        a.appointment_id,
        v.visit_id,

        vs.status_name AS visit_status,
        aps.status_name AS appointment_status,

        a.preferred_date AS appointment_date,
        v.check_in_time,
        v.check_out_time,

        -- Patient (logged-in person)
        CONCAT(p.first_name, ' ', p.last_name) AS patient_full_name,
        g.gender_name AS patient_gender,
        c.phone_number AS patient_phone,

        -- Doctor
        CONCAT(s.first_name, ' ', s.last_name) AS doctor_name,

        -- Department
        d.department_name,

        -- Appointment Patient (if booking for OTHER)
        ap.first_name AS other_first_name,
        ap.last_name AS other_last_name,
        ap.contact_number AS other_contact,
        ap.email AS other_email,
        ap.address AS other_address,

        -- Diagnosis
        ad.diagnosis_name,
        ad.notes

    FROM appointments a

    -- Visit
    LEFT JOIN visits v 
        ON a.appointment_id = v.appointment_id

    LEFT JOIN visit_status vs 
        ON v.visit_status_id = vs.visit_status_id

    -- Appointment Status
    INNER JOIN appointment_status aps 
        ON a.appointment_status_id = aps.appointment_status_id

    -- Doctor
    INNER JOIN staff s 
        ON a.staff_id = s.staff_id

    -- Department
    INNER JOIN departments d 
        ON a.department_id = d.department_id

    -- Diagnosis
    LEFT JOIN appointment_diagnoses ad 
        ON a.appointment_id = ad.appointment_id

    -- Logged-in person
    INNER JOIN persons p 
        ON a.person_id = p.person_id

    INNER JOIN genders g 
        ON p.gender_id = g.gender_id

    INNER JOIN clients c 
        ON c.person_id = p.person_id

    -- Other patient (if exists)
    LEFT JOIN appointment_patients ap 
        ON a.appointment_patient_id = ap.appointment_patient_id

    WHERE a.person_id = p_person_id

    ORDER BY a.preferred_date DESC;

END$$

DELIMITER ;