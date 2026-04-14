CREATE TABLE client_activity_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,

    action VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

drop table client_activity_log;