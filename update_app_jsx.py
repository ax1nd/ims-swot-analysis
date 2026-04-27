import re

with open('sql/add_students.py', 'r') as f:
    add_students_code = f.read()

# Extract data
data_match = re.search(r'data = """(.*?)"""', add_students_code, re.DOTALL)
if not data_match:
    print("Could not find data in add_students.py")
    exit(1)

data = data_match.group(1)
lines = [l.strip() for l in data.split('\n') if l.strip()]

new_entries = []
for line in lines:
    parts = re.split(r'\s*—\s*', line)
    if len(parts) >= 2:
        roll_no = parts[0].strip()
        name = parts[1].strip()
        email = name.lower().replace(' ', '.') + '@example.com'
        new_entries.append(f"  '{roll_no}': '{email}'")

with open('app.jsx', 'r') as f:
    app_jsx = f.read()

# Replace STUDENT_EMAIL_BY_ROLL
old_student_email_def = "const STUDENT_EMAIL_BY_ROLL = { '2117240020033': 'aarav.sharma@example.com' };"
new_student_email_def = "const STUDENT_EMAIL_BY_ROLL = {\n  '2117240020033': 'aarav.sharma@example.com',\n" + ",\n".join(new_entries) + "\n};"

app_jsx = app_jsx.replace(old_student_email_def, new_student_email_def)

# Replace handleSubmit logic
old_login_logic = """    } else if (userId === '2117240020033' && password === '0123456789') {
      pushAuditLog({ actor: userId, type: 'login_success', message: 'Student login success' });
      onSignIn({ role: 'student', email: STUDENT_EMAIL_BY_ROLL[userId] || null });
    }"""
new_login_logic = """    } else if ((userId === '2117240020033' && password === '0123456789') || (password === userId && STUDENT_EMAIL_BY_ROLL[userId])) {
      pushAuditLog({ actor: userId, type: 'login_success', message: 'Student login success' });
      onSignIn({ role: 'student', email: STUDENT_EMAIL_BY_ROLL[userId] || null });
    }"""

app_jsx = app_jsx.replace(old_login_logic, new_login_logic)

with open('app.jsx', 'w') as f:
    f.write(app_jsx)

print("Updated app.jsx")
