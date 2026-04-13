1. blood_groups
2. genders
3. account_status
4. booking_types
5. appointment_status
6. departments
7. time_slots
8. staff_roles
9. divisions
10. districts → divisions
11. upazilas → districts

12. persons → (genders, blood_groups)

13. clients → (persons, account_status)
14. client_activity_log → clients

15. specializations → departments
16. staff → (persons, staff_roles, specializations)

17. doctor_schedules → (staff, time_slots)

18. appointment_patients

19. appointments →
   (clients, staff, departments,
    specializations, schedules,
    booking_types, appointment_status,
    appointment_patients, visit_id)

20. visit_status_id → status_name, description
21. visit_id → (appointment_id, check_in_time, check_out_time, visit_status_id, created_at)