DELIMITER $$

CREATE PROCEDURE CheckClientEmail(
    IN p_email VARCHAR(120)
)
BEGIN
    SELECT person_id, email
    FROM clients
    WHERE email = p_email
    LIMIT 1;
END $$

DELIMITER ;