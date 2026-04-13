CREATE TABLE clients (
    client_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    person_id BIGINT NOT NULL UNIQUE,

    email VARCHAR(120) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    status_id TINYINT NOT NULL,

    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_ip VARCHAR(45),

    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (person_id) REFERENCES persons(person_id),
    FOREIGN KEY (status_id) REFERENCES account_status(status_id)
);