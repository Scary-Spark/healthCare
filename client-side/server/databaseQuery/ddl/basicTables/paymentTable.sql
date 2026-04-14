CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_reference VARCHAR(20) NOT NULL UNIQUE, -- TXN-2024-001

    client_id BIGINT NOT NULL,
    payment_type_id TINYINT NOT NULL,
    payment_status_id TINYINT NOT NULL,
    payment_method_id TINYINT NOT NULL,

    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    service_description VARCHAR(255) NOT NULL,

    appointment_id BIGINT NULL,
    test_report_id BIGINT NULL,
    prescription_id BIGINT NULL,

    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(client_id)
        ON DELETE CASCADE,

    FOREIGN KEY (payment_type_id)
        REFERENCES payment_types(payment_type_id),

    FOREIGN KEY (payment_status_id)
        REFERENCES payment_status(payment_status_id),

    FOREIGN KEY (payment_method_id)
        REFERENCES payment_methods(payment_method_id),

    FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE SET NULL,

    FOREIGN KEY (test_report_id)
        REFERENCES test_reports(test_report_id)
        ON DELETE SET NULL,

    FOREIGN KEY (prescription_id)
        REFERENCES prescriptions(prescription_id)
        ON DELETE SET NULL
);

ALTER TABLE payments
ADD COLUMN invoice_id BIGINT NULL,
ADD CONSTRAINT fk_payments_invoice
FOREIGN KEY (invoice_id)
    REFERENCES invoices(invoice_id)
    ON DELETE SET NULL;