DELIMITER $$

CREATE PROCEDURE VerifyPasswordResetToken(
    IN p_token_hash VARCHAR(255)
)
BEGIN
    SELECT person_id
    FROM password_resets
    WHERE token_hash = p_token_hash
      AND expires_at > NOW()
      AND used = 0
    LIMIT 1;
END$$

DELIMITER ;