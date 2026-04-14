CREATE TABLE appointment_diagnoses (
    appointment_diagnosis_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    diagnosis_id INT NOT NULL,
    notes TEXT,
    diagnosed_by BIGINT NOT NULL,
    diagnosed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (diagnosis_id)
        REFERENCES diagnoses(diagnosis_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (diagnosed_by)
        REFERENCES staff(staff_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    UNIQUE (appointment_id, diagnosis_id)
);