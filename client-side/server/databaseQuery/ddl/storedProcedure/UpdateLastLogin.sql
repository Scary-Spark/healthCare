DELIMITER $$
CREATE PROCEDURE UpdateLastLogin(
    IN p_person_id BIGINT,
    IN p_ip VARCHAR(45)
)
BEGIN
    UPDATE clients
    SET 
        last_login_at = NOW(),
        last_login_ip = p_ip
    WHERE person_id = p_person_id;
END $$
DELIMITER ;