CREATE TABLE payment_types (
    payment_type_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    payment_type_name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(100)
);