DELIMITER $$

CREATE PROCEDURE ResetClientPassword(
    IN p_person_id BIGINT,
    IN p_password_hash VARCHAR(255)
)
BEGIN

    UPDATE clients
    SET password_hash = p_password_hash
    WHERE person_id = p_person_id;

    UPDATE password_resets
    SET used = 1
    WHERE person_id = p_person_id;

END$$

DELIMITER ;