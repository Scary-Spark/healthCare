CREATE TABLE prescription_medicines (
    prescription_medicine_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,

    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,        -- e.g., 80mg
    frequency VARCHAR(100) NOT NULL,    -- e.g., Once daily
    duration VARCHAR(50),               -- e.g., 7 days
    instructions VARCHAR(255),          -- e.g., After meals

    FOREIGN KEY (prescription_id)
        REFERENCES prescriptions(prescription_id)
        ON DELETE CASCADE
);