CREATE TABLE payment_methods (
    payment_method_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(100)
);