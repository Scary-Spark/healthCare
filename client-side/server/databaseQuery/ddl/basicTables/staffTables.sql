CREATE TABLE staff (
    staff_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    role_id TINYINT NOT NULL,
    specialization_id INT NULL,
    license_number VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_pic_path VARCHAR(255) null DEFAULT "/uploads/profilePictures/doctorDefaultPic.jpg",

    FOREIGN KEY (role_id) REFERENCES staff_roles(role_id),
    FOREIGN KEY (specialization_id)
        REFERENCES specializations(specialization_id)
        ON DELETE SET NULL
);
