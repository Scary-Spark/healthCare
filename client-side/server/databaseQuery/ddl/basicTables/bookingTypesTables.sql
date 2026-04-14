CREATE TABLE booking_types (
    booking_type_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    booking_type_name VARCHAR(20) NOT NULL UNIQUE
);