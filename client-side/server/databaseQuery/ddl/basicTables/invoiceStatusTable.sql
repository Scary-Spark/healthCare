CREATE TABLE invoice_status (
    invoice_status_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100)
);