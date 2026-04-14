CREATE TABLE test_types (
    test_type_id INT AUTO_INCREMENT PRIMARY KEY,
    test_type_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);