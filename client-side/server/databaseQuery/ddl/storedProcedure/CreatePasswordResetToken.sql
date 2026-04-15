DELIMITER $$

CREATE PROCEDURE CreatePasswordResetToken(
    IN p_person_id BIGINT,
    IN p_token_hash VARCHAR(255),
    IN p_expires_at DATETIME
)
BEGIN

    -- ensure valid person exists
    IF EXISTS (SELECT 1 FROM persons WHERE person_id = p_person_id) THEN

        DELETE FROM password_resets WHERE person_id = p_person_id;

        INSERT INTO password_resets (person_id, token_hash, expires_at)
        VALUES (p_person_id, p_token_hash, p_expires_at);

    END IF;

END$$

DELIMITER ;