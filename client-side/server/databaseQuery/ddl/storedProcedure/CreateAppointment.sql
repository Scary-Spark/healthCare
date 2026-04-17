DELIMITER $$

CREATE PROCEDURE CreateAppointment(
    IN p_person_id BIGINT,
    IN p_staff_id BIGINT,
    IN p_department_id INT,
    IN p_specialization_id INT,
    IN p_schedule_id BIGINT,
    IN p_preferred_date DATE,
    IN p_booking_type_id TINYINT,

    -- Patient info (only used if booking_type = 2)
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_contact_number VARCHAR(20),
    IN p_email VARCHAR(120),
    IN p_address VARCHAR(255),

    IN p_reason_for_visit TEXT
)
BEGIN
    DECLARE v_patient_id BIGINT DEFAULT NULL;

    -- If booking for OTHER → insert into appointment_patients
    IF p_booking_type_id = 2 THEN
        INSERT INTO appointment_patients (
            first_name,
            last_name,
            contact_number,
            email,
            address
        )
        VALUES (
            p_first_name,
            p_last_name,
            p_contact_number,
            p_email,
            p_address
        );

        SET v_patient_id = LAST_INSERT_ID();
    END IF;

    -- Insert into appointments
    INSERT INTO appointments (
        person_id,
        staff_id,
        department_id,
        specialization_id,
        schedule_id,
        preferred_date,
        booking_type_id,
        appointment_patient_id,
        reason_for_visit
    )
    VALUES (
        p_person_id,
        p_staff_id,
        p_department_id,
        p_specialization_id,
        p_schedule_id,
        p_preferred_date,
        p_booking_type_id,
        v_patient_id,
        p_reason_for_visit
    );

    -- Return appointment ID
    SELECT LAST_INSERT_ID() AS appointment_id;

END$$

DELIMITER ;

