blood_groups (blood_group_id PK, blood_group_name)
genders (gender_id PK, gender_name)
account_status (status_id PK, status_name)
booking_types (booking_type_id PK, booking_type_name)
appointment_status (appointment_status_id PK, status_name, description)
departments (department_id PK, department_name, description)
time_slots (slot_id PK, start_time, end_time)
staff_roles (role_id PK, role_name, description)

divisions (division_id PK, division_name)
districts (district_id PK, district_name, division_id FK → divisions)
upazilas (upazila_id PK, upazila_name, district_id FK → districts)

person_address (person_id FK → persons, upazila_id FK → upazilas)

persons ( person_id PK, first_name, last_name, date_of_birth, gender_id FK → genders, blood_group_id FK → blood_groups, created_at )

clients ( client_id PK, email, phone_number, password_hash, status_id FK → account_status, last_login_at, last_login_ip, deleted_at )

client_activity_log ( log_id PK, client_id FK → clients, action, ip_address, created_at )

specializations ( specialization_id PK, specialization_name, department_id FK → departments, UNIQUE (specialization_name, department_id) )

staff ( staff_id PK, person_id FK → persons (UNIQUE), role_id FK → staff_roles, specialization_id FK → specializations (NULL allowed), license_number, is_active, created_at )

doctor_schedules ( schedule_id PK, staff_id FK → staff, available_day, slot_id FK → time_slots, UNIQUE (staff_id, available_day, slot_id) )

appointment_patients ( appointment_patient_id PK, first_name, last_name, contact_number, email, address )

visit_status ( visit_status_id PK, status_name, description )

visits ( visit_id PK, appointment_id FK → appointments (UNIQUE), check_in_time, check_out_time, visit_status_id FK → visit_status, created_at )

appointments ( appointment_id PK, UNIQUE (visit_id), client_id FK → clients, staff_id FK → staff, department_id FK → departments, specialization_id FK → specializations, schedule_id FK → doctor_schedules, preferred_date, booking_type_id FK → booking_types, appointment_patient_id FK → appointment_patients NULL, reason_for_visit, appointment_status_id FK → appointment_status, created_at, CHECK (SELF vs OTHER logic) )