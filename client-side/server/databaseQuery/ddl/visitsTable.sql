CREATE TABLE visits (
    visit_id CHAR(20) PRIMARY KEY,

    appointment_id BIGINT NOT NULL UNIQUE,

    check_in_time TIMESTAMP NULL,
    check_out_time TIMESTAMP NULL,

    visit_status_id TINYINT NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (visit_status_id)
        REFERENCES visit_status(visit_status_id)
);

drop Table visits;