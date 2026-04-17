DELIMITER $$

CREATE PROCEDURE CreateSpecialization (
    IN p_specialization_name VARCHAR(100),
    IN p_department_id INT
)
BEGIN
    INSERT INTO specializations (specialization_name, department_id)
    VALUES (p_specialization_name, p_department_id);
END $$

DELIMITER ;