CREATE TABLE account_status (
    status_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(30) NOT NULL UNIQUE
);