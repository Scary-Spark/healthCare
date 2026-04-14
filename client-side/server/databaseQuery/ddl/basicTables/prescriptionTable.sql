CREATE TABLE prescriptions (
    prescription_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_code VARCHAR(20) NOT NULL UNIQUE, -- e.g., RX-2024-001

    client_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL UNIQUE,
    staff_id BIGINT NOT NULL, -- Prescribing doctor

    prescription_date DATE NOT NULL,
    valid_until DATE,

    pdf_path VARCHAR(255),

    prescription_status_id TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(client_id)
        ON DELETE CASCADE,

    FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE,

    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON DELETE RESTRICT,

    FOREIGN KEY (prescription_status_id)
        REFERENCES prescription_status(prescription_status_id)
);