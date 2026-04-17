CREATE OR REPLACE VIEW vw_doctor_full_schedule AS
SELECT
    d.department_id,
    d.department_name,
    d.description AS department_description,

    s.specialization_id,
    s.specialization_name,

    st.staff_id,
    CONCAT(st.first_name, ' ', st.last_name) AS staff_name,
    st.profile_pic_path,

    ts.slot_id,
    ts.start_time,
    ts.end_time,

    ad.day_id,
    ad.day_name

FROM doctor_schedules ds

INNER JOIN staff st
    ON ds.staff_id = st.staff_id

LEFT JOIN specializations s
    ON st.specialization_id = s.specialization_id

LEFT JOIN departments d
    ON s.department_id = d.department_id

INNER JOIN time_slots ts
    ON ds.slot_id = ts.slot_id

INNER JOIN available_days ad
    ON ds.available_day = ad.day_id

WHERE st.role_id IN (1, 2, 4);