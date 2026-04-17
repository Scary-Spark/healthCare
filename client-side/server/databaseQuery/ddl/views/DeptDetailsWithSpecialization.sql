CREATE OR REPLACE VIEW vw_department_specializations AS
SELECT
    d.department_id,
    d.department_name,
    d.description,

    sp.specialization_id,
    sp.specialization_name

FROM departments d
LEFT JOIN specializations sp
    ON d.department_id = sp.department_id;