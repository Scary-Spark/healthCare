INSERT INTO invoice_status (status_name, description) VALUES
('PENDING', 'Invoice generated but not yet paid'),
('PAID', 'Invoice fully settled'),
('PARTIALLY_PAID', 'Invoice partially paid'),
('OVERDUE', 'Payment is overdue'),
('CANCELLED', 'Invoice cancelled');