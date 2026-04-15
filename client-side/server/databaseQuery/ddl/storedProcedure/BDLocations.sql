-- get divisions
DELIMITER $$
CREATE PROCEDURE GetDivisions()
BEGIN
    SELECT 
        division_id, 
        division_name
    FROM divisions
    ORDER BY division_name ASC;
END $$
DELIMITER ;

-- get distict by divisions
DELIMITER $$
CREATE PROCEDURE GetDistrictsByDivision(IN p_division_id INT)
BEGIN
    SELECT 
        district_id, 
        district_name
    FROM districts
    WHERE division_id = p_division_id
    ORDER BY district_name ASC;
END $$
DELIMITER ;

-- get upazillas by district
DELIMITER $$
CREATE PROCEDURE GetUpazilasByDistrict(IN p_district_id INT)
BEGIN
    SELECT 
        upazila_id, 
        upazila_name
    FROM upazilas
    WHERE district_id = p_district_id
    ORDER BY upazila_name ASC;
END $$
DELIMITER ;

-- get upazila details
DELIMITER $$
CREATE PROCEDURE GetUpazilaDetails(IN p_upazila_id INT)
BEGIN
    SELECT 
        u.upazila_id,
        u.upazila_name,
        d.district_id,
        d.district_name,
        v.division_id,
        v.division_name
    FROM upazilas u
    JOIN districts d ON u.district_id = d.district_id
    JOIN divisions v ON d.division_id = v.division_id
    WHERE u.upazila_id = p_upazila_id;
END $$

DELIMITER ;

-- SHOW PROCEDURE STATUS WHERE Db = DATABASE();