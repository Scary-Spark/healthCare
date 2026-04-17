DELIMITER $$

CREATE PROCEDURE CreateDepartment (
    IN p_department_name VARCHAR(100),
    IN p_description VARCHAR(255)
)
BEGIN
    INSERT INTO departments (department_name, description)
    VALUES (p_department_name, p_description);
END $$

DELIMITER ;