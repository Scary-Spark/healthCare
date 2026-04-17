CREATE TABLE time_slots (
    slot_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE (start_time, end_time)
);

select * from time_slots;