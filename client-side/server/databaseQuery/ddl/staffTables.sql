CREATE TABLE staff (
    staff_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    person_id BIGINT NOT NULL UNIQUE,
    role_id TINYINT NOT NULL,
    specialization_id INT NULL,
    license_number VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (person_id) REFERENCES persons(person_id),
    FOREIGN KEY (role_id) REFERENCES staff_roles(role_id),
    FOREIGN KEY (specialization_id)
        REFERENCES specializations(specialization_id)
        ON DELETE SET NULL
);