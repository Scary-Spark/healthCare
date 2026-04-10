-- Divisions Table
CREATE TABLE divisions (
    division_id INT AUTO_INCREMENT PRIMARY KEY,
    division_name VARCHAR(50) NOT NULL UNIQUE
);

-- Districts Table
CREATE TABLE districts (
    district_id INT AUTO_INCREMENT PRIMARY KEY,
    district_name VARCHAR(50) NOT NULL,
    division_id INT NOT NULL,
    UNIQUE (district_name, division_id),
    FOREIGN KEY (division_id)
        REFERENCES divisions(division_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Upazilas Table
CREATE TABLE upazilas (
    upazila_id INT AUTO_INCREMENT PRIMARY KEY,
    upazila_name VARCHAR(100) NOT NULL,
    district_id INT NOT NULL,
    UNIQUE (upazila_name, district_id),
    FOREIGN KEY (district_id)
        REFERENCES districts(district_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);