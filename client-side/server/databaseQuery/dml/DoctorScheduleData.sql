-- ==========================================
-- CONSULTANTS & PRIMARY CARE (Full Morning Blocks)
-- ==========================================

-- Dr. Staff ID 1 (Consultant - Sun, Mon, Tue Morning)
CALL CreateDoctorSchedule(1, 1, 1); CALL CreateDoctorSchedule(1, 2, 1); CALL CreateDoctorSchedule(1, 3, 1);
CALL CreateDoctorSchedule(1, 1, 2); CALL CreateDoctorSchedule(1, 2, 2); CALL CreateDoctorSchedule(1, 3, 2);
CALL CreateDoctorSchedule(1, 1, 3); CALL CreateDoctorSchedule(1, 2, 3); CALL CreateDoctorSchedule(1, 3, 3);

-- Dr. Staff ID 91 (Consultant - Wed, Thu, Fri Afternoon)
CALL CreateDoctorSchedule(91, 7, 4); CALL CreateDoctorSchedule(91, 8, 4); CALL CreateDoctorSchedule(91, 9, 4);
CALL CreateDoctorSchedule(91, 7, 5); CALL CreateDoctorSchedule(91, 8, 5); CALL CreateDoctorSchedule(91, 9, 5);
CALL CreateDoctorSchedule(91, 7, 6); CALL CreateDoctorSchedule(91, 8, 6); CALL CreateDoctorSchedule(91, 9, 6);

-- ==========================================
-- SURGICAL SPECIALISTS (Specific Days for OPD)
-- ==========================================

-- Dr. Staff ID 3 (Laparoscopic Surgery - Mon/Wed Morning)
CALL CreateDoctorSchedule(3, 1, 2); CALL CreateDoctorSchedule(3, 2, 2); CALL CreateDoctorSchedule(3, 3, 2);
CALL CreateDoctorSchedule(3, 1, 4); CALL CreateDoctorSchedule(3, 2, 4); CALL CreateDoctorSchedule(3, 3, 4);

-- Dr. Staff ID 4 (Colorectal Surgery - Tue/Thu Evening)
CALL CreateDoctorSchedule(4, 10, 3); CALL CreateDoctorSchedule(4, 11, 3); CALL CreateDoctorSchedule(4, 12, 3);
CALL CreateDoctorSchedule(4, 10, 5); CALL CreateDoctorSchedule(4, 11, 5); CALL CreateDoctorSchedule(4, 12, 5);

-- Dr. Staff ID 11 (Joint Replacement - Sat/Sun Full Day)
CALL CreateDoctorSchedule(11, 2, 7); CALL CreateDoctorSchedule(11, 3, 7); CALL CreateDoctorSchedule(11, 8, 7);
CALL CreateDoctorSchedule(11, 2, 1); CALL CreateDoctorSchedule(11, 3, 1); CALL CreateDoctorSchedule(11, 8, 1);

-- ==========================================
-- CARDIOLOGY & CRITICAL CARE (Shift Rotation)
-- ==========================================

-- Dr. Staff ID 14 (Interventional Cardiology - Mon, Wed, Fri)
CALL CreateDoctorSchedule(14, 4, 2); CALL CreateDoctorSchedule(14, 5, 2);
CALL CreateDoctorSchedule(14, 4, 4); CALL CreateDoctorSchedule(14, 5, 4);
CALL CreateDoctorSchedule(14, 4, 6); CALL CreateDoctorSchedule(14, 5, 6);

-- Dr. Staff ID 38 (Adult Intensive Care - Daily Morning Rounds)
CALL CreateDoctorSchedule(38, 1, 1); CALL CreateDoctorSchedule(38, 1, 2); CALL CreateDoctorSchedule(38, 1, 3);
CALL CreateDoctorSchedule(38, 1, 4); CALL CreateDoctorSchedule(38, 1, 5); CALL CreateDoctorSchedule(38, 1, 6);
CALL CreateDoctorSchedule(38, 1, 7);

-- ==========================================
-- PEDIATRICS & OTHER SPECIALISTS
-- ==========================================

-- Dr. Staff ID 6 (Pediatric Cardiology - Tue, Thu, Sat)
CALL CreateDoctorSchedule(6, 3, 3); CALL CreateDoctorSchedule(6, 4, 3);
CALL CreateDoctorSchedule(6, 3, 5); CALL CreateDoctorSchedule(6, 4, 5);
CALL CreateDoctorSchedule(6, 3, 7); CALL CreateDoctorSchedule(6, 4, 7);

-- Dr. Staff ID 27 (Child Psychiatry - Mon, Wed Afternoon)
CALL CreateDoctorSchedule(27, 7, 2); CALL CreateDoctorSchedule(27, 8, 2);
CALL CreateDoctorSchedule(27, 7, 4); CALL CreateDoctorSchedule(27, 8, 4);

-- Dr. Staff ID 56 (Diabetology - Morning Routine)
CALL CreateDoctorSchedule(56, 2, 2); CALL CreateDoctorSchedule(56, 3, 2);
CALL CreateDoctorSchedule(56, 2, 3); CALL CreateDoctorSchedule(56, 3, 3);
CALL CreateDoctorSchedule(56, 2, 4); CALL CreateDoctorSchedule(56, 3, 4);

-- Dr. Staff ID 75 (Chronic Pain Therapy - Fri Evening)
CALL CreateDoctorSchedule(75, 9, 6); CALL CreateDoctorSchedule(75, 10, 6); CALL CreateDoctorSchedule(75, 11, 6);

-- Dr. Staff ID 130 (Consultant Addiction Psych - Weekends Night)
CALL CreateDoctorSchedule(130, 11, 7); CALL CreateDoctorSchedule(130, 12, 7);
CALL CreateDoctorSchedule(130, 11, 1); CALL CreateDoctorSchedule(130, 12, 1);

-- ==========================================
-- ADDITIONAL DIVERSE ENTRIES
-- ==========================================

-- Dr. Staff ID 22 (Retina Specialist)
CALL CreateDoctorSchedule(22, 5, 2); CALL CreateDoctorSchedule(22, 6, 2);

-- Dr. Staff ID 33 (Surgical Oncology)
CALL CreateDoctorSchedule(33, 4, 3); CALL CreateDoctorSchedule(33, 5, 3);

-- Dr. Staff ID 66 (Interventional Radiology)
CALL CreateDoctorSchedule(66, 8, 5); CALL CreateDoctorSchedule(66, 9, 5);

-- Dr. Staff ID 97 (Primary Care Doctor)
CALL CreateDoctorSchedule(97, 10, 2); CALL CreateDoctorSchedule(97, 11, 2);