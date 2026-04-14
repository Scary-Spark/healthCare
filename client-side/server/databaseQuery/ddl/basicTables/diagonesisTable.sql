CREATE TABLE diagnoses (
    diagnosis_id INT AUTO_INCREMENT PRIMARY KEY,
    diagnosis_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);