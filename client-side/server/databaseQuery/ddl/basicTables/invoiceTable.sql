CREATE TABLE invoices (
    invoice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_reference VARCHAR(20) NOT NULL UNIQUE, -- INV-2024-001

    client_id BIGINT NOT NULL,
    appointment_id BIGINT NULL,
    test_report_id BIGINT NULL,
    prescription_id BIGINT NULL,

    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,

    service_description VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),

    invoice_status_id TINYINT NOT NULL,
    remarks TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(client_id),

    FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE SET NULL,

    FOREIGN KEY (test_report_id)
        REFERENCES test_reports(test_report_id)
        ON DELETE SET NULL,

    FOREIGN KEY (prescription_id)
        REFERENCES prescriptions(prescription_id)
        ON DELETE SET NULL,

    FOREIGN KEY (invoice_status_id)
        REFERENCES invoice_status(invoice_status_id)
);