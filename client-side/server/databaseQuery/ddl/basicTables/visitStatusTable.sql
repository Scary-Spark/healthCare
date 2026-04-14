CREATE TABLE visit_status (
    visit_status_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(100)
);