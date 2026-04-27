-- =============================================================================
-- SWOT Analysis: Schema + Synthetic Data from CAT Marks
-- Admin defines courses; analysis uses each student's CAT marks for those courses.
-- Run this SQL to create tables and seed data. Export cat_marks + courses +
-- students to CSV (Course ID, Course Name, Attempt ID, Candidate Name,
-- Candidate Email, Mark, Grade, Date_of_Attempt) for the ML API.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Students (who use the IMS; CAT marks belong to them)
-- -----------------------------------------------------------------------------
-- Compatible with MySQL / MariaDB. For SQLite use AUTOINCREMENT; for PostgreSQL use SERIAL.
CREATE TABLE IF NOT EXISTS students (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  roll_no       VARCHAR(32) NOT NULL UNIQUE,
  name          VARCHAR(128) NOT NULL,
  email         VARCHAR(128) NOT NULL UNIQUE,
  academic_year VARCHAR(16)  NOT NULL DEFAULT '2025-2026',
  semester      VARCHAR(8)   NOT NULL DEFAULT 'IV',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. Courses (admin places/defines these; only these are used in SWOT analysis)
-- Subjects as on CAT Marks page: same 6 courses
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  course_code   VARCHAR(32)  NOT NULL UNIQUE,
  course_name   VARCHAR(256) NOT NULL,
  faculty_name  VARCHAR(128) NOT NULL,
  academic_year VARCHAR(16)  NOT NULL DEFAULT '2025-2026',
  semester      VARCHAR(8)   NOT NULL DEFAULT 'IV',
  max_cat1      INT NOT NULL DEFAULT 50,
  max_cat2      INT NOT NULL DEFAULT 25,
  max_cat3      INT NOT NULL DEFAULT 50,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. CAT Marks (per student per course) — source for SWOT Mark/Grade
-- CAT1: CO1(25)+CO2(25)=50, CAT2: 25, CAT3: CO1(25)+CO2(25)=50. Internal e.g. 6.4/8.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cat_marks (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  student_id        INT NOT NULL,
  course_id         INT NOT NULL,
  cat1_co1          INT,
  cat1_co2          INT,
  cat1_total        INT,
  cat2_total        INT,
  cat3_co1          INT,
  cat3_co2          INT,
  cat3_total        INT,
  internal_num      DECIMAL(5,2),
  internal_den      INT DEFAULT 8,
  UNIQUE KEY uq_student_course (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Indexes for lookups (student by email, marks by student)
-- -----------------------------------------------------------------------------
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_cat_marks_student ON cat_marks(student_id);
CREATE INDEX idx_cat_marks_course  ON cat_marks(course_id);

-- -----------------------------------------------------------------------------
-- 4. Audit Blockchain (Immutable Ledger)
-- Each entry links to the previous one via hash for anti-tampering.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_blockchain (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  timestamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actor           VARCHAR(128) NOT NULL,
  action_type     VARCHAR(64) NOT NULL,
  payload         JSON NOT NULL,
  prev_hash       VARCHAR(64) NOT NULL,
  current_hash    VARCHAR(64) NOT NULL,
  INDEX idx_blockchain_hash (current_hash)
);

-- =============================================================================
-- SYNTHETIC DATA
-- =============================================================================

-- Students (roll_no 2117240020033 is the demo student; include others for analysis)
INSERT INTO students (id, roll_no, name, email, academic_year, semester) VALUES
(1, '2117240020033', 'Aarav Sharma', 'aarav.sharma@example.com', '2025-2026', 'IV'),
(2, '2117240020034', 'Vivaan Singh', 'vivaan.singh@example.com', '2025-2026', 'IV'),
(3, '2117240020035', 'Aditya Kumar', 'aditya.kumar@example.com', '2025-2026', 'IV'),
(4, '2117240020036', 'Saanvi Reddy', 'saanvi.reddy@example.com', '2025-2026', 'IV'),
(5, '2117240020037', 'Ishaan Iyer', 'ishaan.iyer@example.com', '2025-2026', 'IV'),
(6, '2117240020038', 'Ananya Gupta', 'ananya.gupta@example.com', '2025-2026', 'IV')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);

-- Courses (same 6 subjects as on CAT Marks page — admin maintains this list)
INSERT INTO courses (id, course_code, course_name, faculty_name, academic_year, semester, max_cat1, max_cat2, max_cat3) VALUES
(1, 'AL23432', 'Machine Learning Techniques', 'ARAVINDH S', '2025-2026', 'IV', 50, 25, 50),
(2, 'CS23415', 'Operating Systems', 'SOWMYA S', '2025-2026', 'IV', 50, 25, 50),
(3, 'CS23411', 'Database Management Systems', 'PANDIARAJAN T.', '2025-2026', 'IV', 50, 25, 50),
(4, 'CS23413', 'Theory of Computation', 'ANGALAPARAMESWARI ANBAZHAGAN', '2025-2026', 'IV', 50, 25, 50),
(5, 'CS23414', 'Software Development Practices', 'SRINIVASAN M.L.', '2025-2026', 'IV', 50, 25, 50),
(6, 'CS23431', 'Design and Analysis of Algorithms', 'MURUGAN P', '2025-2026', 'IV', 50, 25, 50)
ON DUPLICATE KEY UPDATE course_name = VALUES(course_name), faculty_name = VALUES(faculty_name);

-- CAT marks: synthetic marks for each student × each course (generates variety for SWOT)
-- Mark/grade for SWOT: use (cat1_total + cat2_total + cat3_total) out of 125 → scale to 0–100; Grade A≥80, B≥70, C≥60, D≥50, F<50

-- Student 1 (Aarav) - mix of strengths and weaknesses
INSERT INTO cat_marks (student_id, course_id, cat1_co1, cat1_co2, cat1_total, cat2_total, cat3_co1, cat3_co2, cat3_total, internal_num, internal_den) VALUES
(1, 1, 12, 13, 25, 12, 11, 14, 25, 6.4, 8),
(1, 2, 10, 11, 21, 10, 9, 10, 19, 5.2, 8),
(1, 3, 20, 22, 42, 20, 21, 23, 44, 7.5, 8),
(1, 4, 18, 19, 37, 18, 17, 20, 37, 6.8, 8),
(1, 5, 14, 15, 29, 14, 13, 14, 27, 5.8, 8),
(1, 6, 22, 23, 45, 22, 21, 24, 45, 7.6, 8)
ON DUPLICATE KEY UPDATE cat1_total = VALUES(cat1_total), cat2_total = VALUES(cat2_total), cat3_total = VALUES(cat3_total);

-- Student 2 (Vivaan) - weaker in a few subjects
INSERT INTO cat_marks (student_id, course_id, cat1_co1, cat1_co2, cat1_total, cat2_total, cat3_co1, cat3_co2, cat3_total, internal_num, internal_den) VALUES
(2, 1, 8, 9, 17, 8, 7, 9, 16, 4.0, 8),
(2, 2, 11, 12, 23, 11, 12, 11, 23, 5.8, 8),
(2, 3, 15, 16, 31, 14, 15, 16, 31, 6.0, 8),
(2, 4, 7, 8, 15, 7, 8, 7, 15, 3.5, 8),
(2, 5, 19, 20, 39, 19, 18, 20, 38, 7.0, 8),
(2, 6, 10, 11, 21, 10, 11, 10, 21, 5.0, 8)
ON DUPLICATE KEY UPDATE cat1_total = VALUES(cat1_total), cat2_total = VALUES(cat2_total), cat3_total = VALUES(cat3_total);

-- Student 3 (Aditya) - strong overall
INSERT INTO cat_marks (student_id, course_id, cat1_co1, cat1_co2, cat1_total, cat2_total, cat3_co1, cat3_co2, cat3_total, internal_num, internal_den) VALUES
(3, 1, 23, 24, 47, 23, 24, 25, 49, 7.8, 8),
(3, 2, 21, 22, 43, 21, 22, 23, 45, 7.2, 8),
(3, 3, 22, 24, 46, 23, 23, 24, 47, 7.6, 8),
(3, 4, 20, 21, 41, 20, 21, 22, 43, 7.0, 8),
(3, 5, 23, 24, 47, 24, 23, 24, 47, 7.8, 8),
(3, 6, 24, 25, 49, 24, 24, 25, 49, 8.0, 8)
ON DUPLICATE KEY UPDATE cat1_total = VALUES(cat1_total), cat2_total = VALUES(cat2_total), cat3_total = VALUES(cat3_total);

-- Student 4 (Saanvi) - strong in ML and DBMS
INSERT INTO cat_marks (student_id, course_id, cat1_co1, cat1_co2, cat1_total, cat2_total, cat3_co1, cat3_co2, cat3_total, internal_num, internal_den) VALUES
(4, 1, 24, 25, 49, 24, 24, 25, 49, 8.0, 8),
(4, 2, 16, 17, 33, 16, 15, 16, 31, 6.2, 8),
(4, 3, 23, 24, 47, 23, 24, 24, 48, 7.6, 8),
(4, 4, 18, 19, 37, 18, 17, 18, 35, 6.4, 8),
(4, 5, 20, 21, 41, 20, 21, 22, 43, 7.0, 8),
(4, 6, 19, 20, 39, 19, 20, 21, 41, 6.8, 8)
ON DUPLICATE KEY UPDATE cat1_total = VALUES(cat1_total), cat2_total = VALUES(cat2_total), cat3_total = VALUES(cat3_total);

-- Student 5 (Ishaan) - mixed
INSERT INTO cat_marks (student_id, course_id, cat1_co1, cat1_co2, cat1_total, cat2_total, cat3_co1, cat3_co2, cat3_total, internal_num, internal_den) VALUES
(5, 1, 20, 21, 41, 20, 21, 22, 43, 7.0, 8),
(5, 2, 19, 20, 39, 19, 18, 20, 38, 6.6, 8),
(5, 3, 17, 18, 35, 17, 16, 18, 34, 6.0, 8),
(5, 4, 21, 22, 43, 21, 22, 23, 45, 7.2, 8),
(5, 5, 15, 16, 31, 15, 14, 15, 29, 5.4, 8),
(5, 6, 23, 24, 47, 23, 24, 24, 48, 7.6, 8)
ON DUPLICATE KEY UPDATE cat1_total = VALUES(cat1_total), cat2_total = VALUES(cat2_total), cat3_total = VALUES(cat3_total);

-- Student 6 (Ananya) - strong in theory, weaker in programming
INSERT INTO cat_marks (student_id, course_id, cat1_co1, cat1_co2, cat1_total, cat2_total, cat3_co1, cat3_co2, cat3_total, internal_num, internal_den) VALUES
(6, 1, 18, 19, 37, 18, 17, 19, 36, 6.4, 8),
(6, 2, 14, 15, 29, 14, 13, 14, 27, 5.4, 8),
(6, 3, 21, 22, 43, 21, 22, 23, 45, 7.2, 8),
(6, 4, 24, 25, 49, 24, 24, 25, 49, 8.0, 8),
(6, 5, 11, 12, 23, 11, 10, 12, 22, 4.8, 8),
(6, 6, 22, 23, 45, 22, 23, 24, 47, 7.4, 8)
ON DUPLICATE KEY UPDATE cat1_total = VALUES(cat1_total), cat2_total = VALUES(cat2_total), cat3_total = VALUES(cat3_total);

-- =============================================================================
-- Query to export data in SWOT ML CSV format (Course ID, Course Name, Attempt ID,
-- Candidate Name, Candidate Email, Mark, Grade, Date_of_Attempt)
-- Mark = (cat1_total + cat2_total + cat3_total) * 100 / 125 (scale to 0–100)
-- Grade: A ≥ 80, B ≥ 70, C ≥ 60, D ≥ 50, F < 50
-- =============================================================================
/*
SELECT
  c.course_code   AS 'Course ID',
  c.course_name   AS 'Course Name',
  1               AS 'Attempt ID',
  s.name          AS 'Candidate Name',
  s.email         AS 'Candidate Email',
  ROUND((m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125, 0) AS 'Mark',
  CASE
    WHEN (m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125 >= 80 THEN 'A'
    WHEN (m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125 >= 70 THEN 'B'
    WHEN (m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125 >= 60 THEN 'C'
    WHEN (m.cat1_total + m.cat2_total + m.cat3_total) * 100.0 / 125 >= 50 THEN 'D'
    ELSE 'F'
  END AS 'Grade',
  CURDATE()       AS 'Date_of_Attempt'
FROM cat_marks m
JOIN students s ON s.id = m.student_id
JOIN courses c  ON c.id = m.course_id
WHERE m.cat1_total IS NOT NULL AND m.cat2_total IS NOT NULL AND m.cat3_total IS NOT NULL
ORDER BY s.email, c.course_code;
*/
