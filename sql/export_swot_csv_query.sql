-- =============================================================================
-- Export query: run after swot_cat_marks_schema_and_data.sql
-- Output columns match SWOT ML API CSV: Course ID, Course Name, Attempt ID,
-- Candidate Name, Candidate Email, Mark, Grade, Date_of_Attempt
-- Mark = (cat1_total + cat2_total + cat3_total) * 100 / 125; Grade A/B/C/D/F
-- =============================================================================

SELECT
  c.course_code   AS 'Course ID',
  c.course_name   AS 'Course Name',
  1               AS 'Attempt ID',
  s.name          AS 'Candidate Name',
  s.email         AS 'Candidate Email',
  ROUND((COALESCE(m.cat1_total, 0) + COALESCE(m.cat2_total, 0) + COALESCE(m.cat3_total, 0)) * 100.0 / 125, 0) AS 'Mark',
  CASE
    WHEN (COALESCE(m.cat1_total, 0) + COALESCE(m.cat2_total, 0) + COALESCE(m.cat3_total, 0)) * 100.0 / 125 >= 80 THEN 'A'
    WHEN (COALESCE(m.cat1_total, 0) + COALESCE(m.cat2_total, 0) + COALESCE(m.cat3_total, 0)) * 100.0 / 125 >= 70 THEN 'B'
    WHEN (COALESCE(m.cat1_total, 0) + COALESCE(m.cat2_total, 0) + COALESCE(m.cat3_total, 0)) * 100.0 / 125 >= 60 THEN 'C'
    WHEN (COALESCE(m.cat1_total, 0) + COALESCE(m.cat2_total, 0) + COALESCE(m.cat3_total, 0)) * 100.0 / 125 >= 50 THEN 'D'
    ELSE 'F'
  END AS 'Grade',
  CURDATE()       AS 'Date_of_Attempt'
FROM cat_marks m
JOIN students s ON s.id = m.student_id
JOIN courses c  ON c.id = m.course_id
WHERE (m.cat1_total IS NOT NULL OR m.cat2_total IS NOT NULL OR m.cat3_total IS NOT NULL)
ORDER BY s.email, c.course_code;
