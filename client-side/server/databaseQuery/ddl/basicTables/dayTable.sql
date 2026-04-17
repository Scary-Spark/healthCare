CREATE TABLE available_days (
    day_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    day_name VARCHAR(10) NOT NULL UNIQUE
);

INSERT INTO available_days (day_name) VALUES
('Sunday'),
('Monday'),
('Tuesday'),
('Wednesday'),
('Thursday'),
('Friday'),
('Saturday');