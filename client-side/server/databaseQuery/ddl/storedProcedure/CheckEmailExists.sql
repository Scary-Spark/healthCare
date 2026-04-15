DELIMITER $$

CREATE PROCEDURE CheckClientEmail(
    IN p_email VARCHAR(120)
)
BEGIN
    SELECT 
        c.person_id,
        c.client_id,
        c.email
    FROM clients c
    INNER JOIN persons p ON p.person_id = c.person_id
    WHERE c.email = p_email
    LIMIT 1;
END$$

DELIMITER ;