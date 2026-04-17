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