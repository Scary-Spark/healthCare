CREATE TABLE appointments (
    appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,

    staff_id BIGINT NOT NULL,

    department_id INT NOT NULL,
    specialization_id INT NOT NULL,

    schedule_id BIGINT NOT NULL,
    preferred_date DATE NOT NULL,

    booking_type_id TINYINT NOT NULL,

    appointment_patient_id BIGINT NULL,

    reason_for_visit TEXT NOT NULL,

    diagnosis_name VARCHAR(255) NULL, -- Added column

    appointment_status_id TINYINT NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(client_id),

    FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id),

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id),

    FOREIGN KEY (specialization_id)
        REFERENCES specializations(specialization_id),

    FOREIGN KEY (schedule_id)
        REFERENCES doctor_schedules(schedule_id),

    FOREIGN KEY (booking_type_id)
        REFERENCES booking_types(booking_type_id),

    FOREIGN KEY (appointment_patient_id)
        REFERENCES appointment_patients(appointment_patient_id),

    FOREIGN KEY (appointment_status_id)
        REFERENCES appointment_status(appointment_status_id),

    CONSTRAINT chk_booking_type
    CHECK (
        (booking_type_id = 1 AND appointment_patient_id IS NULL) OR
        (booking_type_id = 2 AND appointment_patient_id IS NOT NULL)
    )
);

drop table appointments;

ALTER TABLE appointments
ADD COLUMN diagnosis_name VARCHAR(255) NULL
AFTER reason_for_visit;

ALTER table appointments
drop COLUMN diagnosis_name;