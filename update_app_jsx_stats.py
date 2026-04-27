with open('app.jsx', 'r') as f:
    app_jsx = f.read()

old_stats = """  const stats = [
    { label: 'CGPA', value: '8.42', icon: GraduationCap, colorClass: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', shadowClass: 'shadow-blue-500/20', darkGlow: 'bg-blue-600' },
    { label: 'Current Arrears', value: '0', icon: Sparkles, colorClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', shadowClass: 'shadow-emerald-500/20', darkGlow: 'bg-emerald-600' },
    { label: 'Avg Attendance', value: '92%', icon: UserCheck, colorClass: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', shadowClass: 'shadow-indigo-500/20', darkGlow: 'bg-indigo-600', onClick: () => setActiveTab('Attendance') },
    { label: 'Total Leaves', value: '2', icon: Clock, colorClass: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400', shadowClass: 'shadow-orange-500/20', darkGlow: 'bg-orange-600', onClick: () => setActiveTab('Leave / OD') },
  ];"""

new_stats = """  const generateStudentStats = (regNo) => {
    if (!regNo) return { cgpa: '8.42', arrears: '0', attendance: '92', leaves: '2' };
    let hash = 0;
    for (let i = 0; i < regNo.length; i++) hash = regNo.charCodeAt(i) + ((hash << 5) - hash);
    const prng = (seed) => { let s = Math.abs(hash + seed); return (s % 100) / 100; };
    return {
      cgpa: (7.0 + prng(1) * 2.5).toFixed(2),
      arrears: Math.floor(prng(2) * 1.5).toString(),
      attendance: Math.floor(75 + prng(3) * 24).toString(),
      leaves: Math.floor(prng(4) * 6).toString()
    };
  };
  const ds = generateStudentStats(studentRegNo);

  const stats = [
    { label: 'CGPA', value: ds.cgpa, icon: GraduationCap, colorClass: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', shadowClass: 'shadow-blue-500/20', darkGlow: 'bg-blue-600' },
    { label: 'Current Arrears', value: ds.arrears, icon: Sparkles, colorClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', shadowClass: 'shadow-emerald-500/20', darkGlow: 'bg-emerald-600' },
    { label: 'Avg Attendance', value: ds.attendance + '%', icon: UserCheck, colorClass: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', shadowClass: 'shadow-indigo-500/20', darkGlow: 'bg-indigo-600', onClick: () => setActiveTab('Attendance') },
    { label: 'Total Leaves', value: ds.leaves, icon: Clock, colorClass: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400', shadowClass: 'shadow-orange-500/20', darkGlow: 'bg-orange-600', onClick: () => setActiveTab('Leave / OD') },
  ];"""

if old_stats in app_jsx:
    app_jsx = app_jsx.replace(old_stats, new_stats)
    with open('app.jsx', 'w') as f:
        f.write(app_jsx)
    print("Updated stats successfully.")
else:
    print("Could not find the stats array.")
