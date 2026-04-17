DELIMITER $$

CREATE PROCEDURE CreateDoctorSchedule (
    IN p_staff_id BIGINT,
    IN p_slot_id TINYINT,
    IN p_available_day TINYINT
)
BEGIN
    INSERT INTO doctor_schedules (
        staff_id,
        slot_id,
        available_day
    )
    VALUES (
        p_staff_id,
        p_slot_id,
        p_available_day
    );
END $$

DELIMITER ;