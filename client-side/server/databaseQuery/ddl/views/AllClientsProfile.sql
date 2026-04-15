CREATE OR REPLACE VIEW vw_client_full_profile AS
SELECT 
    c.client_id,
    c.person_id,
    c.email,
    c.phone_number,
    c.status_id,
    s.status_name,
    c.last_login_at,
    c.last_login_ip,
    c.deleted_at,

    p.first_name,
    p.last_name,
    p.date_of_birth,
    p.created_at AS person_created_at,

    g.gender_id,
    g.gender_name,

    b.blood_group_id,
    b.blood_group_name,

    a.upazila_id,
    u.upazila_name,
    d.district_id,
    d.district_name,
    v.division_id,
    v.division_name,

    a.postal_code,
    a.street_address

FROM clients c

JOIN persons p 
    ON c.person_id = p.person_id
JOIN account_status s 
    ON c.status_id = s.status_id
LEFT JOIN genders g 
    ON p.gender_id = g.gender_id
LEFT JOIN blood_groups b 
    ON p.blood_group_id = b.blood_group_id
LEFT JOIN person_address a 
    ON p.person_id = a.person_id
LEFT JOIN upazilas u 
    ON a.upazila_id = u.upazila_id
LEFT JOIN districts d 
    ON u.district_id = d.district_id
LEFT JOIN divisions v 
    ON d.division_id = v.division_id;