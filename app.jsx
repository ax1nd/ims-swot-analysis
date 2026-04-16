import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  FileText,
  UserCheck,
  BarChart3,
  ClipboardList,
  Wallet,
  MessageSquare,
  Search,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
  User,
  Zap,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Users,
  Settings,
  Activity,
  Award,
  Building2,
  Bus,
  MapPin,
  KeyRound,
  Filter,
  Wrench,
  Send,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  Target,
  BookMarked
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import KuttiChatbot from './components/KuttiChatbot';
import { signInWithGoogle, signOutFirebase, isAllowedEmail, isFirebaseConfigured } from './src/firebase';

// Admin credentials (shared login page; these redirect to admin panel)
const ADMIN_USERNAME = '2117240020056';
// Roll number -> student email (for SWOT analysis; matches sql/swot_cat_marks_schema_and_data.sql)
const STUDENT_EMAIL_BY_ROLL = { '2117240020033': 'aarav.sharma@example.com' };
const ADMIN_PASSWORD = '9025726185';

// Apple-inspired Glassy & Neon Theme Configuration
const themes = {
  light: {
    bg: 'bg-slate-100/80',
    sidebar: 'bg-white/50 backdrop-blur-2xl border-r border-white/70 shadow-[1px_0_24px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,255,255,0.6)_inset]',
    sidebarText: 'text-slate-500',
    sidebarActive: 'bg-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-blue-600 border border-white/80',
    card: 'bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.04),0_0_0_1px_rgba(255,255,255,0.5)_inset]',
    cardInner: 'bg-gradient-to-br from-white/80 to-white/30',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-500',
    border: 'border-slate-200/50',
    warmAccent: 'text-blue-600',
    heroGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_8px_30px_rgba(59,130,246,0.2)]',
    glow: '',
    headerBg: 'bg-white/50 backdrop-blur-2xl border-b border-white/60 shadow-[0_1px_0_rgba(255,255,255,0.5)_inset]',
    neoBorder: 'border border-white/60',
  },
  dark: {
    bg: 'bg-[#000000]',
    sidebar: 'bg-[#0d0d0d]/70 backdrop-blur-2xl border-r border-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]',
    sidebarText: 'text-slate-400',
    sidebarActive: 'bg-white/[0.08] text-blue-400 shadow-[0_0_20px_rgba(56,189,248,0.12)] border border-white/[0.08]',
    card: 'bg-[#0d0d0d]/60 backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.04)_inset]',
    cardInner: 'bg-gradient-to-br from-white/[0.05] to-transparent',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    border: 'border-white/[0.05]',
    warmAccent: 'text-blue-400',
    heroGradient: 'bg-gradient-to-br from-[#1a1a2e] to-[#0f172a] border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    headerBg: 'bg-[#000000]/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]',
    neoBorder: 'border border-white/[0.08]',
  }
};

const SidebarItem = ({ icon: Icon, label, active, theme, isCollapsed }) => (
  <div className={`flex items-center p-3 mb-2 cursor-pointer transition-all duration-300 rounded-2xl group relative overflow-hidden
    ${active
      ? theme.sidebarActive
      : `${theme.sidebarText} hover:bg-black/5 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white`}`}>

    <div className={`flex items-center justify-center ${active ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'} transition-colors duration-300`}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} className={`${isCollapsed ? 'mx-auto' : 'ml-1'} ${active ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
    </div>

    {!isCollapsed && (
      <span className={`ml-4 text-sm tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
        {label}
      </span>
    )}
  </div>
);

const StatCard = ({ label, value, icon: Icon, colorClass, shadowClass, darkGlow, theme, darkMode, onClick }) => (
  <div onClick={onClick} className={`${theme.card} relative overflow-hidden rounded-[28px] p-6 group hover:scale-[1.02] transition-transform duration-500 ease-out ${onClick ? 'cursor-pointer' : ''}`}>
    <div className={`absolute inset-0 ${theme.cardInner} opacity-50`}></div>

    {/* Subtle animated glass glare */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"></div>

    {/* Dark mode neon backdrop */}
    {darkMode && <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[50px] opacity-20 ${darkGlow} transition-opacity duration-700 group-hover:opacity-40`}></div>}

    <div className="flex justify-between items-start relative z-10">
      <div className="flex flex-col">
        <div className={`p-3 rounded-2xl ${colorClass} ${shadowClass} mb-4 inline-flex w-fit backdrop-blur-md`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        <h3 className={`${theme.textPrimary} text-xl sm:text-3xl font-bold tracking-tight mb-1`}>{value}</h3>
        <p className={`${theme.textSecondary} text-[10px] sm:text-sm font-medium`}>{label}</p>
      </div>

      <button className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${theme.textSecondary}`}>
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

const TimetableContent = ({ currentTheme, darkMode }) => {
  const days = ['MON', 'TUES', 'WEDNES', 'THURS', 'FRI', 'SATUR'];
  const periods = [1, 2, 3, 4, 5, 6, 7];

  const schedule = {
    'MON': {
      1: { subject: 'Placement & Training', staff: '' },
      2: { subject: 'DBMS', staff: 'CS23411' },
      3: { subject: 'SDP', staff: 'CS23414' },
      4: { subject: 'DBMS Lab', staff: 'CS23421' },
      5: { subject: 'DBMS Lab', staff: 'CS23421' },
      6: { subject: 'DAA', staff: 'CS23431' },
      7: { subject: 'TOC', staff: 'CS23413' }
    },
    'TUES': {
      1: { subject: 'SDP', staff: 'CS23414' },
      2: { subject: 'MLT', staff: 'AL23432' },
      3: { subject: 'DAA', staff: 'CS23431' },
      4: { subject: 'MLT LAB', staff: 'AL23432' },
      5: { subject: 'MLT LAB', staff: 'AL23432' },
      6: { subject: 'TOC', staff: 'CS23413' },
      7: { subject: 'OS', staff: 'CS23412' }
    },
    'WEDNES': {
      1: { subject: 'TOC', staff: 'CS23413' },
      2: { subject: 'OS', staff: 'CS23412' },
      3: { subject: 'DAA', staff: 'CS23431' },
      4: { subject: 'DBMS', staff: 'CS23411' },
      5: { subject: 'SDP', staff: 'CS23414' },
      6: { subject: 'DAA LAB', staff: 'CS23431' },
      7: { subject: 'DAA LAB', staff: 'CS23431' }
    },
    'THURS': {
      1: { subject: 'MLT', staff: 'AL23432' },
      2: { subject: 'OS', staff: 'CS23412' },
      3: { subject: 'TOC', staff: 'CS23413' },
      4: { subject: 'DBMS', staff: 'CS23411' },
      5: { subject: 'MENTORING', staff: '' },
      6: { subject: 'OS LAB', staff: 'CS23422' },
      7: { subject: 'OS LAB', staff: 'CS23422' }
    },
    'FRI': {
      1: { subject: 'OS', staff: 'CS23412' },
      2: { subject: 'SDP', staff: 'CS23414' },
      3: { subject: 'DAA', staff: 'CS23431' },
      4: { subject: 'MLT', staff: 'AL23432' },
      5: { subject: 'TOC', staff: 'CS23413' },
      6: { subject: 'MLT', staff: 'AL23432' },
      7: { subject: 'DBMS', staff: 'CS23411' }
    },
    'SATUR': {}
  };

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-[1600px] mx-auto w-full animate-fade-in">
      <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-2 sm:p-5 md:p-8 relative overflow-hidden`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>

        <div className="relative z-10 w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
            <h3 className={`${currentTheme.textPrimary} font-bold text-xl md:text-2xl tracking-tight`}>
              Weekly Timetable
            </h3>
            <div className="flex gap-2">
              <button className={`px-4 py-2 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}>
                Export PDF
              </button>
            </div>
          </div>

          <div className={`min-w-[1200px] grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-px bg-slate-200 dark:bg-white/[0.05] rounded-[24px] overflow-hidden ${currentTheme.neoBorder} p-px shadow-inner`}>
            <div className={`p-4 text-center font-extrabold text-xs uppercase tracking-widest ${currentTheme.bg} ${currentTheme.textSecondary} flex items-center justify-center`}>
              DAY
            </div>
            {periods.map(period => (
              <div key={period} className={`p-4 text-center font-extrabold text-xs uppercase tracking-widest ${currentTheme.bg} ${currentTheme.textSecondary}`}>
                PERIOD {period}
              </div>
            ))}

            {days.map(day => (
              <React.Fragment key={day}>
                <div className={`p-2 font-bold text-xs lg:text-sm text-center ${currentTheme.bg} ${currentTheme.textPrimary} flex items-center justify-center border-t border-slate-200/50 dark:border-white/[0.05]`}>
                  {day}
                </div>
                {periods.map(period => {
                  const cell = schedule[day]?.[period];
                  return (
                    <div key={`${day}-${period}`} className={`p-2 md:p-3 min-h-[160px] flex flex-col gap-2 justify-start items-center text-center bg-white/60 dark:bg-[#000000]/40 backdrop-blur-3xl transition-all hover:bg-white/80 dark:hover:bg-white/[0.08] relative group overflow-hidden border-t border-slate-200/50 dark:border-white/[0.05]`}>
                      {cell ? (
                        <div className={`w-full h-full p-2.5 rounded-xl bg-blue-50/60 dark:bg-[#111111]/80 !border-[1px] !border-solid !border-black/5 dark:border-white/[0.05] ${currentTheme.textPrimary} flex flex-col items-center justify-center shadow-sm`}>
                          <span className="text-[8px] sm:text-[9px] font-bold uppercase opacity-70 mb-0.5 tracking-wider">Subject</span>
                          <span className={`text-[10px] lg:text-xs font-bold text-blue-600 dark:text-blue-400 ${cell.staff ? 'mb-2' : 'mb-0'} leading-snug break-words hyphens-auto text-center`}>
                            {cell.subject}
                          </span>
                          {cell.staff && (
                            <>
                              <span className="text-[8px] sm:text-[9px] font-bold uppercase opacity-70 mb-0.5 tracking-wider mt-1">Code</span>
                              <span className="text-[9px] lg:text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                                {cell.staff}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className={`w-full h-full rounded-2xl bg-transparent`}></div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaveODContent = ({ currentTheme, darkMode }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") {
        if (file.size <= 2 * 1024 * 1024) {
          setSelectedFile(file);
          setErrorMsg('');
        } else {
          setErrorMsg('File size must be less than 2MB.');
          setSelectedFile(null);
        }
      } else {
        setErrorMsg('Please upload only JPG or PNG formats.');
        setSelectedFile(null);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    setErrorMsg('');
  };

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-[1000px] mx-auto w-full animate-fade-in">
      <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-6 md:p-10 relative overflow-hidden`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>

        <div className="relative z-10 w-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className={`${currentTheme.textPrimary} font-bold text-2xl md:text-3xl tracking-tight`}>
              Leave / OD Request
            </h3>
            <div className={`p-2.5 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} inline-flex shadow-sm`}>
              <ClipboardList size={20} className={currentTheme.textPrimary} />
            </div>
          </div>

          <form className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leave Type */}
              <div className="flex flex-col gap-2">
                <label className={`${currentTheme.textSecondary} text-xs font-bold uppercase tracking-wider pl-1`}>Leave Type</label>
                <div className="relative">
                  <select defaultValue="" className={`w-full appearance-none ${currentTheme.bg} ${currentTheme.textPrimary} ${currentTheme.neoBorder} rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm cursor-pointer`}>
                    <option value="" disabled>Select Leave Type</option>
                    <option value="od">On Duty (OD)</option>
                    <option value="medical">Medical Leave</option>
                    <option value="casual">Casual Leave</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} pointer-events-none`} size={16} />
                </div>
              </div>

              {/* From Date */}
              <div className="flex flex-col gap-2">
                <label className={`${currentTheme.textSecondary} text-xs font-bold uppercase tracking-wider pl-1`}>From Date</label>
                <input type="date" className={`w-full ${currentTheme.bg} ${currentTheme.textPrimary} ${currentTheme.neoBorder} rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm`} />
              </div>

              {/* To Date */}
              <div className="flex flex-col gap-2">
                <label className={`${currentTheme.textSecondary} text-xs font-bold uppercase tracking-wider pl-1`}>To Date</label>
                <input type="date" className={`w-full ${currentTheme.bg} ${currentTheme.textPrimary} ${currentTheme.neoBorder} rounded-2xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm`} />
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-2">
                <label className={`${currentTheme.textSecondary} text-xs font-bold uppercase tracking-wider pl-1`}>Reason</label>
                <input type="text" placeholder="Enter Reason" className={`w-full ${currentTheme.bg} ${currentTheme.textPrimary} ${currentTheme.neoBorder} rounded-2xl py-3.5 px-4 text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm`} />
              </div>
            </div>

            {/* Documents */}
            <div className="flex flex-col gap-2 mt-2">
              <label className={`${currentTheme.textSecondary} text-xs font-bold uppercase tracking-wider pl-1`}>Documents</label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col md:flex-row items-center justify-between gap-4 w-full ${currentTheme.bg} border-2 ${isDragging ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' : 'border-dashed border-slate-300 dark:border-white/10'} rounded-2xl p-4 transition-all hover:bg-black/5 dark:hover:bg-white/5 group`}
              >
                {!selectedFile && (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title=""
                  />
                )}

                {selectedFile ? (
                  <div className="flex items-center justify-between w-full h-full relative z-20">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner`}>
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`${currentTheme.textPrimary} text-sm font-semibold truncate max-w-[200px] md:max-w-xs`}>
                          {selectedFile.name}
                        </p>
                        <p className={`${currentTheme.textSecondary} text-xs font-medium mt-0.5`}>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 w-full pointer-events-none">
                    <div className={`w-12 h-12 rounded-full ${isDragging ? 'bg-blue-500/10 text-blue-500' : `${currentTheme.card} ${currentTheme.textSecondary}`} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <svg className={`w-5 h-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`${isDragging ? 'text-blue-500' : currentTheme.textPrimary} text-sm font-semibold transition-colors`}>
                        {isDragging ? 'Drop image here' : <>Choose File <span className="font-normal text-slate-500">or drop it here</span></>}
                      </p>
                      <p className={`${errorMsg ? 'text-red-500 font-semibold' : 'text-blue-500 dark:text-blue-400 font-medium'} text-xs mt-0.5 transition-colors`}>
                        {errorMsg || 'file should be in 2MB. PNG, JPG, JPEG Formats Only'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button type="button" className={`px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-[#111]`}>
                Request
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Small History Section to make the UI look more complete */}
      <div className={`mt-8 ${currentTheme.card} rounded-[24px] p-6 md:p-8 relative overflow-hidden`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h4 className={`${currentTheme.textPrimary} font-bold text-lg tracking-tight`}>Recent Leaves</h4>
          </div>

          <div className="space-y-3">
            <div className={`flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] ${currentTheme.neoBorder} hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h5 className={`${currentTheme.textPrimary} text-sm font-bold`}>Sick Leave</h5>
                  <p className={`${currentTheme.textSecondary} text-xs mt-0.5 font-medium`}>Oct 12 - Oct 14</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">Pending</span>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] ${currentTheme.neoBorder} hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h5 className={`${currentTheme.textPrimary} text-sm font-bold`}>On Duty (Symposium)</h5>
                  <p className={`${currentTheme.textSecondary} text-xs mt-0.5 font-medium`}>Sep 05</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Approved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceContent = ({ currentTheme, darkMode }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const attendanceData = [
    { id: 1, ccode: 'CS23411', cname: 'Database Management Systems', fname: 'PANDIARAJAN T.', attended: 26, total: 29, percentage: 89.66 },
    { id: 2, ccode: 'CS23413', cname: 'Theory of Computation', fname: 'ANGALAPARAMESWARI ANBAZHAGAN', attended: 30, total: 35, percentage: 85.71 },
    { id: 3, ccode: 'CS23414', cname: 'Software Development Practices', fname: 'SRINIVASAN M.L.', attended: 17, total: 19, percentage: 89.47 },
    { id: 4, ccode: 'CS23431', cname: 'Design and Analysis of Algorithms', fname: 'MURUGAN P', attended: 30, total: 33, percentage: 90.91 },
    { id: 5, ccode: 'AL23432', cname: 'Machine Learning Techniques', fname: 'ARAVINDH S', attended: 36, total: 43, percentage: 83.72 },
    { id: 6, ccode: 'CS23421', cname: 'Database Management Systems Laboratory', fname: 'PANDIARAJAN T.', attended: 13, total: 13, percentage: 100.00 },
    { id: 7, ccode: 'CS23IC2', cname: 'Visualization Tools', fname: 'ARAVINDH S', attended: 16, total: 16, percentage: 100.00 },
    { id: 8, ccode: 'CS23415', cname: 'Operating Systems', fname: 'SOWMYA S', attended: 14, total: 18, percentage: 70.33 },
    { id: 9, ccode: 'CS23423', cname: 'Operating Systems Laboratory', fname: 'SOWMYA S', attended: 5, total: 6, percentage: 83.33 },
  ];

  const handleSelectAll = () => setSelectedRows(attendanceData.map(d => d.id));
  const handleDeselectAll = () => setSelectedRows([]);

  const handleCheckboxChange = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const getExportData = () => {
    return selectedRows.length > 0
      ? attendanceData.filter(d => selectedRows.includes(d.id))
      : attendanceData;
  };

  const handleCopy = () => {
    const data = getExportData();
    const text = data.map(row => `${row.id}\t${row.ccode}\t${row.cname}\t${row.fname}\t${row.attended}\t${row.total}\t${row.percentage.toFixed(2)}%`).join('\n');
    navigator.clipboard.writeText("Sl/No\tSubject Code\tSubject Name\tFaculty Name\tPeriods Attended\tTotal Periods\tPercentage\n" + text)
      .then(() => alert("Data copied to clipboard!"));
  };

  const handleCSV = () => {
    const data = getExportData();
    let csvStr = "Sl/No,Subject Code,Subject Name,Faculty Name,Periods Attended,Total Periods,Percentage\n";
    data.forEach(row => {
      csvStr += `${row.id},${row.ccode},"${row.cname}","${row.fname}",${row.attended},${row.total},${row.percentage.toFixed(2)}%\n`;
    });
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Attendance_Report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExcel = () => {
    const data = getExportData();
    let tableStr = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8" /></head><body><table><tr><th>Sl/No</th><th>Subject Code</th><th>Subject Name</th><th>Faculty Name</th><th>Periods Attended</th><th>Total Periods</th><th>Percentage</th></tr>`;
    data.forEach(row => {
      tableStr += `<tr><td>${row.id}</td><td>${row.ccode}</td><td>${row.cname}</td><td>${row.fname}</td><td>${row.attended}</td><td>${row.total}</td><td>${row.percentage.toFixed(2)}%</td></tr>`;
    });
    tableStr += "</table></body></html>";
    const blob = new Blob([tableStr], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Attendance_Report.xls';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = (isPDF) => {
    const data = getExportData();
    let html = `<html><head><title>Attendance Report</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
      </head><body>
      <h2>Attendance Report (2025-2026, Sem IV)</h2>
      <table><tr><th>Sl/No</th><th>Subject Code</th><th>Subject Name</th><th>Faculty Name</th><th>Periods Attended</th><th>Total Periods</th><th>Percentage</th></tr>`;
    data.forEach(row => {
      html += `<tr><td>${row.id}</td><td>${row.ccode}</td><td>${row.cname}</td><td>${row.fname}</td><td>${row.attended}</td><td>${row.total}</td><td>${row.percentage.toFixed(2)}%</td></tr>`;
    });
    html += "</table></body></html>";
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        if (!isPDF) printWindow.close();
      }, 250);
    } else {
      alert("Please allow popups to print/export PDF");
    }
  };

  const getActionForButton = (btn) => {
    if (btn === 'Copy') return handleCopy;
    if (btn === 'CSV') return handleCSV;
    if (btn === 'Excel') return handleExcel;
    if (btn === 'PDF') return () => handlePrintPDF(true);
    if (btn === 'Print') return () => handlePrintPDF(false);
    return () => { };
  };

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-[1400px] mx-auto w-full animate-fade-in relative z-10">

      {/* Top Banner / Hero like summary for Attendance */}
      <div className={`mb-8 ${currentTheme.card} rounded-[24px] md:rounded-[32px] p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
        <div className="relative z-10">
          <h2 className={`${currentTheme.textPrimary} font-bold text-2xl md:text-3xl tracking-tight mb-1`}>
            Attendance Report
          </h2>
          <p className={`${currentTheme.textSecondary} text-sm font-medium flex items-center gap-4`}>
            <span>Academic Year : <strong className={currentTheme.textPrimary}>2025-2026</strong></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Semester : <strong className={currentTheme.textPrimary}>IV</strong></span>
          </p>
        </div>

        <div className="relative z-10 flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button onClick={handleSelectAll} className={`px-4 py-2 rounded-xl backdrop-blur-md bg-blue-600 text-white text-sm font-semibold shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-colors whitespace-nowrap`}>
            Select all
          </button>
          <button onClick={handleDeselectAll} className={`px-4 py-2 rounded-xl backdrop-blur-md bg-blue-400/20 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-400/30 transition-colors whitespace-nowrap`}>
            Deselect all
          </button>
          <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-1 my-auto"></div>
          {['Copy', 'CSV', 'Excel', 'PDF', 'Print'].map(btn => (
            <button key={btn} onClick={getActionForButton(btn)} className={`px-3 py-2 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors whitespace-nowrap`}>
              {btn}
            </button>
          ))}
        </div>
      </div>

      <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-2 sm:p-5 md:p-8 relative overflow-hidden`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>

        <div className="relative z-10 w-full">

          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-2 gap-4">
            <div className={`flex items-center gap-2 ${currentTheme.textSecondary} text-sm font-medium`}>
              Show
              <select className={`appearance-none bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} rounded-lg py-1 px-3 ${currentTheme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer shadow-sm`}>
                <option>9</option>
              </select>
              entries
            </div>

            <div className="relative group w-full sm:w-64">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} w-4 h-4 transition-colors group-focus-within:text-blue-500`} />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} rounded-xl py-2 pl-9 pr-4 text-sm ${currentTheme.textPrimary} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm`}
              />
            </div>
          </div>

          {/* Table Wrapper */}
          <div className={`w-full overflow-x-auto pb-4 rounded-[16px] !border-[1px] !border-solid !border-black/5 dark:border-white/[0.05]`}>
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className={`bg-black/[0.03] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/[0.05]`}>
                  <th className="p-4 w-12 text-center">
                  </th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap cursor-pointer hover:text-blue-500 transition-colors`}>Sl/No <span className="ml-1 opacity-50">↕</span></th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap cursor-pointer hover:text-blue-500 transition-colors`}>Subject Code <span className="ml-1 opacity-50">↕</span></th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap cursor-pointer hover:text-blue-500 transition-colors`}>Subject Name <span className="ml-1 opacity-50">↕</span></th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap cursor-pointer hover:text-blue-500 transition-colors`}>Faculty Name <span className="ml-1 opacity-50">↕</span></th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap text-center cursor-pointer hover:text-blue-500 transition-colors`}>Periods Attended <span className="ml-1 opacity-50">↕</span></th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap text-center cursor-pointer hover:text-blue-500 transition-colors`}>Total Periods <span className="ml-1 opacity-50">↕</span></th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap text-center cursor-pointer hover:text-blue-500 transition-colors`}>Percentage <span className="ml-1 opacity-50">↕</span></th>
                  <th className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap text-center`}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/[0.05]">
                {attendanceData.map((row) => (
                  <tr key={row.id} className={`transition-colors group ${row.percentage < 75 ? 'bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 dark:hover:bg-red-500/30 border border-red-500/30' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'}`}>
                    <td className="p-4 text-center">
                      <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} className="w-4 h-4 rounded appearance-none border border-slate-300 dark:border-slate-500 checked:bg-blue-500 checked:border-transparent transition-all cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-1.5 after:top-0.5 after:w-1 after:h-2.5 after:border-white after:border-b-2 after:border-r-2 after:rotate-45" />
                    </td>
                    <td className={`p-4 text-sm font-semibold ${row.percentage < 75 ? 'text-red-600 dark:text-red-400' : currentTheme.textPrimary}`}>{row.id}</td>
                    <td className={`p-4 text-sm font-bold ${row.percentage < 75 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} whitespace-nowrap`}>{row.ccode}</td>
                    <td className={`p-4 text-sm font-semibold ${row.percentage < 75 ? 'text-red-600 dark:text-red-400' : currentTheme.textPrimary} max-w-[200px] sm:max-w-xs truncate`} title={row.cname}>
                      {row.cname}
                      {row.percentage < 75 && (
                        <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                          Caution
                        </span>
                      )}
                    </td>
                    <td className={`p-4 text-xs font-bold ${row.percentage < 75 ? 'text-red-500 dark:text-red-400' : currentTheme.textSecondary} uppercase tracking-wide`}>{row.fname}</td>
                    <td className={`p-4 text-sm font-semibold ${row.percentage < 75 ? 'text-red-600 dark:text-red-400' : currentTheme.textPrimary} text-center`}>{row.attended}</td>
                    <td className={`p-4 text-sm font-semibold ${row.percentage < 75 ? 'text-red-500 dark:text-red-400' : currentTheme.textSecondary} text-center`}>{row.total}</td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className={`text-sm font-bold ${row.percentage < 75 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {row.percentage.toFixed(2)}%
                        </span>
                        <div className="w-16 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden hidden xl:block">
                          <div
                            className={`h-full rounded-full ${row.percentage < 75 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}
                            style={{ width: `${row.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button className={`px-3 py-1.5 rounded-lg ${row.percentage < 75 ? 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white'} text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm`}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 px-2">
            <p className={`${currentTheme.textSecondary} text-xs font-medium`}>Showing 1 to 9 of 9 entries</p>
            <div className="flex gap-1">
              <button className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} ${currentTheme.textSecondary} hover:bg-black/5 dark:hover:bg-white/10 transition-colors`} disabled>
                <ChevronRight size={14} className="rotate-180 opacity-50" />
              </button>
              <button className={`w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 text-white font-bold text-xs shadow-md transition-transform hover:scale-105`}>
                1
              </button>
              <button className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} ${currentTheme.textSecondary} hover:bg-black/5 dark:hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed`} disabled>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const CatMarkContent = ({ currentTheme, darkMode }) => {
  const catMarksData = [
    {
      id: 1, ccode: 'AL23432', cname: 'Machine Learning Techniques', fname: 'ARAVINDH S',
      cat1: { co1: 20, co2: 20, total: 40 },
      cat2: { total: '' },
      cat3: { co1: '', co2: '', total: '' },
      internal: '6.4/8'
    },
    {
      id: 2, ccode: 'CS23415', cname: 'Operating Systems', fname: 'SOWMYA S',
      cat1: { co1: '', co2: '', total: '' },
      cat2: { total: '' },
      cat3: { co1: '', co2: '', total: '' },
      internal: ''
    },
    {
      id: 3, ccode: 'CS23411', cname: 'Database Management Systems', fname: 'PANDIARAJAN T.',
      cat1: { co1: '', co2: '', total: '' },
      cat2: { total: '' },
      cat3: { co1: '', co2: '', total: '' },
      internal: ''
    },
    {
      id: 4, ccode: 'CS23413', cname: 'Theory of Computation', fname: 'ANGALAPARAMESWARI ANBAZHAGAN',
      cat1: { co1: '', co2: '', total: '' },
      cat2: { total: '' },
      cat3: { co1: '', co2: '', total: '' },
      internal: ''
    },
    {
      id: 5, ccode: 'CS23414', cname: 'Software Development Practices', fname: 'SRINIVASAN M.L.',
      cat1: { co1: '', co2: '', total: '' },
      cat2: { total: '' },
      cat3: { co1: '', co2: '', total: '' },
      internal: ''
    },
    {
      id: 6, ccode: 'CS23431', cname: 'Design and Analysis of Algorithms', fname: 'MURUGAN P',
      cat1: { co1: '', co2: '', total: '' },
      cat2: { total: '' },
      cat3: { co1: '', co2: '', total: '' },
      internal: ''
    }
  ];

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-[1400px] mx-auto w-full animate-fade-in relative z-10">
      <div className={`mb-8 ${currentTheme.card} rounded-[24px] md:rounded-[32px] p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
        <div className="relative z-10">
          <h2 className={`${currentTheme.textPrimary} font-bold text-2xl md:text-3xl tracking-tight mb-1`}>
            CAT Marks
          </h2>
          <p className={`${currentTheme.textSecondary} text-sm font-medium flex items-center gap-4`}>
            <span>Academic Year : <strong className={currentTheme.textPrimary}>2025-2026</strong></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Semester : <strong className={currentTheme.textPrimary}>IV</strong></span>
          </p>
        </div>
      </div>

      <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-2 sm:p-5 md:p-8 relative overflow-hidden shadow-sm`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>

        <div className="relative z-10 w-full">
          <div className={`w-full overflow-x-auto pb-4 rounded-[16px] border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} shadow-sm`}>
            <table className="w-full text-center border-collapse min-w-[1200px]">
              <thead>
                <tr className={`bg-slate-50 dark:bg-white/[0.02]`}>
                  <th rowSpan={2} className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>Subject Code</th>
                  <th rowSpan={2} className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>Subject Name</th>
                  <th rowSpan={2} className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>Faculty Name</th>
                  <th colSpan={3} className={`p-4 text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-500/10 border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} shadow-[inset_0_0_20px_rgba(59,130,246,0.15)] dark:shadow-none`}>CAT - 1</th>
                  <th colSpan={1} className={`p-4 text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 bg-purple-100/50 dark:bg-purple-500/10 border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} shadow-[inset_0_0_20px_rgba(168,85,247,0.15)] dark:shadow-none`}>CAT - 2</th>
                  <th colSpan={3} className={`p-4 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-500/10 border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} shadow-[inset_0_0_20px_rgba(16,185,129,0.15)] dark:shadow-none`}>CAT - 3</th>
                  <th rowSpan={2} className={`p-4 text-xs font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>Internal Weightage</th>
                </tr>
                <tr className={`bg-slate-50/50 dark:bg-white/[0.01]`}>
                  {/* CAT 1 */}
                  <th className={`p-3 text-[10px] font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>CO-1<br /><span className="lowercase opacity-70 border-t ${darkMode ? 'border-blue-500/20' : 'border-black'} pt-1 mt-1 inline-block w-full">(25 Marks)</span></th>
                  <th className={`p-3 text-[10px] font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>CO-2<br /><span className="lowercase opacity-70 border-t ${darkMode ? 'border-blue-500/20' : 'border-black'} pt-1 mt-1 inline-block w-full">(25 Marks)</span></th>
                  <th className={`p-3 text-[10px] font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} bg-blue-50/50 dark:bg-blue-500/[0.02]`}>Total<br /><span className="lowercase opacity-70 border-t ${darkMode ? 'border-blue-500/20' : 'border-black'} pt-1 mt-1 inline-block w-full">(50 Marks)</span></th>
                  {/* CAT 2 */}
                  <th className={`p-3 text-[10px] font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} bg-purple-50/50 dark:bg-purple-500/[0.02]`}>Total<br /><span className="lowercase opacity-70 border-t ${darkMode ? 'border-purple-500/20' : 'border-black'} pt-1 mt-1 inline-block w-full">(25 Marks)</span></th>
                  {/* CAT 3 */}
                  <th className={`p-3 text-[10px] font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>CO-1<br /><span className="lowercase opacity-70 border-t ${darkMode ? 'border-emerald-500/20' : 'border-black'} pt-1 mt-1 inline-block w-full">(25 Marks)</span></th>
                  <th className={`p-3 text-[10px] font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>CO-2<br /><span className="lowercase opacity-70 border-t ${darkMode ? 'border-emerald-500/20' : 'border-black'} pt-1 mt-1 inline-block w-full">(25 Marks)</span></th>
                  <th className={`p-3 text-[10px] font-bold uppercase tracking-wider ${currentTheme.textSecondary} whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} bg-emerald-50/50 dark:bg-emerald-500/[0.02]`}>Total<br /><span className="lowercase opacity-70 border-t ${darkMode ? 'border-emerald-500/20' : 'border-black'} pt-1 mt-1 inline-block w-full">(50 Marks)</span></th>
                </tr>
              </thead>
              <tbody>
                {catMarksData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className={`p-4 text-sm font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>{row.ccode}</td>
                    <td className={`p-4 text-sm font-semibold ${currentTheme.textPrimary} text-left border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>{row.cname}</td>
                    <td className={`p-4 text-xs font-bold ${currentTheme.textSecondary} uppercase tracking-wide text-left border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} whitespace-nowrap`}>{row.fname}</td>
                    {/* CAT 1 */}
                    <td className={`p-4 text-sm font-semibold ${currentTheme.textPrimary} border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>{row.cat1.co1}</td>
                    <td className={`p-4 text-sm font-semibold ${currentTheme.textPrimary} border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>{row.cat1.co2}</td>
                    <td className={`p-4 text-sm font-bold text-blue-700 dark:text-blue-300 border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} bg-blue-50/30 dark:bg-white/[0.01]`}>{row.cat1.total}</td>
                    {/* CAT 2 */}
                    <td className={`p-4 text-sm font-bold text-purple-700 dark:text-purple-300 border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} bg-purple-50/30 dark:bg-white/[0.01]`}>{row.cat2.total}</td>
                    {/* CAT 3 */}
                    <td className={`p-4 text-sm font-semibold ${currentTheme.textPrimary} border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>{row.cat3.co1}</td>
                    <td className={`p-4 text-sm font-semibold ${currentTheme.textPrimary} border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>{row.cat3.co2}</td>
                    <td className={`p-4 text-sm font-bold text-emerald-700 dark:text-emerald-300 border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'} bg-emerald-50/30 dark:bg-white/[0.01]`}>{row.cat3.total}</td>
                    {/* Internal */}
                    <td className={`p-4 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10 border-[1px] border-solid ${darkMode ? 'border-white/[0.05]' : 'border-black'}`}>{row.internal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AcademicFeeContent = ({ currentTheme, darkMode }) => {
  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-[1400px] mx-auto w-full animate-fade-in relative z-10">

      {/* Header section with buttons */}
      <div className={`mb-8 ${currentTheme.card} rounded-[24px] md:rounded-[32px] p-6 relative overflow-hidden flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shadow-sm`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between md:items-center gap-6">
          <h2 className={`${currentTheme.textPrimary} font-bold text-2xl md:text-3xl tracking-tight`}>
            Academic Fee
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className={`px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold tracking-wide shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}>
              Pay Fee
            </button>
            <button className={`px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold tracking-wide shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}>
              Payment History
            </button>
            <button className={`px-6 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-sm font-bold tracking-wide shadow-[0_4px_15px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)] hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500`}>
              Consolidated Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Student Details and Fee Details wrapper */}
      <div className="space-y-6">
        {/* Student Details */}
        <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-6 lg:p-8 relative overflow-hidden shadow-sm`}>
          <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`${currentTheme.textPrimary} font-bold text-xl tracking-tight`}>
                Student Details
              </h3>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border-[1px] border-solid border-black/5 dark:border-white/5`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className={`${currentTheme.textSecondary} text-sm font-bold w-32 shrink-0 block`}>Course</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-semibold block`}>: B.E. CSE</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className={`${currentTheme.textSecondary} text-sm font-bold w-32 shrink-0 block`}>Admitted Mode</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-semibold block uppercase`}>: Management Quota</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Details */}
        <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-6 lg:p-8 relative overflow-hidden shadow-sm`}>
          <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`${currentTheme.textPrimary} font-bold text-xl tracking-tight`}>
                Fee Details
              </h3>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border-[1px] border-solid border-black/5 dark:border-white/5`}>
              {/* Row 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Current AY</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 2025-2026</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Opening Balance</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 0</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Tuition Fee</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 87000</span>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Hostel Fee</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 0</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Other Fee</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 138000</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>AU / Library Fee</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 2925</span>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Fine & Breakage</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 0</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Total Fee</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 227925</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Paid Amount</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 227925</span>
              </div>

              {/* Row 4 */}
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Reversal Amount</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 0</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Balance Amount</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 0</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4 border-b border-black/5 dark:border-white/5 pb-4 md:border-none md:pb-0">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Wallet Balance</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 0</span>
              </div>

              {/* Row 5 */}
              <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center gap-1 sm:gap-4">
                <span className={`${currentTheme.textSecondary} text-sm font-bold min-w-[140px]`}>Last Updated On</span>
                <span className={`${currentTheme.textPrimary} text-sm sm:text-base font-bold`}>: 2025-11-07</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const SWOT_API_BASE = 'http://127.0.0.1:5001';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const SwotAnalysisContent = ({ currentTheme, darkMode, studentEmail }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = studentEmail || 'aarav.sharma@example.com';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${SWOT_API_BASE}/api/swot/result?email=${encodeURIComponent(email)}`);
        if (!res.ok) {
          if (res.status === 404) setError('No analysis run yet. Ask admin to run SWOT analysis.');
          else setError('Could not load your SWOT result.');
          setData(null);
          return;
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError('Cannot reach analysis server. Run: cd ml-api && python api_server.py');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [email]);

  const glassCard = `bg-white/40 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.4)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6`;
  const gradeColor = (g) => g === 'A' ? 'text-emerald-500' : g === 'B' ? 'text-blue-500' : g === 'C' ? 'text-amber-500' : g === 'D' ? 'text-orange-500' : 'text-red-500';
  const gradeBg = (g) => g === 'A' ? 'bg-emerald-500/20' : g === 'B' ? 'bg-blue-500/20' : g === 'C' ? 'bg-amber-500/20' : g === 'D' ? 'bg-orange-500/20' : 'bg-red-500/20';

  if (loading) {
    return (
      <div className="p-4 md:p-10 md:pt-4 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[400px]">
        <div className={`${glassCard} flex items-center gap-4 ${currentTheme.textPrimary}`}>
          <Activity size={32} className="animate-pulse text-blue-500" />
          <span>Loading your SWOT analysis...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 md:p-10 md:pt-4 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[400px]">
        <div className={`${glassCard} max-w-md text-center ${currentTheme.textPrimary}`}>
          <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
          <p className={currentTheme.textSecondary}>{error || 'No data'}</p>
        </div>
      </div>
    );
  }

  const gradeDist = data.gradeDistribution || {};
  const gradePieData = Object.entries(gradeDist).map(([name, value]) => ({ name, value }));
  const avgCourse = (data.avgMarksPerCourse || []).slice(0, 8);

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-7xl mx-auto w-full animate-fade-in space-y-8">
      <div className="flex items-center gap-3">
        <span className="w-1 h-8 rounded-full bg-blue-500" />
        <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>My SWOT Analysis</h1>
        {data.overallGrade && <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${gradeBg(data.overallGrade)} ${gradeColor(data.overallGrade)}`}>{data.overallGrade}</span>}
        {data.avgMark && <span className={`${currentTheme.textSecondary} text-sm font-medium`}>Avg: {data.avgMark}</span>}
      </div>
      <p className={`${currentTheme.textSecondary} text-sm`}>Performance strengths, weaknesses, and AI-backed recommendations.</p>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`${glassCard} relative overflow-hidden`}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"><TrendingUp size={22} /></div>
            <h3 className={`${currentTheme.textPrimary} font-bold text-lg`}>Strengths</h3>
          </div>
          <ul className="space-y-2">
            {(data.strengths && data.strengths.length) ? data.strengths.map((s, i) => (
              <li key={i} className={`flex items-center gap-2 ${currentTheme.textPrimary} text-sm`}><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" /><span>{s}</span></li>
            )) : <li className={`${currentTheme.textSecondary} text-sm`}>No specific strengths identified yet.</li>}
          </ul>
        </div>
        <div className={`${glassCard} relative overflow-hidden`}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400"><Target size={22} /></div>
            <h3 className={`${currentTheme.textPrimary} font-bold text-lg`}>Areas to Improve</h3>
          </div>
          <ul className="space-y-2">
            {(data.weaknesses && data.weaknesses.length) ? data.weaknesses.map((w, i) => (
              <li key={i} className={`flex items-center gap-2 ${currentTheme.textPrimary} text-sm`}><AlertTriangle size={16} className="text-amber-500 flex-shrink-0" /><span>{w}</span></li>
            )) : <li className={`${currentTheme.textSecondary} text-sm`}>No weaknesses identified.</li>}
          </ul>
        </div>
      </div>

      {/* Course-wise performance table */}
      {data.courses && data.courses.length > 0 && (
        <div className={`${glassCard}`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>My Course-wise Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className={`border-b ${currentTheme.border}`}>
                <th className={`p-3 text-left text-xs font-bold uppercase ${currentTheme.textSecondary}`}>Course</th>
                <th className={`p-3 text-center text-xs font-bold uppercase ${currentTheme.textSecondary}`}>Mark</th>
                <th className={`p-3 text-center text-xs font-bold uppercase ${currentTheme.textSecondary}`}>Grade</th>
              </tr></thead>
              <tbody>
                {data.courses.map((c, i) => (
                  <tr key={i} className={`border-b ${currentTheme.border} last:border-0`}>
                    <td className={`p-3 ${currentTheme.textPrimary} font-medium`}>{c.courseName}</td>
                    <td className="p-3 text-center"><span className={`font-bold ${c.mark >= 60 ? 'text-emerald-500' : c.mark >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{c.mark}</span></td>
                    <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeBg(c.grade)} ${gradeColor(c.grade)}`}>{c.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {(data.recommendations && data.recommendations.length) > 0 && (
        <div className={`${glassCard}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400"><BookMarked size={22} /></div>
            <h3 className={`${currentTheme.textPrimary} font-bold text-lg`}>Recommended Courses</h3>
          </div>
          <div className="space-y-3">
            {data.recommendations.map((r, i) => (
              <div key={i} className={`flex flex-wrap items-center gap-2 p-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
                <span className={`${currentTheme.textSecondary} text-sm`}>Because of low performance in</span>
                <span className={`font-semibold ${currentTheme.textPrimary}`}>{r.weakCourse}</span>
                <span className={currentTheme.textSecondary}>→</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{r.recommendedCourse}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`${glassCard}`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>Grade Distribution</h3>
          {gradePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={gradePieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                  {gradePieData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (<p className={`${currentTheme.textSecondary} text-sm py-8 text-center`}>No grade data</p>)}
        </div>
        <div className={`${glassCard}`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>Average Marks by Course</h3>
          {avgCourse.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={avgCourse} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                <XAxis dataKey="course" tick={{ fontSize: 10 }} tickFormatter={(v) => v.length > 12 ? v.slice(0, 12) + '…' : v} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)' }} formatter={(v) => [v, 'Avg']} />
                <Bar dataKey="avgMark" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Avg Mark" />
              </BarChart>
            </ResponsiveContainer>
          ) : (<p className={`${currentTheme.textSecondary} text-sm py-8 text-center`}>No course data</p>)}
        </div>
      </div>
    </div>
  );
};

const ALLOWED_EMAIL_DOMAIN = 'ritchennai.edu.in';

const SignInPage = ({ onSignIn }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [adminLoginMode, setAdminLoginMode] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onSignIn({ isAdmin: true });
    } else if (userId === '2117240020033' && password === '0123456789') {
      onSignIn({ isAdmin: false, email: STUDENT_EMAIL_BY_ROLL[userId] || null });
    } else {
      setError('Invalid User ID or Password');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { user } = await signInWithGoogle();
      const email = user?.email || '';
      if (!isAllowedEmail(email)) {
        await signOutFirebase();
        setError(`Only @${ALLOWED_EMAIL_DOMAIN} accounts are allowed. Please sign in with your RIT Chennai email.`);
        return;
      }
      onSignIn({ isAdmin: false, email });
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('');
      } else {
        setError(err?.message || 'Google sign-in failed. Try again or use User ID / Password.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-slate-900 bg-slate-100/80 dark:bg-[#0a0a0a]">
      {/* Glassmorphism background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 dark:bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 dark:bg-indigo-500/10 blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-white/5 dark:bg-white/[0.02] blur-3xl"></div>
      </div>
      {/* Glassmorphism card */}
      <div className="max-w-md w-full relative z-10 animate-fade-in
        bg-white/40 dark:bg-white/[0.06] backdrop-blur-2xl
        border border-white/60 dark:border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]
        dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)_inset]
        rounded-[32px] p-8 md:p-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/10 dark:from-white/[0.08] dark:to-transparent opacity-90" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent" />
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_8px_24px_rgba(59,130,246,0.35)] border border-white/20">
              <svg viewBox="0 0 100 100" className="w-8 h-8 fill-white drop-shadow-md">
                <path d="M25 25 L75 25 L75 75 L25 75 Z" stroke="white" strokeWidth="8" fill="none" rx="10" />
                <text x="50" y="66" textAnchor="middle" fontSize="42" fill="white" fontWeight="800" fontFamily="sans-serif">R</text>
              </svg>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
              {adminLoginMode ? 'Sign in with your admin credentials' : 'Sign in to RIT IMS — students or admin'}
            </p>
          </div>

          {/* Google Sign-In — only @ritchennai.edu.in */}
          {isFirebaseConfigured() && (
            <>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full py-3.5 rounded-2xl bg-white dark:bg-white/10 border-2 border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/30 text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {googleLoading ? 'Signing in…' : 'Sign in with Google'}
                </button>
                <p className="text-slate-500 dark:text-slate-400 text-xs text-center mt-2">Only @{ALLOWED_EMAIL_DOMAIN} accounts</p>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/30 dark:border-white/10" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white/40 dark:bg-white/[0.06] px-3 text-slate-500 dark:text-slate-400">or continue with</span></div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setError(''); }}
                placeholder="Enter your User ID"
                className="w-full bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-2xl py-4 px-5 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="w-full bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-2xl py-4 px-5 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all shadow-sm"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-semibold text-center animate-fade-in">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 border border-white/20"
            >
              Sign In
            </button>

            <div className="pt-4 border-t border-white/30 dark:border-white/10">
              <button
                type="button"
                onClick={() => { setAdminLoginMode(!adminLoginMode); setError(''); }}
                className="w-full py-3 rounded-2xl bg-white/50 dark:bg-white/[0.06] hover:bg-white/70 dark:hover:bg-white/10 border border-white/50 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck size={18} />
                {adminLoginMode ? 'Back to student login' : 'Admin page login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// RIT Digital Twin | Smart Campus - Admin Panel (reference-based design)
const ADMIN_NAV = [
  { id: 'placements', label: 'Placements', icon: Briefcase },
  { id: 'courseData', label: 'Course Data', icon: BookOpen },
  { id: 'swot', label: 'SWOT Analysis', icon: Activity },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'timetables', label: 'Exam Timetables', icon: Calendar },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'substitutions', label: 'Class Substitutions', icon: Users },
  { id: 'certificate', label: 'Certificate', icon: Award },
  { id: 'classroom', label: 'Classroom Allocation', icon: LayoutGrid },
  { id: 'energy', label: 'Energy Optimization', icon: Zap },
  { id: 'transport', label: 'Transport Analytics', icon: Bus },
  { id: 'directory', label: 'Transport Directory', icon: MapPin },
  { id: 'crowd', label: 'Crowd Flow', icon: Users },
  { id: 'password', label: 'Change Password', icon: KeyRound },
];

const AdminPanel = ({ onLogout, darkMode, onToggleTheme }) => {
  const [activeSection, setActiveSection] = useState('classroom');
  const [navSearch, setNavSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentTheme = darkMode ? themes.dark : themes.light;

  return (
    <div className={`theme-smooth min-h-screen ${currentTheme.bg} font-sans flex`}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[100px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-50/50 blur-[100px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-900/20 blur-[120px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* RIT-style Sidebar - Dark glass */}
      <aside className={`w-64 flex-shrink-0 fixed h-full z-50 flex flex-col transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-slate-900/90' : 'bg-slate-800/95'} backdrop-blur-2xl border-r border-white/10`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-amber-500" />
            </div>
            <span className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-white'}`}>rit</span>
          </div>
          <p className={`text-[10px] uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-300'}`}>Rajalakshmi Institute of Technology</p>
        </div>
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search functionalities..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-white/5 text-slate-200 placeholder:text-slate-500 border border-white/5' : 'bg-white/10 text-white placeholder:text-slate-400 border-white/10'} focus:outline-none focus:ring-1 focus:ring-amber-500/50`}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {ADMIN_NAV.filter(n => !navSearch || n.label.toLowerCase().includes(navSearch.toLowerCase())).map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-left text-sm transition-colors border-l-2 ${isActive ? 'border-l-amber-500' : 'border-l-transparent'} ${isActive
                  ? darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-white/15 text-white'
                  : `${darkMode ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}`}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div onClick={onLogout} className="flex items-center justify-between p-3 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 cursor-pointer transition-colors group">
            <span className="text-sm font-semibold tracking-wide">Logout</span>
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </aside>

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        {/* RIT-style Header */}
        <header className={`sticky top-0 z-40 ${currentTheme.headerBg} backdrop-blur-2xl border-b ${currentTheme.border} px-4 md:px-6 h-16 flex items-center justify-between`}>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"><Menu size={24} className={currentTheme.textPrimary} /></button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-600" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" /></svg>
            </div>
            <span className={`font-bold text-sm tracking-tight ${currentTheme.textPrimary}`}>RAJALAKSHMI INSTITUTE OF TECHNOLOGY</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className={`p-2.5 rounded-lg ${currentTheme.card} ${currentTheme.neoBorder} ${darkMode ? 'text-amber-400' : 'text-slate-600'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className={`p-2.5 rounded-lg ${currentTheme.card} ${currentTheme.neoBorder} ${currentTheme.textPrimary} relative`}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            </button>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.neoBorder}`}>
              <User size={18} className={currentTheme.textSecondary} />
              <span className={`text-xs font-semibold ${currentTheme.textPrimary}`}>ADMIN@RITCHENNAI.EDU.IN</span>
            </div>
            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2">
              <MessageSquare size={16} /> Chat
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <AdminContentSection section={activeSection} currentTheme={currentTheme} darkMode={darkMode} onLogout={onLogout} />
        </main>
      </div>
    </div>
  );
};

// Content sections based on RIT reference images
const AdminContentSection = ({ section, currentTheme, darkMode, onLogout }) => {
  const [swotRunning, setSwotRunning] = useState(false);
  const [swotMessage, setSwotMessage] = useState(null);
  const [swotFile, setSwotFile] = useState(null);
  const [classDashboard, setClassDashboard] = useState(null);
  const [allStudents, setAllStudents] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [studentDetailLoading, setStudentDetailLoading] = useState(false);
  const API_BASE = 'http://127.0.0.1:5001';
  const runSwot = async (forceDemo = false) => {
    setSwotRunning(true);
    setSwotMessage(null);
    setClassDashboard(null);
    setAllStudents(null);
    setSelectedStudent(null);
    setStudentDetail(null);
    try {
      const isEvent = forceDemo && typeof forceDemo === 'object';
      const actuallyForceDemo = isEvent ? false : forceDemo;
      const formData = new FormData();
      const useFile = !actuallyForceDemo && swotFile;
      if (useFile) formData.append('file', swotFile);
      const res = await fetch(`${API_BASE}/api/swot/run`, {
        method: 'POST',
        body: useFile ? formData : JSON.stringify({ useDefault: true }),
        headers: useFile ? {} : { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSwotMessage({ type: 'success', text: `Analysis complete. Results available for ${data.studentCount || 0} students.` });
        // Auto-fetch dashboard and student list
        const [dashRes, studRes] = await Promise.all([
          fetch(`${API_BASE}/api/swot/class-dashboard`).then(r => r.json()).catch(() => null),
          fetch(`${API_BASE}/api/swot/all-students`).then(r => r.json()).catch(() => null),
        ]);
        if (dashRes && !dashRes.error) setClassDashboard(dashRes);
        if (studRes && !studRes.error) setAllStudents(studRes);
      } else {
        setSwotMessage({ type: 'error', text: data.error || 'Run failed' });
      }
    } catch (e) {
      setSwotMessage({ type: 'error', text: 'Cannot reach API. Start the server: cd ml-api && pip install -r requirements.txt && python api_server.py' });
    }
    setSwotRunning(false);
  };

  const viewStudentDetail = async (email) => {
    setSelectedStudent(email);
    setStudentDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/swot/result?email=${encodeURIComponent(email)}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data) setStudentDetail(data);
      else setStudentDetail(null);
    } catch { setStudentDetail(null); }
    setStudentDetailLoading(false);
  };

  if (section === 'password') {
    return (
      <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-8 max-w-md border ${currentTheme.neoBorder}`}>
        <h2 className={`${currentTheme.textPrimary} text-xl font-bold mb-4`}>Change Password</h2>
        <form className="space-y-4">
          <div><label className={`text-xs font-bold uppercase ${currentTheme.textSecondary}`}>Current Password</label><input type="password" className={`w-full mt-1 px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} /></div>
          <div><label className={`text-xs font-bold uppercase ${currentTheme.textSecondary}`}>New Password</label><input type="password" className={`w-full mt-1 px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} /></div>
          <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold">Update Password</button>
        </form>
      </div>
    );
  }

  // Classroom Allocation
  if (section === 'classroom') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-1 h-8 rounded-full bg-amber-500" />
          <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Infrastructure & Classroom Report</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL ROOMS', value: '48', color: 'bg-blue-500', light: 'bg-blue-500/20 text-blue-600 dark:text-blue-400' },
            { label: 'OCCUPIED', value: '36', color: 'bg-emerald-500', light: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', hasCheck: true },
            { label: 'AVAILABLE', value: '12', color: 'bg-amber-500', light: 'bg-amber-500/20 text-amber-600 dark:text-amber-400' },
            { label: 'SMART ROOMS', value: '24', color: 'bg-cyan-600', light: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' },
          ].map((s, i) => (
            <div key={i} className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder} relative overflow-hidden`}>
              {s.hasCheck && <div className="absolute top-2 right-2"><CheckCircle2 size={18} className="text-emerald-500" /></div>}
              <p className={`${currentTheme.textPrimary} text-2xl font-bold`}>{s.value}</p>
              <p className={`${currentTheme.textSecondary} text-xs font-bold uppercase mt-1`}>{s.label}</p>
              <div className={`absolute bottom-0 right-0 w-20 h-20 rounded-tl-full ${s.color} opacity-10`} />
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold text-lg mb-4`}>Allocation Simulation</h3>
            <div className="space-y-4">
              <div><label className={`text-xs font-bold uppercase ${currentTheme.textSecondary}`}>Department</label><select className={`w-full mt-1 px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`}><option>Select Dept...</option></select></div>
              <div><label className={`text-xs font-bold uppercase ${currentTheme.textSecondary}`}>Strength</label><input type="text" defaultValue="60" className={`w-full mt-1 px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> <span className={currentTheme.textPrimary}>Smart Projector</span></label>
            </div>
            <button className="mt-4 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold">Run Algorithm</button>
          </div>
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder} flex flex-col items-center justify-center min-h-[200px]`}>
            <Building2 size={48} className={`${currentTheme.textSecondary} opacity-40 mb-2`} />
            <p className={`${currentTheme.textSecondary} text-sm`}>Run simulation to see recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  // Certificate Queue
  if (section === 'certificate') {
    const certData = [
      { name: 'Aakash S', id: 101, type: 'Bonafide', date: '2026-03-05', att: 88, fees: true, risk: 'LOW' },
      { name: 'Sneha R', id: 102, type: 'Course Completion', date: '2026-03-06', att: 72, fees: true, risk: 'MEDIUM' },
      { name: 'Vikram K', id: 103, type: 'Fee Receipt', date: '2026-03-06', att: 95, fees: false, risk: 'HIGH' },
      { name: 'Priya M', id: 104, type: 'Transfer Cert', date: '2026-03-07', att: 92, fees: true, risk: 'LOW' },
    ];
    return (
      <div className="space-y-6">
        <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Certificate Queue</h1>
        <p className={`${currentTheme.textSecondary} text-sm`}>Batch process document requests with automated compliance checks</p>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold"><Wrench size={18} /> Manual Override</button>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Search student or certificate..." className={`w-full pl-10 pr-4 py-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
          </div>
          <button className={`px-4 py-2.5 rounded-xl ${currentTheme.card} ${currentTheme.neoBorder} flex items-center gap-2 ${currentTheme.textPrimary}`}><Filter size={18} /> Filter</button>
        </div>
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl overflow-hidden border ${currentTheme.neoBorder}`}>
          <table className="w-full text-sm">
            <thead className={`${currentTheme.bg} border-b ${currentTheme.border}`}>
              <tr><th className="p-4 text-left font-bold uppercase text-xs"><input type="checkbox" /></th><th className="p-4 text-left font-bold uppercase text-xs">STUDENT</th><th className="p-4 text-left font-bold uppercase text-xs">REQUEST TYPE</th><th className="p-4 text-left font-bold uppercase text-xs">APPLIED ON</th><th className="p-4 text-left font-bold uppercase text-xs">COMPLIANCE (AI)</th><th className="p-4 text-left font-bold uppercase text-xs">RISK</th><th className="p-4 text-left font-bold uppercase text-xs">ACTION</th></tr>
            </thead>
            <tbody>
              {certData.map((r, i) => (
                <tr key={i} className={`border-b ${currentTheme.border} hover:bg-black/5 dark:hover:bg-white/5`}>
                  <td className="p-4"><input type="checkbox" /></td>
                  <td className="p-4"><div>{r.name}</div><div className={`text-xs ${currentTheme.textSecondary}`}>ID: {r.id}</div></td>
                  <td className="p-4">{r.type}</td>
                  <td className="p-4">{r.date}</td>
                  <td className="p-4"><span className={r.att >= 75 ? 'text-emerald-600' : 'text-red-500'}>{r.att >= 75 ? <CheckCircle2 size={14} className="inline" /> : <XCircle size={14} className="inline" />} Att: {r.att}%</span> <span className={r.fees ? 'text-emerald-600' : 'text-red-500'}>{r.fees ? <CheckCircle2 size={14} className="inline" /> : <XCircle size={14} className="inline" />} Fees Clear</span></td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-bold ${r.risk === 'LOW' ? 'bg-emerald-500/20 text-emerald-600' : r.risk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-600' : 'bg-red-500/20 text-red-500'}`}>{r.risk}</span></td>
                  <td className="p-4"><button className="text-blue-500 font-semibold hover:underline">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Result Publication Portal
  if (section === 'results') {
    return (
      <div className="space-y-6">
        <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Result Publication Portal</h1>
        <p className={`${currentTheme.textSecondary} text-sm`}>Monitor faculty uploads and trigger global AI verification.</p>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold"><TrendingUp size={18} /> Run AI Audit</button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold"><Send size={18} /> Publish Globally</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'OVERALL PROGRESS', value: '82%', sub: '3/4 Depts Uploaded', icon: TrendingUp, color: 'text-blue-500' },
            { title: 'AI ANOMALY CHECK', value: 'PENDING', sub: 'Requires Audit', icon: CheckCircle2, color: 'text-amber-500' },
            { title: 'PENDING SIGNATURE', value: 'Principal', sub: 'Final sign-off required', icon: AlertTriangle, color: 'text-amber-500' },
          ].map((c, i) => (
            <div key={i} className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
              <div className="flex justify-between items-start"><span className={`${currentTheme.textPrimary} font-bold text-lg`}>{c.value}</span><c.icon size={20} className={c.color} /></div>
              <p className={`${currentTheme.textSecondary} text-xs mt-1`}>{c.sub}</p>
              <p className={`${currentTheme.textSecondary} text-xs font-bold uppercase mt-2`}>{c.title}</p>
            </div>
          ))}
        </div>
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl overflow-hidden border ${currentTheme.neoBorder}`}>
          <h3 className={`${currentTheme.textPrimary} font-bold p-4 border-b ${currentTheme.border}`}>Departmental Upload Status</h3>
          <table className="w-full text-sm">
            <thead className={`${currentTheme.bg}`}><tr><th className="p-4 text-left font-bold uppercase text-xs">DEPARTMENT</th><th className="p-4 text-left font-bold uppercase text-xs">PROGRESS</th><th className="p-4 text-left font-bold uppercase text-xs">STATUS</th><th className="p-4 text-left font-bold uppercase text-xs">AI ANOMALIES</th><th className="p-4 text-left font-bold uppercase text-xs">ACTION</th></tr></thead>
            <tbody>
              {['Computer Science', 'Information Technology', 'Electronics Engineering', 'Mechanical Engineering'].map((d, i) => (
                <tr key={i} className={`border-b ${currentTheme.border}`}>
                  <td className="p-4 font-medium">{d}</td>
                  <td className="p-4"><div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: i === 0 ? '100%' : '60%' }} /></div></td>
                  <td className="p-4"><span className={i === 0 ? 'text-emerald-600' : 'text-amber-500'}>{i === 0 ? 'READY' : 'PENDING'}</span></td>
                  <td className="p-4">{i === 0 ? 'No Anomaly' : <span className="text-red-500">{i + 1} Issues</span>}</td>
                  <td className="p-4"><button className="text-blue-500 font-semibold">Review Data</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Course Data — admin places course list used for SWOT analysis (from CAT marks subjects)
  const SWOT_COURSES = [
    { code: 'AL23432', name: 'Machine Learning Techniques', faculty: 'ARAVINDH S' },
    { code: 'CS23415', name: 'Operating Systems', faculty: 'SOWMYA S' },
    { code: 'CS23411', name: 'Database Management Systems', faculty: 'PANDIARAJAN T.' },
    { code: 'CS23413', name: 'Theory of Computation', faculty: 'ANGALAPARAMESWARI ANBAZHAGAN' },
    { code: 'CS23414', name: 'Software Development Practices', faculty: 'SRINIVASAN M.L.' },
    { code: 'CS23431', name: 'Design and Analysis of Algorithms', faculty: 'MURUGAN P' },
  ];
  if (section === 'courseData') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-1 h-8 rounded-full bg-amber-500" />
          <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Course Data for SWOT Analysis</h1>
        </div>
        <p className={`${currentTheme.textSecondary} text-sm`}>These courses are used for SWOT analysis. Student CAT marks for these subjects are combined to produce strengths, weaknesses, and recommendations. Ensure the database is seeded with this course list and student CAT marks (see <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs">sql/swot_cat_marks_schema_and_data.sql</code>).</p>
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl overflow-hidden border ${currentTheme.neoBorder}`}>
          <table className="w-full text-sm">
            <thead className={`${currentTheme.bg} border-b ${currentTheme.border}`}>
              <tr>
                <th className="p-4 text-left font-bold uppercase text-xs">Course Code</th>
                <th className="p-4 text-left font-bold uppercase text-xs">Course Name</th>
                <th className="p-4 text-left font-bold uppercase text-xs">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {SWOT_COURSES.map((c, i) => (
                <tr key={c.code} className={`border-b ${currentTheme.border} hover:bg-black/5 dark:hover:bg-white/5`}>
                  <td className="p-4 font-mono font-semibold text-blue-600 dark:text-blue-400">{c.code}</td>
                  <td className={`p-4 ${currentTheme.textPrimary}`}>{c.name}</td>
                  <td className={`p-4 ${currentTheme.textSecondary} text-xs uppercase`}>{c.faculty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`${currentTheme.textSecondary} text-xs`}>To run analysis: export CAT marks from the database into the CSV format expected by the SWOT API (Course ID, Course Name, Candidate Email, Mark, Grade, Date_of_Attempt), or use the provided SQL seed file and run the export query before uploading in the SWOT Analysis section.</p>
      </div>
    );
  }

  // SWOT Analysis (ML model integration) with Class Dashboard
  if (section === 'swot') {
    const gradeColor = (g) => g === 'A' ? 'text-emerald-500' : g === 'B' ? 'text-blue-500' : g === 'C' ? 'text-amber-500' : g === 'D' ? 'text-orange-500' : 'text-red-500';
    const gradeBg = (g) => g === 'A' ? 'bg-emerald-500/20' : g === 'B' ? 'bg-blue-500/20' : g === 'C' ? 'bg-amber-500/20' : g === 'D' ? 'bg-orange-500/20' : 'bg-red-500/20';

    // Student detail modal
    if (selectedStudent && studentDetail) {
      const sd = studentDetail;
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedStudent(null); setStudentDetail(null); }} className={`p-2 rounded-xl ${currentTheme.card} ${currentTheme.neoBorder} hover:bg-black/5 dark:hover:bg-white/10`}>
              <ChevronRight size={18} className={`${currentTheme.textPrimary} rotate-180`} />
            </button>
            <span className="w-1 h-8 rounded-full bg-blue-500" />
            <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>{sd.name || selectedStudent}</h1>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${gradeBg(sd.overallGrade)} ${gradeColor(sd.overallGrade)}`}>{sd.overallGrade || 'N/A'}</span>
          </div>
          <p className={`${currentTheme.textSecondary} text-sm`}>Individual SWOT analysis for {sd.email}</p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'AVG MARK', value: sd.avgMark || '—', color: 'bg-blue-500' },
              { label: 'COURSES', value: sd.totalCourses || '—', color: 'bg-indigo-500' },
              { label: 'STRENGTHS', value: (sd.strengths || []).length, color: 'bg-emerald-500' },
              { label: 'WEAKNESSES', value: (sd.weaknesses || []).length, color: 'bg-amber-500' },
            ].map((s, i) => (
              <div key={i} className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-5 border ${currentTheme.neoBorder} relative overflow-hidden`}>
                <p className={`${currentTheme.textPrimary} text-2xl font-bold`}>{s.value}</p>
                <p className={`${currentTheme.textSecondary} text-xs font-bold uppercase mt-1`}>{s.label}</p>
                <div className={`absolute bottom-0 right-0 w-16 h-16 rounded-tl-full ${s.color} opacity-10`} />
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
              <div className="flex items-center gap-2 mb-4"><TrendingUp size={20} className="text-emerald-500" /><h3 className={`${currentTheme.textPrimary} font-bold`}>Strengths</h3></div>
              <ul className="space-y-2">
                {(sd.strengths && sd.strengths.length) ? sd.strengths.map((s, i) => (
                  <li key={i} className={`flex items-center gap-2 ${currentTheme.textPrimary} text-sm`}><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />{s}</li>
                )) : <li className={`${currentTheme.textSecondary} text-sm`}>No specific strengths identified.</li>}
              </ul>
            </div>
            <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
              <div className="flex items-center gap-2 mb-4"><AlertTriangle size={20} className="text-amber-500" /><h3 className={`${currentTheme.textPrimary} font-bold`}>Areas to Improve</h3></div>
              <ul className="space-y-2">
                {(sd.weaknesses && sd.weaknesses.length) ? sd.weaknesses.map((w, i) => (
                  <li key={i} className={`flex items-center gap-2 ${currentTheme.textPrimary} text-sm`}><XCircle size={16} className="text-red-400 flex-shrink-0" />{w}</li>
                )) : <li className={`${currentTheme.textSecondary} text-sm`}>No weaknesses identified.</li>}
              </ul>
            </div>
          </div>

          {/* Course-level marks table */}
          {sd.courses && sd.courses.length > 0 && (
            <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl overflow-hidden border ${currentTheme.neoBorder}`}>
              <h3 className={`${currentTheme.textPrimary} font-bold p-4 border-b ${currentTheme.border}`}>Course-wise Performance</h3>
              <table className="w-full text-sm">
                <thead className={`${currentTheme.bg}`}><tr>
                  <th className="p-4 text-left font-bold uppercase text-xs">Course ID</th>
                  <th className="p-4 text-left font-bold uppercase text-xs">Course Name</th>
                  <th className="p-4 text-center font-bold uppercase text-xs">Mark</th>
                  <th className="p-4 text-center font-bold uppercase text-xs">Grade</th>
                </tr></thead>
                <tbody>
                  {sd.courses.map((c, i) => (
                    <tr key={i} className={`border-b ${currentTheme.border} hover:bg-black/5 dark:hover:bg-white/5`}>
                      <td className="p-4 font-mono font-semibold text-blue-600 dark:text-blue-400">{c.courseId}</td>
                      <td className={`p-4 ${currentTheme.textPrimary}`}>{c.courseName}</td>
                      <td className="p-4 text-center"><span className={`font-bold ${c.mark >= 60 ? 'text-emerald-500' : c.mark >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{c.mark}</span></td>
                      <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeBg(c.grade)} ${gradeColor(c.grade)}`}>{c.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recommendations */}
          {sd.recommendations && sd.recommendations.length > 0 && (
            <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
              <div className="flex items-center gap-2 mb-4"><BookMarked size={20} className="text-blue-500" /><h3 className={`${currentTheme.textPrimary} font-bold`}>Recommended Courses</h3></div>
              <div className="space-y-3">
                {sd.recommendations.map((r, i) => (
                  <div key={i} className={`flex flex-wrap items-center gap-2 p-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
                    <span className={`${currentTheme.textSecondary} text-sm`}>Low in</span>
                    <span className={`font-semibold ${currentTheme.textPrimary}`}>{r.weakCourse}</span>
                    <span className={currentTheme.textSecondary}>→</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{r.recommendedCourse}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Loading student detail
    if (selectedStudent && studentDetailLoading) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-8 border ${currentTheme.neoBorder} flex items-center gap-4`}>
            <Activity size={28} className="animate-pulse text-blue-500" />
            <span className={currentTheme.textPrimary}>Loading student data...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-1 h-8 rounded-full bg-amber-500" />
          <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>SWOT & ML Performance Analysis</h1>
        </div>
        <p className={`${currentTheme.textSecondary} text-sm`}>Run the ML model on performance data. Click Analyse to auto-run the ML scripts and view class dashboard with individual student drill-down.</p>

        {/* Run Analysis Card */}
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>Run Analysis</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className={`text-xs font-bold uppercase ${currentTheme.textSecondary} block mb-2`}>Upload CSV (optional)</label>
              <input type="file" accept=".csv" onChange={(e) => setSwotFile(e.target.files?.[0] || null)} className={`text-sm ${currentTheme.textPrimary}`} />
            </div>
            <button id="analyse-btn" onClick={() => runSwot(false)} disabled={swotRunning} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold disabled:opacity-60 flex items-center gap-2 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all">
              <Activity size={18} className={swotRunning ? 'animate-spin' : ''} /> {swotRunning ? 'Running ML Scripts...' : 'Analyse'}
            </button>
            <button onClick={() => { setSwotFile(null); runSwot(true); }} disabled={swotRunning} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-60 flex items-center gap-2 transition-colors">
              <Activity size={18} /> Use Demo Data
            </button>
          </div>
          {swotMessage && (
            <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${swotMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {swotMessage.type === 'success' ? <CheckCircle2 size={16} className="inline mr-2" /> : <XCircle size={16} className="inline mr-2" />}
              {swotMessage.text}
            </div>
          )}
        </div>

        {/* Class Performance Dashboard - shows after analysis */}
        {classDashboard && (
          <>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-1 h-8 rounded-full bg-blue-500" />
              <h2 className={`${currentTheme.textPrimary} text-xl font-bold`}>Class Performance Dashboard</h2>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'CLASS AVG', value: classDashboard.classAverage, color: 'bg-blue-500', darkGlow: 'bg-blue-600' },
                { label: 'HIGHEST', value: classDashboard.highest, color: 'bg-emerald-500', darkGlow: 'bg-emerald-600' },
                { label: 'LOWEST', value: classDashboard.lowest, color: 'bg-red-500', darkGlow: 'bg-red-600' },
                { label: 'PASS RATE', value: `${classDashboard.passRate}%`, color: 'bg-indigo-500', darkGlow: 'bg-indigo-600' },
                { label: 'STUDENTS', value: classDashboard.totalStudents, color: 'bg-amber-500', darkGlow: 'bg-amber-600' },
              ].map((s, i) => (
                <div key={i} className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-5 border ${currentTheme.neoBorder} relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                  <p className={`${currentTheme.textPrimary} text-2xl font-bold relative z-10`}>{s.value}</p>
                  <p className={`${currentTheme.textSecondary} text-xs font-bold uppercase mt-1 relative z-10`}>{s.label}</p>
                  <div className={`absolute bottom-0 right-0 w-20 h-20 rounded-tl-full ${s.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  {darkMode && <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-15 ${s.darkGlow} group-hover:opacity-30 transition-opacity`} />}
                </div>
              ))}
            </div>

            {/* Grade Distribution + Avg per Course Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
                <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>Grade Distribution</h3>
                {classDashboard.gradeDistribution && (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={Object.entries(classDashboard.gradeDistribution).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}`}>
                        {Object.keys(classDashboard.gradeDistribution).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
                <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>Average Marks by Course</h3>
                {classDashboard.summary?.avgMarksPerCourse && (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={classDashboard.summary.avgMarksPerCourse} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                      <XAxis dataKey="course" tick={{ fontSize: 9 }} tickFormatter={(v) => v.length > 14 ? v.slice(0, 14) + '…' : v} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)' }} />
                      <Bar dataKey="avgMark" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Avg Mark" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Top Performers & At Risk */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
                <div className="flex items-center gap-2 mb-4"><Award size={20} className="text-emerald-500" /><h3 className={`${currentTheme.textPrimary} font-bold`}>Top Performers</h3></div>
                <div className="space-y-2">
                  {(classDashboard.topPerformers || []).length > 0 ? classDashboard.topPerformers.map((s, i) => (
                    <div key={i} onClick={() => viewStudentDetail(s.email)} className={`flex items-center justify-between p-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold">{i + 1}</div>
                        <span className={`${currentTheme.textPrimary} font-semibold text-sm`}>{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold text-sm">{s.avgMark}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeBg(s.grade)} ${gradeColor(s.grade)}`}>{s.grade}</span>
                      </div>
                    </div>
                  )) : <p className={`${currentTheme.textSecondary} text-sm`}>No top performers found.</p>}
                </div>
              </div>
              <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
                <div className="flex items-center gap-2 mb-4"><AlertTriangle size={20} className="text-red-400" /><h3 className={`${currentTheme.textPrimary} font-bold`}>At Risk Students</h3></div>
                <div className="space-y-2">
                  {(classDashboard.atRisk || []).length > 0 ? classDashboard.atRisk.map((s, i) => (
                    <div key={i} onClick={() => viewStudentDetail(s.email)} className={`flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10 cursor-pointer hover:bg-red-500/10 transition-colors`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xs font-bold">!</div>
                        <span className={`${currentTheme.textPrimary} font-semibold text-sm`}>{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold text-sm">{s.avgMark}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeBg(s.grade)} ${gradeColor(s.grade)}`}>{s.grade}</span>
                      </div>
                    </div>
                  )) : <p className={`${currentTheme.textSecondary} text-sm`}>No at-risk students. Great!</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Full Student List */}
        {allStudents && allStudents.students && (
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl overflow-hidden border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold p-4 border-b ${currentTheme.border}`}>All Students — Click to view individual SWOT</h3>
            <table className="w-full text-sm">
              <thead className={`${currentTheme.bg}`}><tr>
                <th className="p-4 text-left font-bold uppercase text-xs">Student</th>
                <th className="p-4 text-center font-bold uppercase text-xs">Avg Mark</th>
                <th className="p-4 text-center font-bold uppercase text-xs">Grade</th>
                <th className="p-4 text-center font-bold uppercase text-xs">Courses</th>
                <th className="p-4 text-center font-bold uppercase text-xs">Strengths</th>
                <th className="p-4 text-center font-bold uppercase text-xs">Weaknesses</th>
                <th className="p-4 text-center font-bold uppercase text-xs">Action</th>
              </tr></thead>
              <tbody>
                {allStudents.students.map((s, i) => (
                  <tr key={i} className={`border-b ${currentTheme.border} hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors`} onClick={() => viewStudentDetail(s.email)}>
                    <td className="p-4"><div className={`${currentTheme.textPrimary} font-semibold`}>{s.name}</div><div className={`${currentTheme.textSecondary} text-xs`}>{s.email}</div></td>
                    <td className="p-4 text-center"><span className={`font-bold ${s.avgMark >= 70 ? 'text-emerald-500' : s.avgMark >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{s.avgMark}</span></td>
                    <td className="p-4 text-center"><span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeBg(s.grade)} ${gradeColor(s.grade)}`}>{s.grade}</span></td>
                    <td className={`p-4 text-center ${currentTheme.textPrimary} font-semibold`}>{s.totalCourses}</td>
                    <td className="p-4 text-center"><span className="text-emerald-500 font-bold">{(s.strengths || []).length}</span></td>
                    <td className="p-4 text-center"><span className="text-red-400 font-bold">{(s.weaknesses || []).length}</span></td>
                    <td className="p-4 text-center"><button className="text-blue-500 font-semibold hover:underline text-xs uppercase tracking-wider">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }


  // Energy Optimization
  if (section === 'energy') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-1 h-8 rounded-full bg-amber-500" />
          <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Campus Energy Optimization Report</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'REAL-TIME LOAD', value: '265 kW', color: 'bg-blue-500' },
            { label: 'PEAK DAILY', value: '800 kW', color: 'bg-amber-500' },
            { label: 'SOLAR OUTPUT', value: '50 kW', color: 'bg-emerald-500' },
            { label: 'GRID IMPORT', value: '199 kW', color: 'bg-red-500' },
          ].map((k, i) => (
            <div key={i} className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder} text-white relative overflow-hidden`}>
              <p className="text-2xl font-bold relative z-10">{k.value}</p>
              <p className="text-white/80 text-xs font-bold uppercase mt-1 relative z-10">{k.label}</p>
              <div className={`absolute inset-0 ${k.color} opacity-90`} />
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <div className="flex justify-between items-center mb-4"><h3 className={`${currentTheme.textPrimary} font-bold`}>Energy Consumption Pattern</h3><span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-600 text-xs font-bold">LIVE</span></div>
            <div className="h-48 rounded-xl bg-amber-500/10 flex items-center justify-center"><span className={`${currentTheme.textSecondary} text-sm`}>Chart placeholder (04:00 - 22:29)</span></div>
          </div>
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-2`}>Energy Optimization Simulation</h3>
            <p className={`${currentTheme.textSecondary} text-sm mb-4`}>Analyse building-specific sensor data to optimise load distribution and maximise the integration of renewable energy sources.</p>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-semibold">Execute Analysis</button>
          </div>
        </div>
      </div>
    );
  }

  // Faculty Substitution
  if (section === 'substitutions') {
    return (
      <div className="space-y-6">
        <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Faculty Substitution Panel</h1>
        <p className={`${currentTheme.textSecondary} text-sm`}>AI-driven clash detection and substitution matching</p>
        <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold">+ Mark Bulk Absence</button>
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>Today&apos;s Absent Faculty</h3>
            <div className="space-y-3">
              {['Dr. Ramesh K (CS) - Period P1, P4', 'Prof. Anitha S (IT) - Period P2'].map((f, i) => (
                <div key={i} className={`flex justify-between items-center p-3 rounded-xl ${currentTheme.bg}`}><span className={currentTheme.textPrimary}>{f}</span><span className="px-2 py-0.5 rounded bg-red-500/20 text-red-600 text-xs font-bold">{i === 0 ? 'Medical' : 'External OD'}</span></div>
              ))}
            </div>
          </div>
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>AI Top Matches for P1 (CS)</h3>
            <div className="space-y-3">
              {['Prof. Senthil: 12 hrs/wk | Data Structures, 95%', 'Dr. Mary J: 15 hrs/wk | Operating Systems, 88%', 'Mr. Vignesh: 10 hrs/wk | Programming, 82%'].map((m, i) => (
                <div key={i} className={`flex justify-between items-center p-3 rounded-xl ${currentTheme.bg}`}><span className={currentTheme.textPrimary}>{m}</span><button className="text-blue-500 font-semibold">Assign</button></div>
              ))}
            </div>
            <button className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold">Notify All Substitutes via WhatsApp</button>
          </div>
        </div>
      </div>
    );
  }

  // Transport Analytics
  if (section === 'transport') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className={`${currentTheme.textPrimary} text-2xl font-bold flex items-center gap-2`}><Bus size={24} /> Institutional Fleet Intelligence</h1><p className={`${currentTheme.textSecondary} text-sm mt-1`}>Evaluating fleet dynamics, fuel economics, and residential cluster distributions.</p></div>
          <div className="flex gap-2"><button className={`px-4 py-2 rounded-xl ${currentTheme.card} ${currentTheme.neoBorder} ${currentTheme.textPrimary} font-semibold`}>Network Map</button><button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">Optimise All</button></div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'ACTIVE ROUTES', value: '12', sub: 'Across Campus Network' },
            { label: 'TOTAL STUDENTS', value: '2,800', sub: 'Bus Commuters' },
            { label: 'TARGET EFFICIENCY', value: '20%', sub: 'Projected Fuel Savings Goal' },
          ].map((c, i) => (
            <div key={i} className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder} text-white relative overflow-hidden`}>
              <p className="text-2xl font-bold relative z-10">{c.value}</p>
              <p className="text-white/80 text-xs mt-1 relative z-10">{c.sub}</p>
              <p className="text-white/60 text-[10px] font-bold uppercase mt-2 relative z-10">{c.label}</p>
              <div className={`absolute inset-0 ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-amber-500'} opacity-90`} />
            </div>
          ))}
        </div>
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>Simulation Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className={`text-xs ${currentTheme.textSecondary}`}>Routes</label><p className={currentTheme.textPrimary}>12</p></div>
            <div><label className={`text-xs ${currentTheme.textSecondary}`}>Total Students</label><p className={currentTheme.textPrimary}>2800</p></div>
            <div><label className={`text-xs ${currentTheme.textSecondary}`}>Fuel Cost (₹/L)</label><p className={currentTheme.textPrimary}>100</p></div>
            <div><label className={`text-xs ${currentTheme.textSecondary}`}>Optimization (%)</label><p className={currentTheme.textPrimary}>20</p></div>
          </div>
          <label className="flex items-center gap-2 mb-4"><input type="checkbox" defaultChecked /> <span className={currentTheme.textPrimary}>EV Scenario</span></label>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold"><Bus size={18} /> Run Predictive Network Analysis</button>
        </div>
      </div>
    );
  }

  // Placements, Audit, Timetables, Directory, Crowd - placeholder
  const placeholders = { placements: 'Placements', audit: 'Audit Logs', timetables: 'Exam Timetables', directory: 'Transport Directory', crowd: 'Crowd Flow' };
  const title = placeholders[section] || 'Dashboard';
  return (
    <div className="space-y-6">
      <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>{title}</h1>
      <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-12 border ${currentTheme.neoBorder} flex flex-col items-center justify-center min-h-[300px]`}>
        <LayoutDashboard size={64} className={`${currentTheme.textSecondary} opacity-40 mb-4`} />
        <p className={`${currentTheme.textSecondary} text-center`}>Module coming soon. Select a section from the sidebar.</p>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [studentEmail, setStudentEmail] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // Defaulting to true as requested to see neon
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [scrolled, setScrolled] = useState(false);
  const currentTheme = darkMode ? themes.dark : themes.light;

  // Handle scroll for glassy header effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Activity, label: 'SWOT Analysis' },
    { icon: Calendar, label: 'My Timetable' },
    { icon: ClipboardList, label: 'Leave / OD' },
    { icon: UserCheck, label: 'Attendance' },
    { icon: Zap, label: 'CAT Mark' },
    { icon: Clock, label: 'LAB Mark' },
    { icon: Wallet, label: 'Academic Fee' },
  ];

  const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const [calendarMonth, setCalendarMonth] = useState(todayIST.getMonth());
  const currentYear = todayIST.getFullYear();

  const calendarDate = new Date(currentYear, calendarMonth, 1);
  const currentMonthName = calendarDate.toLocaleString("default", { month: "long" });
  const currentDaysInMonth = new Date(currentYear, calendarMonth + 1, 0).getDate();
  const firstDayOfMonth = calendarDate.getDay();

  const currentIstDay = todayIST.getDate();
  const realCurrentMonth = todayIST.getMonth();

  const stats = [
    { label: 'CGPA', value: '8.42', icon: GraduationCap, colorClass: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', shadowClass: 'shadow-blue-500/20', darkGlow: 'bg-blue-600' },
    { label: 'Current Arrears', value: '0', icon: Sparkles, colorClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', shadowClass: 'shadow-emerald-500/20', darkGlow: 'bg-emerald-600' },
    { label: 'Avg Attendance', value: '92%', icon: UserCheck, colorClass: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', shadowClass: 'shadow-indigo-500/20', darkGlow: 'bg-indigo-600', onClick: () => setActiveTab('Attendance') },
    { label: 'Total Leaves', value: '2', icon: Clock, colorClass: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400', shadowClass: 'shadow-orange-500/20', darkGlow: 'bg-orange-600', onClick: () => setActiveTab('Leave / OD') },
  ];

  if (!isAuthenticated) {
    return (
      <SignInPage
        onSignIn={({ isAdmin: admin, email }) => {
          setIsAuthenticated(true);
          setIsAdmin(!!admin);
          setStudentEmail(email || null);
        }}
      />
    );
  }

  if (isAdmin) {
    return (
      <div className={`theme-smooth min-h-screen ${darkMode ? 'dark bg-[#000000]' : 'bg-slate-100/80'}`}>
        <AdminPanel
          onLogout={() => {
            setIsAuthenticated(false);
            setIsAdmin(false);
          }}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((d) => !d)}
        />
      </div>
    );
  }

  return (
    <div className={`theme-smooth min-h-screen ${currentTheme.bg} ${darkMode ? 'dark' : ''} flex font-sans selection:bg-blue-500/30 text-slate-900`}>

      {/* Decorative Background Gradients - crossfade for buttery theme transition */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[100px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-50/50 blur-[100px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-900/20 blur-[120px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarCollapsed(true)}
        ></div>
      )}

      {/* Sidebar - Glassmorphism */}
      <aside className={`${currentTheme.sidebar} ${isSidebarCollapsed ? 'w-0 overflow-hidden md:w-[100px]' : 'w-[280px]'} transition-[width] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col fixed h-full z-50`}>

        {/* Logo Section */}
        <div className="h-28 flex items-center px-8 relative">
          <div className="flex items-center gap-4 w-full">
            <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-[0_8px_16px_rgba(59,130,246,0.25)] relative overflow-hidden group`}>
              {darkMode && <div className="absolute inset-0 bg-blue-400/30 blur-md group-hover:opacity-100 opacity-0 transition-opacity"></div>}
              <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white drop-shadow-md relative z-10">
                <path d="M25 25 L75 25 L75 75 L25 75 Z" stroke="white" strokeWidth="8" fill="none" rx="10" />
                <text x="50" y="66" textAnchor="middle" fontSize="42" fill="white" fontWeight="800" fontFamily="sans-serif">R</text>
              </svg>
            </div>

            {!isSidebarCollapsed && (
              <div className="flex flex-col animate-fade-in">
                <h1 className={`${currentTheme.textPrimary} font-bold text-xl tracking-tight leading-none`}>RIT IMS</h1>
                <p className={`${currentTheme.textSecondary} text-[11px] font-medium mt-1 tracking-wider uppercase`}>Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-4 overflow-y-auto no-scrollbar space-y-1">
          {menuItems.map((item, index) => (
            <div key={item.label} onClick={() => setActiveTab(item.label)}>
              {/* Optional Section Dividers */}
              {index === 4 && !isSidebarCollapsed && <div className={`my-4 ml-4 text-[10px] font-bold uppercase tracking-widest ${currentTheme.textSecondary} opacity-50`}>Academics</div>}
              {index === 7 && !isSidebarCollapsed && <div className={`my-4 ml-4 text-[10px] font-bold uppercase tracking-widest ${currentTheme.textSecondary} opacity-50`}>Records</div>}

              <SidebarItem
                icon={item.icon}
                label={item.label}
                active={activeTab === item.label}
                theme={currentTheme}
                isCollapsed={isSidebarCollapsed}
              />
            </div>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6">
          <div onClick={() => setIsAuthenticated(false)} className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 cursor-pointer transition-colors group`}>
            {!isSidebarCollapsed && <span className="text-sm font-semibold tracking-wide">Logout</span>}
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarCollapsed ? 'ml-0 md:ml-[100px]' : 'ml-0 md:ml-[280px]'} relative z-10 w-full overflow-x-hidden`}>

        {/* Floating Glass Header */}
        <header className={`sticky top-0 z-40 ${scrolled ? currentTheme.headerBg : 'bg-transparent'} px-4 md:px-6 lg:px-10 h-16 sm:h-20 lg:h-24 flex items-center justify-between gap-2`}>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-2.5 rounded-full ${currentTheme.card} ${currentTheme.neoBorder} hover:scale-105 transition-all shadow-sm group`}
            >
              <Menu size={18} className={`${currentTheme.textPrimary}`} />
            </button>

            <h2 className={`text-xl font-bold tracking-tight ${currentTheme.textPrimary} hidden md:block opacity-0 translate-y-2 animate-[fade-in-up_0.4s_ease-out_forwards]`}>
              {activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Global Search */}
            <div className="hidden lg:flex relative group mr-2">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} w-4 h-4 transition-colors group-focus-within:text-blue-500`} />
              <input
                type="text"
                placeholder="Search..."
                className={`w-64 ${currentTheme.card} ${currentTheme.neoBorder} rounded-full py-2.5 pl-11 pr-4 text-sm ${currentTheme.textPrimary} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm`}
              />
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full ${currentTheme.card} ${currentTheme.neoBorder} shadow-sm transition-all hover:scale-105 ${darkMode ? 'text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'text-slate-600'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className={`relative p-3 rounded-full ${currentTheme.card} ${currentTheme.neoBorder} shadow-sm hover:scale-105 transition-all`}>
              <Bell size={18} className={currentTheme.textPrimary} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

            <div className={`flex items-center gap-3 pl-2 p-1.5 rounded-full ${currentTheme.card} ${currentTheme.neoBorder} pr-4 cursor-pointer hover:shadow-md transition-shadow`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arvind&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <span className={`text-sm font-semibold ${currentTheme.textPrimary} hidden sm:block`}>Arvind N.</span>
              <ChevronDown size={14} className={currentTheme.textSecondary} />
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        {activeTab === 'Dashboard' && (
          <div className="p-4 md:p-10 md:pt-4 max-w-7xl mx-auto w-full animate-fade-in">

            {/* Elegant Hero Section */}
            <div className={`${currentTheme.heroGradient} rounded-[24px] md:rounded-[32px] p-6 md:p-10 mb-8 md:mb-10`}>
              {darkMode && (
                <>
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px]"></div>
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                </>
              )}
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-2">Good morning, Arvind.</h1>
                  <p className="text-blue-100/80 text-xs md:text-base mt-2 max-w-lg font-medium">
                    Your academic standing is excellent. You have 2 classes today.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 ${darkMode ? 'bg-white text-black' : 'bg-white text-blue-600'}`}>
                    View Schedule
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Stats Row (Apple Style separated cards) */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} theme={currentTheme} darkMode={darkMode} />
              ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

              {/* Announcements - Clean List Style */}
              <div className={`xl:col-span-2 ${currentTheme.card} rounded-[24px] md:rounded-[32px] p-5 md:p-8 relative overflow-hidden`}>
                <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className={`${currentTheme.textPrimary} font-bold text-xl tracking-tight`}>
                      Announcements
                    </h3>
                    <button className={`text-sm font-semibold ${currentTheme.warmAccent} hover:underline`}>See All</button>
                  </div>

                  <div className="space-y-1">
                    {[
                      { title: "Placement Drive: Google Cloud", info: "Pre-placement talk at Main Auditorium", time: "Today, 10:00 AM", isNew: true },
                      { title: "Internal Assessment III Postponed", info: "Check the updated schedule in your portal", time: "Yesterday", isNew: false },
                      { title: "Hackathon 2026 Registrations", info: "Last date to register your team is Jan 26", time: "Jan 20", isNew: false }
                    ].map((item, i) => (
                      <div key={i} className={`p-4 rounded-2xl flex items-center justify-between group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-2 h-2 mt-2 rounded-full ${item.isNew ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-transparent'}`}></div>
                          <div>
                            <h4 className={`${currentTheme.textPrimary} font-semibold text-base mb-0.5 group-hover:text-blue-500 transition-colors`}>{item.title}</h4>
                            <span className={`${currentTheme.textSecondary} text-sm`}>{item.info}</span>
                          </div>
                        </div>
                        <span className={`${currentTheme.textSecondary} text-xs font-medium whitespace-nowrap`}>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Agenda / Mini Calendar */}
              <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-5 md:p-8 flex flex-col relative overflow-hidden`}>
                <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className={`${currentTheme.textPrimary} font-bold text-xl tracking-tight`}>
                      Up Next
                    </h3>
                    <div className={`w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center ${currentTheme.textPrimary}`}>
                      <span className="text-xs font-bold">28</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-4">
                    {/* Event item */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] !border-[1px] !border-solid !border-black/5 dark:border-white/5">
                      <div className="flex flex-col items-center justify-center pr-4 border-r border-slate-200 dark:border-slate-800">
                        <span className={`text-sm font-bold ${currentTheme.textPrimary}`}>09:30</span>
                        <span className={`text-[10px] font-medium ${currentTheme.textSecondary}`}>AM</span>
                      </div>
                      <div>
                        <h4 className={`font-semibold text-sm ${currentTheme.textPrimary}`}>Compiler Design</h4>
                        <p className={`text-xs ${currentTheme.textSecondary} mt-1 flex items-center gap-1`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Room 402
                        </p>
                      </div>
                    </div>

                    {/* Event item */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] !border-[1px] !border-solid !border-black/5 dark:border-white/5">
                      <div className="flex flex-col items-center justify-center pr-4 border-r border-slate-200 dark:border-slate-800">
                        <span className={`text-sm font-bold ${currentTheme.textPrimary}`}>11:15</span>
                        <span className={`text-[10px] font-medium ${currentTheme.textSecondary}`}>AM</span>
                      </div>
                      <div>
                        <h4 className={`font-semibold text-sm ${currentTheme.textPrimary}`}>Machine Learning</h4>
                        <p className={`text-xs ${currentTheme.textSecondary} mt-1 flex items-center gap-1`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Lab 3
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('My Timetable')}
                    className={`w-full py-3.5 mt-6 rounded-2xl bg-black/5 dark:bg-white/[0.05] ${currentTheme.textPrimary} text-sm font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors`}
                  >
                    Open Full Timetable
                  </button>
                </div>
              </div>
            </div>

            {/* Full Academic Calendar (Apple Glass Style) */}
            <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-5 md:p-8 relative overflow-hidden`}>
              <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                  <div>
                    <h3 className={`${currentTheme.textPrimary} font-bold text-2xl tracking-tight mb-2`}>
                      {currentMonthName} {currentYear}
                    </h3>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]"></div>
                        <span className={`${currentTheme.textSecondary} text-xs font-semibold uppercase tracking-wider`}>Holiday</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"></div>
                        <span className={`${currentTheme.textSecondary} text-xs font-semibold uppercase tracking-wider`}>No Order Day</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCalendarMonth(Math.max(0, calendarMonth - 1))}
                      disabled={calendarMonth === 0}
                      className={`px-4 py-2 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-sm font-semibold transition-colors ${calendarMonth === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCalendarMonth(Math.min(11, calendarMonth + 1))}
                      disabled={calendarMonth === 11}
                      className={`px-4 py-2 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-sm font-semibold transition-colors ${calendarMonth === 11 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                    >
                      Next Month
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto pb-4">
                  <div className={`grid grid-cols-7 min-w-[500px] lg:min-w-0 gap-px bg-slate-200 dark:bg-white/[0.05] rounded-[24px] overflow-hidden ${currentTheme.neoBorder} p-px shadow-inner`}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className={`p-4 text-center font-extrabold text-xs uppercase tracking-widest ${currentTheme.bg} ${currentTheme.textSecondary}`}>
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className={`h-20 sm:h-24 md:h-28 p-1 sm:p-2 md:p-3 bg-transparent`}></div>
                    ))}
                    {Array.from({ length: currentDaysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const isToday = day === currentIstDay && calendarMonth === realCurrentMonth;
                      const isHoliday = [1, 8, 15, 22].includes(day);
                      const isNoOrder = [2, 9, 16, 23].includes(day);
                      const hasEvent = day === 12;

                      return (
                        <div
                          key={i}
                          className={`h-20 sm:h-24 md:h-28 p-1 sm:p-2 md:p-3 flex flex-col bg-white/60 dark:bg-[#000000]/40 backdrop-blur-3xl transition-all hover:bg-white/80 dark:hover:bg-white/[0.08] cursor-pointer relative group overflow-hidden`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full transition-all
                          ${isToday ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : `${currentTheme.textPrimary} group-hover:bg-black/5 dark:group-hover:bg-white/10`}`}
                            >
                              {day}
                            </span>
                          </div>

                          <div className="mt-auto space-y-1.5 w-full">
                            {isHoliday && <div className="h-1.5 w-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)] rounded-full"></div>}
                            {isNoOrder && <div className="h-1.5 w-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.5)] rounded-full"></div>}
                            {hasEvent && (
                              <div className="px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] rounded-md font-extrabold uppercase tracking-widest shadow-[0_4px_10px_rgba(251,191,36,0.3)] truncate text-center">
                                Symposium
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Timetable Content Container */}
        {activeTab === 'My Timetable' && (
          <TimetableContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* Leave/OD Content Container */}
        {activeTab === 'Leave / OD' && (
          <LeaveODContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* Attendance Content Container */}
        {activeTab === 'Attendance' && (
          <AttendanceContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* CAT Mark Content Container */}
        {activeTab === 'CAT Mark' && (
          <CatMarkContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* Academic Fee Content Container */}
        {activeTab === 'Academic Fee' && (
          <AcademicFeeContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* SWOT Analysis Content Container */}
        {activeTab === 'SWOT Analysis' && (
          <SwotAnalysisContent currentTheme={currentTheme} darkMode={darkMode} studentEmail={studentEmail} />
        )}
      </main>

      {/* KUTTI – Student portal assistant chatbot */}
      <KuttiChatbot currentTheme={currentTheme} darkMode={darkMode} />

      {/* Global generic styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        body {
          background-color: ${darkMode ? '#000' : '#f8fafc'};
          transition: background-color 0.75s cubic-bezier(0.33, 1, 0.68, 1);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}} />
    </div>
  );
};

export default App;