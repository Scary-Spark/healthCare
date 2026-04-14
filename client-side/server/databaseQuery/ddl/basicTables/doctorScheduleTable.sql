CREATE TABLE doctor_schedules (
    schedule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    available_day ENUM(
        'Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ) NOT NULL,
    slot_id TINYINT NOT NULL,

    UNIQUE (staff_id, available_day, slot_id),

    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (slot_id) REFERENCES time_slots(slot_id)
);