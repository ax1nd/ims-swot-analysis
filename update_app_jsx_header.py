with open('app.jsx', 'r') as f:
    app_jsx = f.read()

# Replace hardcoded Arvind N. in header
old_header_name = '<span className={`text-sm font-semibold ${currentTheme.textPrimary} hidden sm:block`}>Arvind N.</span>'
new_header_name = '<span className={`text-sm font-semibold ${currentTheme.textPrimary} hidden sm:block`}>{studentName}</span>'
app_jsx = app_jsx.replace(old_header_name, new_header_name)

# Replace hardcoded seed for Avatar
old_avatar = 'src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arvind&backgroundColor=transparent"'
new_avatar = 'src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentName)}&backgroundColor=transparent`}'
app_jsx = app_jsx.replace(old_avatar, new_avatar)

# Replace hardcoded Arvind N. in profile settings
old_input = '<input defaultValue="Arvind N." className={`mt-1 w-full px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />'
new_input = '<input defaultValue={studentName} className={`mt-1 w-full px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />'
app_jsx = app_jsx.replace(old_input, new_input)

with open('app.jsx', 'w') as f:
    f.write(app_jsx)

print("Updated app.jsx with dynamic header name")
