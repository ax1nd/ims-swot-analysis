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

name_entries = []
for line in lines:
    parts = re.split(r'\s*—\s*', line)
    if len(parts) >= 2:
        roll_no = parts[0].strip()
        name = parts[1].strip()
        # Capitalize words properly
        name = ' '.join([word.capitalize() for word in name.split()])
        name_entries.append(f"  '{roll_no}': '{name}'")

with open('app.jsx', 'r') as f:
    app_jsx = f.read()

# Add STUDENT_NAME_BY_ROLL below STUDENT_EMAIL_BY_ROLL
student_name_def = "const STUDENT_NAME_BY_ROLL = {\n  '2117240020033': 'Aarav Sharma',\n" + ",\n".join(name_entries) + "\n};\n"

app_jsx = app_jsx.replace("const ADMIN_PASSWORD = '9025726185';", student_name_def + "const ADMIN_PASSWORD = '9025726185';")

# Update SignInPage handleSubmit to pass name and regNo
old_login_logic = """    } else if ((userId === '2117240020033' && password === '0123456789') || (password === userId && STUDENT_EMAIL_BY_ROLL[userId])) {
      pushAuditLog({ actor: userId, type: 'login_success', message: 'Student login success' });
      onSignIn({ role: 'student', email: STUDENT_EMAIL_BY_ROLL[userId] || null });
    }"""
new_login_logic = """    } else if ((userId === '2117240020033' && password === '0123456789') || (password === userId && STUDENT_EMAIL_BY_ROLL[userId])) {
      pushAuditLog({ actor: userId, type: 'login_success', message: 'Student login success' });
      onSignIn({ role: 'student', email: STUDENT_EMAIL_BY_ROLL[userId] || null, name: STUDENT_NAME_BY_ROLL[userId] || 'Student', regNo: userId });
    }"""
app_jsx = app_jsx.replace(old_login_logic, new_login_logic)

# Update App component to handle name and regNo
old_app_auth = """  const [authRole, setAuthRole] = useState('student');
  const [studentEmail, setStudentEmail] = useState(null);"""
new_app_auth = """  const [authRole, setAuthRole] = useState('student');
  const [studentEmail, setStudentEmail] = useState(null);
  const [studentName, setStudentName] = useState('Student');
  const [studentRegNo, setStudentRegNo] = useState(null);"""
app_jsx = app_jsx.replace(old_app_auth, new_app_auth)

old_onSignIn = """        onSignIn={({ role, email }) => {
          setIsAuthenticated(true);
          setAuthRole(role || 'student');
          setStudentEmail(email || null);
        }}"""
new_onSignIn = """        onSignIn={({ role, email, name, regNo }) => {
          setIsAuthenticated(true);
          setAuthRole(role || 'student');
          setStudentEmail(email || null);
          setStudentName(name || (role === 'admin' ? 'Admin' : role === 'hod' ? 'HOD' : role === 'teacher' ? 'Teacher' : 'Student'));
          setStudentRegNo(regNo || null);
        }}"""
app_jsx = app_jsx.replace(old_onSignIn, new_onSignIn)

# Replace "Good morning, Arvind." with the dynamic name
app_jsx = app_jsx.replace(
    '<h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Good morning, Arvind.</h1>',
    '<h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Good morning, {studentName}.</h1>'
)

# Update Quick Login logic
old_quick_login = """      } else {
        pushAuditLog({ actor: '2117240020033', type: 'login_success', message: 'Student quick login success' });
        onSignIn({ role: 'student', email: STUDENT_EMAIL_BY_ROLL['2117240020033'] || null });
      }"""
new_quick_login = """      } else {
        pushAuditLog({ actor: '2117240020033', type: 'login_success', message: 'Student quick login success' });
        onSignIn({ role: 'student', email: STUDENT_EMAIL_BY_ROLL['2117240020033'] || null, name: 'Aarav Sharma', regNo: '2117240020033' });
      }"""
app_jsx = app_jsx.replace(old_quick_login, new_quick_login)

with open('app.jsx', 'w') as f:
    f.write(app_jsx)

print("Updated app.jsx with dynamic names")
