CREATE TABLE test_report_results (
    test_result_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    test_report_id BIGINT NOT NULL,

    parameter_name VARCHAR(100) NOT NULL,
    result_value VARCHAR(50) NOT NULL,
    unit VARCHAR(20),
    reference_range VARCHAR(50),
    remarks VARCHAR(255),

    FOREIGN KEY (test_report_id)
        REFERENCES test_reports(test_report_id)
        ON DELETE CASCADE
);