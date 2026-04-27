with open('app.jsx', 'r') as f:
    app_jsx = f.read()

# Update AttendanceContent definition
old_attendance_def = "const AttendanceContent = ({ currentTheme, darkMode }) => {"
new_attendance_def = "const AttendanceContent = ({ currentTheme, darkMode, studentRegNo, authRole }) => {"
app_jsx = app_jsx.replace(old_attendance_def, new_attendance_def)

# Update AttendanceContent filtering
old_attendance_filter = """  const filteredData = attendanceData.filter((row) => {
    const q = searchText.trim().toLowerCase();"""
new_attendance_filter = """  const filteredData = attendanceData.filter((row) => {
    if (authRole === 'student' && studentRegNo && row.regNo !== studentRegNo) return false;
    const q = searchText.trim().toLowerCase();"""
app_jsx = app_jsx.replace(old_attendance_filter, new_attendance_filter)

# Update AttendanceContent invocation
old_attendance_invoke = "<AttendanceContent currentTheme={currentTheme} darkMode={darkMode} />"
new_attendance_invoke = "<AttendanceContent currentTheme={currentTheme} darkMode={darkMode} studentRegNo={studentRegNo} authRole={authRole} />"
app_jsx = app_jsx.replace(old_attendance_invoke, new_attendance_invoke)

with open('app.jsx', 'w') as f:
    f.write(app_jsx)

print("Updated app.jsx with AttendanceContent changes")
