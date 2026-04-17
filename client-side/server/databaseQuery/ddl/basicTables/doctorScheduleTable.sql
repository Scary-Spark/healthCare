CREATE TABLE doctor_schedules (
    schedule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    slot_id TINYINT NOT NULL,
    available_day TINYINT NOT NULL,

    UNIQUE (staff_id, available_day, slot_id),

    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id),
    FOREIGN key (available_day) REFERENCES available_days(day_id)
);
