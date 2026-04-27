import re
import random

data = """
2117240020001 — AAKASH B K — B.E. CSE — 2024–2028 — Day Scholar
2117240020002 — AARTHI M — B.E. CSE — 2024–2028 — Hosteller
2117240020003 — AASHIDA V — B.E. CSE — 2024–2028 — Day Scholar
2117240020004 — ABHILASH M — B.E. CSE — 2024–2028 — Hosteller
2117240020005 — ABIMANUE M — B.E. CSE — 2024–2028 — Day Scholar
2117240020006 — ABINA JERLIN M — B.E. CSE — 2024–2028 — Day Scholar
2117240020007 — ABINAYA S G — B.E. CSE — 2024–2028 — Day Scholar
2117240020008 — ABINESH S — B.E. CSE — 2024–2028 — Day Scholar
2117240020009 — ABIRAMI B — B.E. CSE — 2024–2028 — Hosteller
2117240020010 — ABISHEK S — B.E. CSE — 2024–2028 — Day Scholar
2117240020011 — ADARSH H — B.E. CSE — 2024–2028 — Day Scholar
2117240020012 — ADITYA PARTHASARATHY — B.E. CSE — 2024–2028 — Day Scholar
2117240020013 — AFSA R — B.E. CSE — 2024–2028 — Day Scholar
2117240020014 — AISWARYAA BABU — B.E. CSE — 2024–2028 — Day Scholar
2117240020015 — AKASH A — B.E. CSE — 2024–2028 — Day Scholar
2117240020016 — AKSHARA P — B.E. CSE — 2024–2028 — Day Scholar
2117240020017 — AKSHAY V — B.E. CSE — 2024–2028 — Hosteller
2117240020018 — AKSHAYA K — B.E. CSE — 2024–2028 — Hosteller
2117240020019 — AKSHAYA M — B.E. CSE — 2024–2028 — Day Scholar
2117240020020 — AKSHAYA R L — B.E. CSE — 2024–2028 — Day Scholar
2117240020021 — AKSHAYA DARSHINI N — B.E. CSE — 2024–2028 — Day Scholar
2117240020022 — AKSHITHA P — B.E. CSE — 2024–2028 — Day Scholar
2117240020023 — AKSHITHA S — B.E. CSE — 2024–2028 — Day Scholar
2117240020024 — AMBATI NIKHITHA — B.E. CSE — 2024–2028 — Hosteller
2117240020025 — AMUDHAN M — B.E. CSE — 2024–2028 — Hosteller
2117240020026 — ANISHA PATHAK — B.E. CSE — 2024–2028 — Day Scholar
2117240020027 — ANISKA S P — B.E. CSE — 2024–2028 — Day Scholar
2117240020028 — ANJASRI V — B.E. CSE — 2024–2028 — Hosteller
2117240020029 — ANUSHA B — B.E. CSE — 2024–2028 — Hosteller
2117240020030 — ANU SHRI R — B.E. CSE — 2024–2028 — Day Scholar
2117240020031 — ARAVINDRAJ D — B.E. CSE — 2024–2028 — Day Scholar
2117240020032 — ARNAV KUMAR R — B.E. CSE — 2024–2028 — Day Scholar
2117240020033 — ARVIND N — B.E. CSE — 2024–2028 — Day Scholar
2117240020034 — ASANTHIKA A — B.E. CSE — 2024–2028 — Hosteller
2117240020035 — ASEEMA S — B.E. CSE — 2024–2028 — Day Scholar
2117240020036 — ASHA A — B.E. CSE — 2024–2028 — Hosteller
2117240020037 — ASHWIN G — B.E. CSE — 2024–2028 — Day Scholar
2117240020038 — ASIN D — B.E. CSE — 2024–2028 — Hosteller
2117240020039 — ASWANTHAR M — B.E. CSE — 2024–2028 — Hosteller
2117240020040 — ASWIN R — B.E. CSE — 2024–2028 — Day Scholar
2117240020041 — ASWIN KUMAR E N — B.E. CSE — 2024–2028 — Day Scholar
2117240020042 — ASWINI M — B.E. CSE — 2024–2028 — Day Scholar
2117240020043 — ATHISHWAR J — B.E. CSE — 2024–2028 — Day Scholar
2117240020044 — AUSTIN JOSHUA M — B.E. CSE — 2024–2028 — Day Scholar
2117240020045 — AVINESHWARAN A — B.E. CSE — 2024–2028 — Hosteller
2117240020046 — BALAJI M R — B.E. CSE — 2024–2028 — Hosteller
2117240020047 — BALAJI P — B.E. CSE — 2024–2028 — Day Scholar
2117240020048 — BASKAR J — B.E. CSE — 2024–2028 — Day Scholar
2117240020049 — BAVATHARINI R — B.E. CSE — 2024–2028 — Day Scholar
2117240020050 — BHARANIDHARAN R — B.E. CSE — 2024–2028 — Hosteller
2117240020051 — BHUVANESHWARAN S — B.E. CSE — 2024–2028 — Hosteller
2117240020052 — CATHERIN JENIRA I — B.E. CSE — 2024–2028 — Hosteller
2117240020053 — CHARUMATHI K — B.E. CSE — 2024–2028 — Day Scholar
2117240020054 — CHRIS ALAN — B.E. CSE — 2024–2028 — Hosteller
2117240020055 — CHRIS MELVYN RAJ P — B.E. CSE — 2024–2028 — Day Scholar
2117240020056 — CHRISTOPHER J — B.E. CSE — 2024–2028 — Day Scholar
2117240020057 — DARSHAN A R — B.E. CSE — 2024–2028 — Day Scholar
2117240020058 — DARSHAN B — B.E. CSE — 2024–2028 — Day Scholar
2117240020059 — DEBORHAL L — B.E. CSE — 2024–2028 — Hosteller
2117240020060 — DEEPA SHREE C — B.E. CSE — 2024–2028 — Day Scholar
2117240020061 — DEEPESH V — B.E. CSE — 2024–2028 — Day Scholar
2117240020062 — DEEPIKA P — B.E. CSE — 2024–2028 — Hosteller
"""

lines = [l.strip() for l in data.split('\n') if l.strip()]

students = []
for line in lines:
    parts = re.split(r'\s*—\s*', line)
    if len(parts) >= 2:
        roll_no = parts[0].strip()
        name = parts[1].strip()
        email = name.lower().replace(' ', '.') + '@example.com'
        students.append((roll_no, name, email))

with open('sql/insert_new_students.sql', 'w') as f:
    f.write("-- Insert new students\n")
    f.write("INSERT INTO students (roll_no, name, email, academic_year, semester) VALUES\n")
    
    values = []
    for roll_no, name, email in students:
        values.append(f"('{roll_no}', '{name}', '{email}', '2024-2028', 'IV')")
        
    f.write(",\n".join(values))
    f.write("\nON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);\n\n")

    f.write("-- Insert cat_marks for new students\n")
    # We don't have their IDs directly in SQL, we can use an INSERT INTO ... SELECT
    
    for roll_no, name, email in students:
        f.write(f"-- Marks for {name} ({roll_no})\n")
        
        # generate 6 subjects
        for course_id in range(1, 7):
            cat1_co1 = random.randint(10, 25)
            cat1_co2 = random.randint(10, 25)
            cat1_total = cat1_co1 + cat1_co2
            
            cat2_total = random.randint(10, 25)
            
            cat3_co1 = random.randint(10, 25)
            cat3_co2 = random.randint(10, 25)
            cat3_total = cat3_co1 + cat3_co2
            
            internal_num = round(random.uniform(4.0, 8.0), 1)
            
            f.write(f"INSERT INTO cat_marks (student_id, course_id, cat1_co1, cat1_co2, cat1_total, cat2_total, cat3_co1, cat3_co2, cat3_total, internal_num, internal_den) ")
            f.write(f"SELECT id, {course_id}, {cat1_co1}, {cat1_co2}, {cat1_total}, {cat2_total}, {cat3_co1}, {cat3_co2}, {cat3_total}, {internal_num}, 8 ")
            f.write(f"FROM students WHERE roll_no = '{roll_no}'\n")
            f.write(f"ON DUPLICATE KEY UPDATE cat1_total = VALUES(cat1_total), cat2_total = VALUES(cat2_total), cat3_total = VALUES(cat3_total);\n")
        f.write("\n")

print("Generated sql/insert_new_students.sql")
