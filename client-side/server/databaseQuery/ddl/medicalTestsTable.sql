CREATE TABLE medical_tests (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(150) NOT NULL,
    test_type_id INT NOT NULL,
    UNIQUE (test_name, test_type_id),
    FOREIGN KEY (test_type_id)
        REFERENCES test_types(test_type_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);