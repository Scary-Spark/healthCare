CREATE TABLE test_reports (
    test_report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_reference VARCHAR(20) NOT NULL UNIQUE, -- TR-2024-001

    client_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL,

    test_id INT NOT NULL,
    prescribed_by BIGINT NOT NULL,  -- Doctor
    performed_by BIGINT NOT NULL,   -- Lab technician
    department_id INT NOT NULL,

    appointment_date DATE NOT NULL,
    test_date DATE,

    test_status_id TINYINT NOT NULL DEFAULT 1,
    pdf_path VARCHAR(255),

    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(client_id)
        ON DELETE CASCADE,

    FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE,

    FOREIGN KEY (test_id)
        REFERENCES medical_tests(test_id),

    FOREIGN KEY (prescribed_by)
        REFERENCES staff(staff_id),

    FOREIGN KEY (performed_by)
        REFERENCES staff(staff_id),

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id),

    FOREIGN KEY (test_status_id)
        REFERENCES test_status(test_status_id)
);