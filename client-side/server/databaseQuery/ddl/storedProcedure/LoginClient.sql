-- fetch data from view then join with client (for password)
DELIMITER $$
CREATE PROCEDURE LoginClient(IN p_identifier VARCHAR(120))
BEGIN
    SELECT 
        v.client_id,
        v.person_id,
        v.email,
        v.phone_number,
        v.first_name,
        v.last_name,
        v.status_id,
        v.status_name,

        c.password_hash

    FROM vw_client_full_profile v
    JOIN clients c ON c.client_id = v.client_id

    WHERE 
        v.email = p_identifier
        OR v.phone_number = p_identifier
    LIMIT 1;
END $$
DELIMITER ;