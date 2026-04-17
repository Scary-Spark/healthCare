DELIMITER $$

CREATE PROCEDURE CreateStaff (
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_email VARCHAR(120),
    IN p_role_id TINYINT,
    IN p_specialization_id INT,
    IN p_license_number VARCHAR(50),
    IN p_is_active BOOLEAN
)
BEGIN
    INSERT INTO staff (
        first_name,
        last_name,
        phone,
        email,
        role_id,
        specialization_id,
        license_number,
        is_active
    )
    VALUES (
        p_first_name,
        p_last_name,
        p_phone,
        p_email,
        p_role_id,
        p_specialization_id,
        p_license_number,
        p_is_active
    );
END $$

DELIMITER ;