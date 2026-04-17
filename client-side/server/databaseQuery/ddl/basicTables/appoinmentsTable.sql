CREATE TABLE appointments (
    appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    person_id BIGINT NOT NULL, -- replaced client_id

    staff_id BIGINT NOT NULL,

    department_id INT NOT NULL,
    specialization_id INT NOT NULL,

    schedule_id BIGINT NOT NULL,
    preferred_date DATE NOT NULL,

    booking_type_id TINYINT NOT NULL,

    appointment_patient_id BIGINT NULL,

    reason_for_visit TEXT NOT NULL,

    appointment_status_id TINYINT NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointments_person
        FOREIGN KEY (person_id)
        REFERENCES persons(person_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_appointments_staff
        FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id),

    CONSTRAINT fk_appointments_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id),

    CONSTRAINT fk_appointments_specialization
        FOREIGN KEY (specialization_id)
        REFERENCES specializations(specialization_id),

    CONSTRAINT fk_appointments_schedule
        FOREIGN KEY (schedule_id)
        REFERENCES doctor_schedules(schedule_id),

    CONSTRAINT fk_appointments_booking_type
        FOREIGN KEY (booking_type_id)
        REFERENCES booking_types(booking_type_id),

    CONSTRAINT fk_appointments_patient
        FOREIGN KEY (appointment_patient_id)
        REFERENCES appointment_patients(appointment_patient_id),

    CONSTRAINT fk_appointments_status
        FOREIGN KEY (appointment_status_id)
        REFERENCES appointment_status(appointment_status_id),

    CONSTRAINT chk_booking_type
    CHECK (
        (booking_type_id = 1 AND appointment_patient_id IS NULL) OR
        (booking_type_id = 2 AND appointment_patient_id IS NOT NULL)
    )
);

