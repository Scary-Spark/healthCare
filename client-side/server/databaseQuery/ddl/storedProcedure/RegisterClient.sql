DELIMITER $$

CREATE PROCEDURE RegisterClient(
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_dob DATE,
    IN p_gender_id TINYINT,
    IN p_blood_group_id TINYINT,
    IN p_email VARCHAR(120),
    IN p_phone VARCHAR(20),
    IN p_password_hash VARCHAR(255),
    IN p_upazila_id INT,
    IN p_postal_code INT,
    IN p_street_address TEXT,
    IN p_status_id TINYINT,
    IN p_last_login_ip VARCHAR(45)
)
BEGIN
    DECLARE v_person_id BIGINT;

    -- Handle errors and rollback automatically
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Generate unique person ID
    SET v_person_id = UUID_SHORT();

    -- Insert into persons
    INSERT INTO persons (
        person_id,
        first_name,
        last_name,
        date_of_birth,
        gender_id,
        blood_group_id
    )
    VALUES (
        v_person_id,
        p_first_name,
        p_last_name,
        p_dob,
        p_gender_id,
        p_blood_group_id
    );

    -- Insert into person_address
    INSERT INTO person_address (
        person_id,
        upazila_id,
        postal_code,
        street_address
    )
    VALUES (
        v_person_id,
        p_upazila_id,
        p_postal_code,
        p_street_address
    );

    -- Insert into clients
    INSERT INTO clients (
        person_id,
        email,
        phone_number,
        password_hash,
        status_id,
        last_login_ip
    )
    VALUES (
        v_person_id,
        p_email,
        p_phone,
        p_password_hash,
        p_status_id,
        p_last_login_ip
    );

    COMMIT;
END $$

DELIMITER ;