CREATE TABLE appointment_status (
    appointment_status_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(100)
);