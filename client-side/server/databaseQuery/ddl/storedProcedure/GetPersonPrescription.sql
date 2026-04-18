DELIMITER $$

CREATE PROCEDURE GetPersonPrescriptions(
    IN p_person_id BIGINT
)
BEGIN
    SELECT
        p.prescription_code,
        p.appointment_id,
        p.staff_id,

        CONCAT(s.first_name, ' ', s.last_name) AS staff_full_name,

        p.prescription_status_id,
        ps.status_name AS prescription_status_name,

        p.prescription_date,

        pm.medicine_name,
        pm.dosage,
        pm.frequency,
        pm.duration,
        pm.instructions

    FROM prescriptions p

    INNER JOIN staff s
        ON p.staff_id = s.staff_id

    INNER JOIN prescription_status ps
        ON p.prescription_status_id = ps.prescription_status_id

    LEFT JOIN prescription_medicines pm
        ON p.prescription_id = pm.prescription_id

    WHERE p.person_id = p_person_id

    ORDER BY p.prescription_date DESC;

END$$

DELIMITER ;