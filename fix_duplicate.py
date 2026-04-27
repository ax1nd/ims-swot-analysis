with open('app.jsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "const STUDENT_EMAIL_BY_ROLL = {" in line:
        new_lines.append(line)
        continue
    if "const STUDENT_NAME_BY_ROLL = {" in line:
        new_lines.append(line)
        continue
    
    # We remove the hardcoded '2117240020033' because we dynamically added it inside the new_entries
    if "'2117240020033': 'aarav.sharma@example.com'," in line:
        continue
    if "'2117240020033': 'Aarav Sharma'," in line:
        continue

    new_lines.append(line)

with open('app.jsx', 'w') as f:
    f.writelines(new_lines)
