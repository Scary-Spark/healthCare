-- =========================================================================
-- DOCTORS & SPECIALISTS (Covering Spec IDs 1-40: The Primary Specialties)
-- =========================================================================
CALL CreateStaff('Alice', 'Smith', '555-1001', 'alice.s@hospital.com', 4, 1, 'LIC-20001', TRUE); -- Primary Care
CALL CreateStaff('Bob', 'Johnson', '555-1002', 'bob.j@hospital.com', 3, 2, 'LIC-20002', TRUE);  -- Laparoscopic Surgery
CALL CreateStaff('Charlie', 'Williams', NULL, 'charlie.w@hospital.com', 2, 3, 'LIC-20003', TRUE); -- Neonatology
CALL CreateStaff('Diana', 'Brown', '555-1004', 'diana.b@hospital.com', 2, 4, 'LIC-20004', TRUE); -- Maternal-Fetal
CALL CreateStaff('Edward', 'Jones', '555-1005', 'edward.j@hospital.com', 3, 5, 'LIC-20005', TRUE); -- Joint Replacement
CALL CreateStaff('Fiona', 'Garcia', '555-1006', 'fiona.g@hospital.com', 2, 6, 'LIC-20006', TRUE); -- Interventional Cardiology
CALL CreateStaff('George', 'Miller', '555-1007', 'george.m@hospital.com', 2, 7, 'LIC-20007', TRUE); -- Epilepsy
CALL CreateStaff('Hannah', 'Davis', NULL, 'hannah.d@hospital.com', 2, 8, 'LIC-20008', TRUE); -- Cosmetic Dermatology
CALL CreateStaff('Ian', 'Rodriguez', '555-1009', 'ian.r@hospital.com', 3, 9, 'LIC-20009', TRUE); -- Retina Specialist
CALL CreateStaff('Julia', 'Martinez', '555-1010', 'julia.m@hospital.com', 2, 10, 'LIC-20010', TRUE); -- Otology
CALL CreateStaff('Kevin', 'Hernandez', '555-1011', 'kevin.h@hospital.com', 2, 11, 'LIC-20011', TRUE); -- Child Psychiatry
CALL CreateStaff('Laura', 'Lopez', '555-1012', 'laura.l@hospital.com', 2, 12, 'LIC-20012', TRUE); -- Andrology
CALL CreateStaff('Mark', 'Gonzalez', '555-1013', 'mark.g@hospital.com', 2, 13, 'LIC-20013', TRUE); -- Medical Oncology
CALL CreateStaff('Nora', 'Wilson', '555-1014', 'nora.w@hospital.com', 1, 14, 'LIC-20014', TRUE); -- Critical Care Anes
CALL CreateStaff('Oscar', 'Anderson', '555-1015', 'oscar.a@hospital.com', 1, 15, 'LIC-20015', TRUE); -- Trauma Care
CALL CreateStaff('Paula', 'Thomas', '555-1016', 'paula.t@hospital.com', 7, 16, 'REG-30016', TRUE); -- Adult ICU
CALL CreateStaff('Quentin', 'Taylor', '555-1017', 'quentin.t@hospital.com', 3, 17, 'LIC-20017', TRUE); -- Skull Base Surgery
CALL CreateStaff('Rose', 'Moore', '555-1018', 'rose.m@hospital.com', 3, 18, 'LIC-20018', TRUE); -- Congenital Heart Surg
CALL CreateStaff('Steve', 'Jackson', '555-1019', 'steve.j@hospital.com', 3, 19, 'LIC-20019', TRUE); -- Endovascular Surg
CALL CreateStaff('Tina', 'Martin', '555-1020', 'tina.m@hospital.com', 3, 20, 'LIC-20020', TRUE); -- Burn Surgery
CALL CreateStaff('Uma', 'Lee', '555-1021', 'uma.l@hospital.com', 3, 21, 'LIC-20021', TRUE); -- Neonatal Surgery
CALL CreateStaff('Victor', 'Perez', '555-1022', 'victor.p@hospital.com', 2, 22, 'LIC-20022', TRUE); -- Dialysis Medicine
CALL CreateStaff('Wendy', 'Thompson', '555-1023', 'wendy.t@hospital.com', 2, 23, 'LIC-20023', TRUE); -- Hepatology
CALL CreateStaff('Xavier', 'White', '555-1024', 'xavier.w@hospital.com', 2, 24, 'LIC-20024', TRUE); -- Sleep Medicine
CALL CreateStaff('Yara', 'Harris', '555-1025', 'yara.h@hospital.com', 2, 25, 'LIC-20025', TRUE); -- Diabetology
CALL CreateStaff('Zack', 'Sanchez', '555-1026', 'zack.s@hospital.com', 2, 26, 'LIC-20026', TRUE); -- Bone Marrow Trans
CALL CreateStaff('Arthur', 'Clark', '555-1027', 'arthur.c@hospital.com', 2, 27, 'LIC-20027', TRUE); -- Autoimmune Dis
CALL CreateStaff('Beatrice', 'Ramirez', '555-1028', 'beatrice.r@hospital.com', 2, 28, 'LIC-20028', TRUE); -- Epidemiology
CALL CreateStaff('Connor', 'Lewis', '555-1029', 'connor.l@hospital.com', 2, 29, 'LIC-20029', TRUE); -- Neuro-rehab
CALL CreateStaff('Daisy', 'Robinson', '555-1030', 'daisy.r@hospital.com', 11, 30, 'RAD-40030', TRUE); -- Interventional Rad
CALL CreateStaff('Elliot', 'Walker', '555-1031', 'elliot.w@hospital.com', 13, 31, 'PTH-40031', TRUE); -- Cytopathology
CALL CreateStaff('Faith', 'Young', '555-1032', 'faith.y@hospital.com', 10, 32, 'LAB-40032', TRUE); -- PET/CT Imaging
CALL CreateStaff('Grant', 'Allen', '555-1033', 'grant.a@hospital.com', 2, 33, 'LIC-20033', TRUE); -- Memory Clinic
CALL CreateStaff('Hope', 'King', '555-1034', 'hope.k@hospital.com', 2, 34, 'LIC-20034', TRUE); -- Chronic Pain
CALL CreateStaff('Isaac', 'Wright', '555-1035', 'isaac.w@hospital.com', 2, 35, 'LIC-20035', TRUE); -- Hospice Care
CALL CreateStaff('Jane', 'Scott', '555-1036', 'jane.s@hospital.com', 2, 36, 'LIC-20036', TRUE); -- Clinical Genomics
CALL CreateStaff('Kurt', 'Nguyen', '555-1037', 'kurt.n@hospital.com', 2, 37, 'LIC-20037', TRUE); -- Athletic Rehab
CALL CreateStaff('Lily', 'Hill', '555-1038', 'lily.h@hospital.com', 1, 38, 'LIC-20038', TRUE); -- Workplace Safety
CALL CreateStaff('Max', 'Adams', '555-1039', 'max.a@hospital.com', 12, 39, 'PHM-40039', TRUE); -- Weight Mgmt
CALL CreateStaff('Nina', 'Baker', '555-1040', 'nina.b@hospital.com', 3, 40, 'LIC-20040', TRUE); -- Orthodontics

-- =========================================================================
-- DOCTORS & SPECIALISTS (Covering Spec IDs 41-80: The Niche Specialties)
-- =========================================================================
CALL CreateStaff('Owen', 'Nelson', '555-2041', 'owen.n@hospital.com', 2, 41, 'LIC-20041', TRUE);
CALL CreateStaff('Piper', 'Carter', '555-2042', 'piper.c@hospital.com', 2, 42, 'LIC-20042', TRUE);
CALL CreateStaff('Quinn', 'Mitchell', '555-2043', 'quinn.m@hospital.com', 3, 43, 'LIC-20043', TRUE);
CALL CreateStaff('Riley', 'Perez', '555-2044', 'riley.p@hospital.com', 3, 44, 'LIC-20044', TRUE);
CALL CreateStaff('Seth', 'Roberts', '555-2045', 'seth.r@hospital.com', 3, 45, 'LIC-20045', TRUE);
CALL CreateStaff('Tess', 'Turner', '555-2046', 'tess.t@hospital.com', 2, 46, 'LIC-20046', TRUE);
CALL CreateStaff('Uri', 'Phillips', '555-2047', 'uri.p@hospital.com', 2, 47, 'LIC-20047', TRUE);
CALL CreateStaff('Vera', 'Campbell', '555-2048', 'vera.c@hospital.com', 3, 48, 'LIC-20048', TRUE);
CALL CreateStaff('Will', 'Parker', '555-2049', 'will.p@hospital.com', 2, 49, 'LIC-20049', TRUE);
CALL CreateStaff('Xena', 'Evans', '555-2050', 'xena.e@hospital.com', 2, 50, 'LIC-20050', TRUE);
CALL CreateStaff('Yusef', 'Edwards', '555-2051', 'yusef.e@hospital.com', 3, 51, 'LIC-20051', TRUE);
CALL CreateStaff('Zoe', 'Collins', '555-2052', 'zoe.c@hospital.com', 3, 52, 'LIC-20052', TRUE);
CALL CreateStaff('Aidan', 'Stewart', '555-2053', 'aidan.s@hospital.com', 3, 53, 'LIC-20053', TRUE);
CALL CreateStaff('Bella', 'Morris', '555-2054', 'bella.m@hospital.com', 2, 54, 'LIC-20054', TRUE);
CALL CreateStaff('Caleb', 'Rogers', '555-2055', 'caleb.r@hospital.com', 2, 55, 'LIC-20055', TRUE);
CALL CreateStaff('Della', 'Reed', '555-2056', 'della.r@hospital.com', 2, 56, 'LIC-20056', TRUE);
CALL CreateStaff('Ezra', 'Cook', '555-2057', 'ezra.c@hospital.com', 2, 57, 'LIC-20057', TRUE);
CALL CreateStaff('Faye', 'Morgan', '555-2058', 'faye.m@hospital.com', 2, 58, 'LIC-20058', TRUE);
CALL CreateStaff('Gabe', 'Bell', '555-2059', 'gabe.b@hospital.com', 2, 59, 'LIC-20059', TRUE);
CALL CreateStaff('Hope', 'Murphy', '555-2060', 'hope.m@hospital.com', 2, 60, 'LIC-20060', TRUE);
CALL CreateStaff('Ivan', 'Bailey', '555-2061', 'ivan.b@hospital.com', 2, 61, 'LIC-20061', TRUE);
CALL CreateStaff('Jade', 'Rivera', '555-2062', 'jade.r@hospital.com', 2, 62, 'LIC-20062', TRUE);
CALL CreateStaff('Kane', 'Cooper', '555-2063', 'kane.c@hospital.com', 2, 63, 'LIC-20063', TRUE);
CALL CreateStaff('Lulu', 'Richardson', '555-2064', 'lulu.r@hospital.com', 2, 64, 'LIC-20064', TRUE);
CALL CreateStaff('Milo', 'Cox', '555-2065', 'milo.c@hospital.com', 2, 65, 'LIC-20065', TRUE);
CALL CreateStaff('Nora', 'Howard', '555-2066', 'nora.h@hospital.com', 2, 66, 'LIC-20066', TRUE);
CALL CreateStaff('Otis', 'Ward', '555-2067', 'otis.w@hospital.com', 2, 67, 'LIC-20067', TRUE);
CALL CreateStaff('Pia', 'Torres', '555-2068', 'pia.t@hospital.com', 2, 68, 'LIC-20068', TRUE);
CALL CreateStaff('Rex', 'Peterson', '555-2069', 'rex.p@hospital.com', 2, 69, 'LIC-20069', TRUE);
CALL CreateStaff('Sia', 'Gray', '555-2070', 'sia.g@hospital.com', 11, 70, 'RAD-40070', TRUE);
CALL CreateStaff('Toby', 'Ramirez', '555-2071', 'toby.r@hospital.com', 13, 71, 'PTH-40071', TRUE);
CALL CreateStaff('Ula', 'James', '555-2072', 'ula.j@hospital.com', 10, 72, 'LAB-40072', TRUE);
CALL CreateStaff('Van', 'Watson', '555-2073', 'van.w@hospital.com', 2, 73, 'LIC-20073', TRUE);
CALL CreateStaff('Wren', 'Brooks', '555-2074', 'wren.b@hospital.com', 2, 74, 'LIC-20074', TRUE);
CALL CreateStaff('Xen', 'Kelly', '555-2075', 'xen.k@hospital.com', 2, 75, 'LIC-20075', TRUE);
CALL CreateStaff('Yara', 'Sanders', '555-2076', 'yara.s@hospital.com', 2, 76, 'LIC-20076', TRUE);
CALL CreateStaff('Zane', 'Price', '555-2077', 'zane.p@hospital.com', 2, 77, 'LIC-20077', TRUE);
CALL CreateStaff('Alma', 'Bennett', '555-2078', 'alma.b@hospital.com', 1, 78, 'LIC-20078', TRUE);
CALL CreateStaff('Beau', 'Wood', '555-2079', 'beau.w@hospital.com', 12, 79, 'PHM-40079', TRUE);
CALL CreateStaff('Cara', 'Barnes', '555-2080', 'cara.b@hospital.com', 3, 80, 'LIC-20080', TRUE);

-- =========================================================================
-- ADMINISTRATIVE & NON-MEDICAL STAFF (Testing NULL Specialized IDs)
-- =========================================================================
CALL CreateStaff('Pam', 'Reception', '555-9001', 'pam.recep@hospital.com', 17, NULL, NULL, TRUE);
CALL CreateStaff('Michael', 'Manager', '555-9002', 'm.scott@hospital.com', 18, NULL, NULL, TRUE);
CALL CreateStaff('Oscar', 'Billing', NULL, 'oscar.b@hospital.com', 19, NULL, NULL, TRUE);
CALL CreateStaff('Dwight', 'Security', '555-9004', 'dwight.s@hospital.com', 20, NULL, 'SEC-999', TRUE);
CALL CreateStaff('Creed', 'Cleaner', NULL, 'creed.c@hospital.com', 21, NULL, NULL, TRUE);
CALL CreateStaff('Jim', 'Admin', '555-9006', 'jim.a@hospital.com', 17, NULL, NULL, TRUE);
CALL CreateStaff('Angela', 'Finance', '555-9007', 'angela.f@hospital.com', 19, NULL, NULL, TRUE);
CALL CreateStaff('Stanley', 'Watchman', '555-9008', 'stan.w@hospital.com', 20, NULL, NULL, TRUE);
CALL CreateStaff('Kelly', 'FrontDesk', '555-9009', 'kelly.fd@hospital.com', 17, NULL, NULL, TRUE);
CALL CreateStaff('Meredith', 'PharmacySupp', '555-9010', 'meredith.p@hospital.com', 12, NULL, 'PHM-001', TRUE);

-- ==========================================
-- DOCTORS, SPECIALISTS & SURGEONS (Roles 1-4)
-- ==========================================
-- Specialists & Consultants
CALL CreateStaff('John', 'Doe', '555-0101', 'j.doe@hospital.com', 4, 1, 'LIC-99001', TRUE); -- Consultant, Primary Care
CALL CreateStaff('Sarah', 'Vance', '555-0102', 's.vance@hospital.com', 2, 14, 'LIC-99002', TRUE); -- Specialist, Interventional Cardiology
CALL CreateStaff('Michael', 'Chen', '555-0103', 'm.chen@hospital.com', 3, 17, 'LIC-99003', TRUE); -- Surgeon, Neurosurgery
CALL CreateStaff('Elena', 'Rodriguez', '555-0104', 'e.rod@hospital.com', 2, 25, 'LIC-99004', TRUE); -- Specialist, Endocrinology
CALL CreateStaff('David', 'Kim', '555-0105', 'd.kim@hospital.com', 3, 11, 'LIC-99005', TRUE); -- Surgeon, Orthopedics
CALL CreateStaff('Amina', 'Sato', '555-0106', 'a.sato@hospital.com', 2, 8, 'LIC-99006', TRUE); -- Specialist, Dermatology
CALL CreateStaff('Robert', 'Wilson', '555-0107', 'r.wilson@hospital.com', 1, 1, 'LIC-99007', TRUE); -- General Physician
CALL CreateStaff('Linda', 'Gomez', '555-0108', 'l.gomez@hospital.com', 4, 31, 'LIC-99008', TRUE); -- Consultant, Oncology
CALL CreateStaff('James', 'OConnor', '555-0109', 'j.ocon@hospital.com', 3, 18, 'LIC-99009', TRUE); -- Surgeon, Cardiothoracic
CALL CreateStaff('Priya', 'Sharma', '555-0110', 'p.sharma@hospital.com', 2, 3, 'LIC-99010', TRUE); -- Specialist, Pediatrics

-- ==========================================
-- NURSING STAFF (Roles 5-7)
-- ==========================================
-- Head Nurses
CALL CreateStaff('Margaret', 'Houlihan', '555-0201', 'm.houlihan@hospital.com', 6, NULL, 'REG-88001', TRUE);
CALL CreateStaff('Thomas', 'Brown', '555-0202', 't.brown@hospital.com', 6, NULL, 'REG-88002', TRUE);

-- ICU Nurses
CALL CreateStaff('Clarice', 'Starling', '555-0203', 'c.starling@hospital.com', 7, 16, 'REG-88003', TRUE);
CALL CreateStaff('Samuel', 'Beckett', '555-0204', 's.beckett@hospital.com', 7, 16, 'REG-88004', TRUE);
CALL CreateStaff('Nora', 'Allen', '555-0205', 'n.allen@hospital.com', 7, 16, 'REG-88005', TRUE);

-- Ward Nurses
CALL CreateStaff('Jackie', 'Peyton', '555-0206', 'j.peyton@hospital.com', 5, NULL, 'REG-88006', TRUE);
CALL CreateStaff('Abby', 'Lockhart', '555-0207', 'a.lockhart@hospital.com', 5, NULL, 'REG-88007', TRUE);
CALL CreateStaff('Carla', 'Espinosa', '555-0208', 'c.espinosa@hospital.com', 5, NULL, 'REG-88008', TRUE);
CALL CreateStaff('Peter', 'Petrelli', '555-0209', 'p.petrelli@hospital.com', 5, NULL, 'REG-88009', TRUE);
CALL CreateStaff('Sun', 'Kwon', '555-0210', 's.kwon@hospital.com', 5, NULL, 'REG-88010', TRUE);

-- ==========================================
-- LAB, RADIOLOGY & PHARMACY (Roles 10-14)
-- ==========================================
CALL CreateStaff('Walter', 'White', '555-0301', 'w.white@hospital.com', 12, NULL, 'PHM-77001', TRUE); -- Pharmacist
CALL CreateStaff('Barry', 'Allen', '555-0302', 'b.allen@hospital.com', 10, 31, 'LAB-77002', TRUE); -- Lab Technician
CALL CreateStaff('Iris', 'West', '555-0303', 'i.west@hospital.com', 11, 30, 'RAD-77003', TRUE); -- Radiology Tech
CALL CreateStaff('Victor', 'Fries', '555-0304', 'v.fries@hospital.com', 14, 31, 'SCI-77004', TRUE); -- Lab Scientist
CALL CreateStaff('Dana', 'Scully', '555-0305', 'd.scully@hospital.com', 13, 31, 'PTH-77005', TRUE); -- Pathologist
CALL CreateStaff('Jesse', 'Pinkman', '555-0306', 'j.pinkman@hospital.com', 10, NULL, 'LAB-77006', TRUE); -- Lab Technician

-- ==========================================
-- EMERGENCY & ASSISTANTS (Roles 8, 9, 15, 16)
-- ==========================================
-- EMT & Ambulance
CALL CreateStaff('Frank', 'Castle', '555-0401', 'f.castle@hospital.com', 15, NULL, 'EMT-66001', TRUE);
CALL CreateStaff('Matt', 'Murdock', '555-0402', 'm.murdock@hospital.com', 16, NULL, 'DRV-66002', TRUE);

-- Medical Assistants & Ward Boys
CALL CreateStaff('John', 'Watson', '555-0403', 'j.watson@hospital.com', 9, NULL, 'MA-66003', TRUE);
CALL CreateStaff('Samwise', 'Gamgee', '555-0404', 's.gamgee@hospital.com', 8, NULL, 'WB-66004', TRUE);
CALL CreateStaff('Steve', 'Rogers', '555-0405', 's.rogers@hospital.com', 8, NULL, 'WB-66005', TRUE);

-- ==========================================
-- ADMINISTRATION & SUPPORT (Roles 17-21)
-- ==========================================
-- Management & Reception
CALL CreateStaff('Jan', 'Levinson', '555-0501', 'j.levinson@hospital.com', 18, NULL, 'ADM-55001', TRUE); -- Manager
CALL CreateStaff('Pam', 'Beesly', '555-0502', 'p.beesly@hospital.com', 17, NULL, NULL, TRUE); -- Receptionist
CALL CreateStaff('Jim', 'Halpert', '555-0503', 'j.halpert@hospital.com', 17, NULL, NULL, TRUE); -- Receptionist
CALL CreateStaff('Oscar', 'Martinez', '555-0504', 'o.martinez@hospital.com', 19, NULL, NULL, TRUE); -- Billing

-- Security & Cleaning
CALL CreateStaff('Mike', 'Ehrmantraut', '555-0505', 'm.ehrmantraut@hospital.com', 20, NULL, 'SEC-55005', TRUE);
CALL CreateStaff('Burt', 'Macklin', '555-0506', 'b.macklin@hospital.com', 20, NULL, 'SEC-55006', TRUE);
CALL CreateStaff('Scruffy', 'Scruffington', '555-0507', 's.scruff@hospital.com', 21, NULL, NULL, TRUE);
CALL CreateStaff('Charlie', 'Kelly', '555-0508', 'c.kelly@hospital.com', 21, NULL, NULL, TRUE);

-- ==========================================
-- MIXED DATA (Varied Status/Additional Specialists)
-- ==========================================
CALL CreateStaff('Gregory', 'House', '555-0601', 'g.house@hospital.com', 4, 28, 'LIC-99601', TRUE); -- Consultant, Infectious Disease
CALL CreateStaff('Lisa', 'Cuddy', '555-0602', 'l.cuddy@hospital.com', 18, NULL, 'ADM-55602', TRUE); -- Manager
CALL CreateStaff('Allison', 'Cameron', '555-0603', 'a.cameron@hospital.com', 2, 28, 'LIC-99603', TRUE); -- Specialist, Immunology
CALL CreateStaff('Eric', 'Foreman', '555-0604', 'e.foreman@hospital.com', 2, 7, 'LIC-99604', TRUE); -- Specialist, Neurology
CALL CreateStaff('Remy', 'Hadley', '555-0605', 'r.hadley@hospital.com', 1, 1, 'LIC-99605', FALSE); -- Inactive Staff
CALL CreateStaff('Lawrence', 'Kutner', '555-0606', 'l.kutner@hospital.com', 2, 37, 'LIC-99606', TRUE); -- Specialist, Sports Med
CALL CreateStaff('Chris', 'Taub', '555-0607', 'c.taub@hospital.com', 3, 20, 'LIC-99607', TRUE); -- Plastic Surgeon
CALL CreateStaff('Martha', 'Masters', '555-0608', 'm.masters@hospital.com', 9, NULL, NULL, TRUE); -- Medical Assistant
CALL CreateStaff('Chi', 'Park', '555-0609', 'c.park@hospital.com', 2, 7, 'LIC-99609', TRUE); -- Neurology
CALL CreateStaff('Jessica', 'Adams', '555-0610', 'j.adams@hospital.com', 1, NULL, 'LIC-99610', TRUE); -- General


-- ==========================================
-- DOCTORS & SPECIALISTS (Varied NULLs)
-- ==========================================
-- Doctor without a phone number (Testing NULL phone)
CALL CreateStaff('Gregory', 'House', NULL, 'g.house@hospital.com', 4, 28, 'LIC-10001', TRUE);
-- Doctor without an email? (Wait, your schema says NOT NULL, so we keep email)
-- Specialist without a license number (e.g., pending verification)
CALL CreateStaff('Wilson', 'Chase', '555-9901', 'w.chase@hospital.com', 2, 12, NULL, TRUE);
-- General Physician with no specialization
CALL CreateStaff('Allison', 'Cameron', '555-9902', 'a.cam@hospital.com', 1, NULL, 'LIC-10002', TRUE);
-- High-level Consultant
CALL CreateStaff('Lisa', 'Cuddy', '555-1111', 'l.cuddy@hospital.com', 4, NULL, 'LIC-00001', TRUE);
-- Surgeon with everything provided
CALL CreateStaff('Neil', 'Melendez', '555-2222', 'n.melendez@hospital.com', 3, 2, 'LIC-20002', TRUE);
-- Specialist Doctor (Cardiology)
CALL CreateStaff('Shaun', 'Murphy', '555-3333', 's.murphy@hospital.com', 2, 6, 'LIC-30003', TRUE);

-- ==========================================
-- NURSING TEAM (High Volume)
-- ==========================================
-- Nurses usually don't have a specialization_id in many systems unless they are 'Specialist Nurses'
CALL CreateStaff('Claire', 'Browne', '555-4401', 'c.browne@hospital.com', 5, NULL, 'REG-101', TRUE);
CALL CreateStaff('Morgan', 'Reznick', NULL, 'm.rez@hospital.com', 5, NULL, 'REG-102', TRUE);
CALL CreateStaff('Dorie', 'Miller', '555-4403', 'd.miller@hospital.com', 5, NULL, 'REG-103', TRUE);
CALL CreateStaff('Hank', 'Voight', '555-4404', 'h.voight@hospital.com', 6, NULL, 'REG-104', TRUE); -- Head Nurse
CALL CreateStaff('Kim', 'Burgess', '555-4405', 'k.burgess@hospital.com', 7, 16, 'REG-105', TRUE); -- ICU Nurse with Critical Care spec
CALL CreateStaff('Kevin', 'Atwater', NULL, 'k.atwater@hospital.com', 7, 16, 'REG-106', TRUE); -- ICU Nurse
CALL CreateStaff('Trudy', 'Platt', '555-4407', 't.platt@hospital.com', 6, NULL, 'REG-107', TRUE);
CALL CreateStaff('April', 'Sexton', '555-4408', 'a.sexton@hospital.com', 5, NULL, 'REG-108', TRUE);
CALL CreateStaff('Maggie', 'Lockwood', '555-4409', 'm.lockwood@hospital.com', 6, NULL, 'REG-109', TRUE);
CALL CreateStaff('Will', 'Halstead', '555-4410', 'w.halstead@hospital.com', 1, NULL, 'LIC-5501', TRUE);

-- ==========================================
-- MEDICAL ASSISTANTS & LAB STAFF
-- ==========================================
-- Medical Assistants (Role 9) often have no license number recorded
CALL CreateStaff('Ethan', 'Choi', '555-5501', 'e.choi@hospital.com', 9, NULL, NULL, TRUE);
CALL CreateStaff('Brian', 'Tee', '555-5502', 'b.tee@hospital.com', 9, NULL, NULL, TRUE);
CALL CreateStaff('Yaya', 'DaCosta', NULL, 'y.dacosta@hospital.com', 10, NULL, 'LAB-991', TRUE); -- Lab Tech
CALL CreateStaff('Nick', 'Gehlfuss', '555-5504', 'n.gehl@hospital.com', 11, 30, 'RAD-881', TRUE); -- Radiology
CALL CreateStaff('Torrey', 'DeVitto', '555-5505', 't.devitto@hospital.com', 13, 31, 'PATH-771', TRUE); -- Pathologist

-- ==========================================
-- ADMINISTRATIVE & SUPPORT (Mostly NULL License/Spec)
-- ==========================================
CALL CreateStaff('Pam', 'Beesly', '555-6601', 'pam.b@hospital.com', 17, NULL, NULL, TRUE);
CALL CreateStaff('Jim', 'Halpert', '555-6602', 'jim.h@hospital.com', 17, NULL, NULL, TRUE);
CALL CreateStaff('Dwight', 'Schrute', '555-6603', 'dwight.s@hospital.com', 20, NULL, 'SEC-001', TRUE); -- Security with "License"
CALL CreateStaff('Angela', 'Martin', '555-6604', 'angela.m@hospital.com', 19, NULL, NULL, TRUE); -- Billing
CALL CreateStaff('Kevin', 'Malone', NULL, 'kevin.m@hospital.com', 19, NULL, NULL, TRUE); -- Billing (No phone)
CALL CreateStaff('Kelly', 'Kapoor', '555-6606', 'kelly.k@hospital.com', 17, NULL, NULL, TRUE);
CALL CreateStaff('Toby', 'Flenderson', '555-6607', 'toby.f@hospital.com', 18, NULL, NULL, TRUE); -- Manager
CALL CreateStaff('Stanley', 'Hudson', '555-6608', 'stanley.h@hospital.com', 20, NULL, NULL, TRUE);
CALL CreateStaff('Creed', 'Bratton', '555-6609', 'creed.b@hospital.com', 21, NULL, NULL, TRUE); -- Cleaner
CALL CreateStaff('Meredith', 'Palmer', '555-6610', 'meredith.p@hospital.com', 12, NULL, 'PHARM-123', TRUE); -- Pharmacist

-- ==========================================
-- ADDITIONAL DOCTORS & MIXED ROLES (Testing Inactive)
-- ==========================================
CALL CreateStaff('Max', 'Goodwin', '555-7701', 'm.goodwin@hospital.com', 18, NULL, 'LIC-8811', TRUE); -- Manager/Doctor
CALL CreateStaff('Helen', 'Sharpe', '555-7702', 'h.sharpe@hospital.com', 2, 13, 'LIC-8812', TRUE);
CALL CreateStaff('Lauren', 'Bloom', '555-7703', 'l.bloom@hospital.com', 15, NULL, 'EMT-992', TRUE);
CALL CreateStaff('Iggy', 'Frome', '555-7704', 'i.frome@hospital.com', 2, 11, 'LIC-8814', TRUE);
CALL CreateStaff('Vijay', 'Kapoor', '555-7705', 'v.kapoor@hospital.com', 2, 7, 'LIC-8815', FALSE); -- Inactive Specialist
CALL CreateStaff('Casey', 'Acosta', NULL, 'c.acosta@hospital.com', 5, NULL, 'REG-551', TRUE);
CALL CreateStaff('Elizabeth', 'Wilder', '555-7707', 'e.wilder@hospital.com', 3, 13, 'LIC-8817', TRUE);
CALL CreateStaff('Mia', 'Castries', '555-7708', 'm.castries@hospital.com', 2, NULL, 'LIC-8818', TRUE);
CALL CreateStaff('Mark', 'Walsh', '555-7709', 'm.walsh@hospital.com', 16, NULL, NULL, TRUE); -- Ambulance Driver
CALL CreateStaff('Gladys', 'Jones', '555-7710', 'g.jones@hospital.com', 21, NULL, NULL, TRUE);

-- ==========================================
-- WARD BOYS & EMTs (High NULL usage)
-- ==========================================
CALL CreateStaff('Sam', 'Bridges', '555-8801', 's.bridges@hospital.com', 8, NULL, NULL, TRUE);
CALL CreateStaff('Fragile', 'Express', NULL, 'fragile@hospital.com', 8, NULL, NULL, TRUE);
CALL CreateStaff('Die', 'Hardman', '555-8803', 'd.hardman@hospital.com', 15, NULL, 'EMT-772', TRUE);
CALL CreateStaff('Dead', 'Man', '555-8804', 'deadman@hospital.com', 10, NULL, NULL, TRUE);
CALL CreateStaff('Heart', 'Man', '555-8805', 'heartman@hospital.com', 14, 31, NULL, TRUE);
CALL CreateStaff('Arthur', 'Morgan', '555-8806', 'a.morgan@hospital.com', 20, NULL, NULL, TRUE);
CALL CreateStaff('John', 'Marston', '555-8807', 'j.marston@hospital.com', 20, NULL, NULL, TRUE);
CALL CreateStaff('Sadie', 'Adler', '555-8808', 's.adler@hospital.com', 16, NULL, 'DRV-441', TRUE);
CALL CreateStaff('Charles', 'Smith', '555-8809', 'c.smith@hospital.com', 8, NULL, NULL, TRUE);
CALL CreateStaff('Dutch', 'vanderLinde', '555-8810', 'dutch.v@hospital.com', 18, NULL, NULL, FALSE);