CREATE TABLE blood_groups (
    blood_group_id TINYINT AUTO_INCREMENT PRIMARY KEY,
    blood_group_name VARCHAR(20) NOT NULL UNIQUE
);

ALTER Table blood_groups
MODIFY COLUMN blood_group_name varchar(20) NOT NULL UNIQUE;