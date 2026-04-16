CREATE TABLE persons (
    person_id BIGINT PRIMARY KEY, -- will implement own id logic

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,

    date_of_birth DATE NOT NULL,
    gender_id TINYINT,

    blood_group_id TINYINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (gender_id) REFERENCES genders(gender_id),
    FOREIGN KEY (blood_group_id) REFERENCES blood_groups(blood_group_id)
);

alter table persons
MODIFY gender_id TINYINT NOT NULL;

ALTER TABLE `persons`
ADD COLUMN `profile_pic_path` VARCHAR(255)
NULL DEFAULT '/uploads/profilePictures/defaultProfilePic.jpg'
AFTER `blood_group_id`;

