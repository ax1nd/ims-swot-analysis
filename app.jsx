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
  Monitor,
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
const STUDENT_EMAIL_BY_ROLL = {
  '2117240020001': 'aakash.b.k@example.com',
  '2117240020002': 'aarthi.m@example.com',
  '2117240020003': 'aashida.v@example.com',
  '2117240020004': 'abhilash.m@example.com',
  '2117240020005': 'abimanue.m@example.com',
  '2117240020006': 'abina.jerlin.m@example.com',
  '2117240020007': 'abinaya.s.g@example.com',
  '2117240020008': 'abinesh.s@example.com',
  '2117240020009': 'abirami.b@example.com',
  '2117240020010': 'abishek.s@example.com',
  '2117240020011': 'adarsh.h@example.com',
  '2117240020012': 'aditya.parthasarathy@example.com',
  '2117240020013': 'afsa.r@example.com',
  '2117240020014': 'aiswaryaa.babu@example.com',
  '2117240020015': 'akash.a@example.com',
  '2117240020016': 'akshara.p@example.com',
  '2117240020017': 'akshay.v@example.com',
  '2117240020018': 'akshaya.k@example.com',
  '2117240020019': 'akshaya.m@example.com',
  '2117240020020': 'akshaya.r.l@example.com',
  '2117240020021': 'akshaya.darshini.n@example.com',
  '2117240020022': 'akshitha.p@example.com',
  '2117240020023': 'akshitha.s@example.com',
  '2117240020024': 'ambati.nikhitha@example.com',
  '2117240020025': 'amudhan.m@example.com',
  '2117240020026': 'anisha.pathak@example.com',
  '2117240020027': 'aniska.s.p@example.com',
  '2117240020028': 'anjasri.v@example.com',
  '2117240020029': 'anusha.b@example.com',
  '2117240020030': 'anu.shri.r@example.com',
  '2117240020031': 'aravindraj.d@example.com',
  '2117240020032': 'arnav.kumar.r@example.com',
  '2117240020033': 'arvind.n@example.com',
  '2117240020034': 'asanthika.a@example.com',
  '2117240020035': 'aseema.s@example.com',
  '2117240020036': 'asha.a@example.com',
  '2117240020037': 'ashwin.g@example.com',
  '2117240020038': 'asin.d@example.com',
  '2117240020039': 'aswanthar.m@example.com',
  '2117240020040': 'aswin.r@example.com',
  '2117240020041': 'aswin.kumar.e.n@example.com',
  '2117240020042': 'aswini.m@example.com',
  '2117240020043': 'athishwar.j@example.com',
  '2117240020044': 'austin.joshua.m@example.com',
  '2117240020045': 'avineshwaran.a@example.com',
  '2117240020046': 'balaji.m.r@example.com',
  '2117240020047': 'balaji.p@example.com',
  '2117240020048': 'baskar.j@example.com',
  '2117240020049': 'bavatharini.r@example.com',
  '2117240020050': 'bharanidharan.r@example.com',
  '2117240020051': 'bhuvaneshwaran.s@example.com',
  '2117240020052': 'catherin.jenira.i@example.com',
  '2117240020053': 'charumathi.k@example.com',
  '2117240020054': 'chris.alan@example.com',
  '2117240020055': 'chris.melvyn.raj.p@example.com',
  '2117240020056': 'christopher.j@example.com',
  '2117240020057': 'darshan.a.r@example.com',
  '2117240020058': 'darshan.b@example.com',
  '2117240020059': 'deborhal.l@example.com',
  '2117240020060': 'deepa.shree.c@example.com',
  '2117240020061': 'deepesh.v@example.com',
  '2117240020062': 'deepika.p@example.com'
};
const STUDENT_NAME_BY_ROLL = {
  '2117240020001': 'Aakash B K',
  '2117240020002': 'Aarthi M',
  '2117240020003': 'Aashida V',
  '2117240020004': 'Abhilash M',
  '2117240020005': 'Abimanue M',
  '2117240020006': 'Abina Jerlin M',
  '2117240020007': 'Abinaya S G',
  '2117240020008': 'Abinesh S',
  '2117240020009': 'Abirami B',
  '2117240020010': 'Abishek S',
  '2117240020011': 'Adarsh H',
  '2117240020012': 'Aditya Parthasarathy',
  '2117240020013': 'Afsa R',
  '2117240020014': 'Aiswaryaa Babu',
  '2117240020015': 'Akash A',
  '2117240020016': 'Akshara P',
  '2117240020017': 'Akshay V',
  '2117240020018': 'Akshaya K',
  '2117240020019': 'Akshaya M',
  '2117240020020': 'Akshaya R L',
  '2117240020021': 'Akshaya Darshini N',
  '2117240020022': 'Akshitha P',
  '2117240020023': 'Akshitha S',
  '2117240020024': 'Ambati Nikhitha',
  '2117240020025': 'Amudhan M',
  '2117240020026': 'Anisha Pathak',
  '2117240020027': 'Aniska S P',
  '2117240020028': 'Anjasri V',
  '2117240020029': 'Anusha B',
  '2117240020030': 'Anu Shri R',
  '2117240020031': 'Aravindraj D',
  '2117240020032': 'Arnav Kumar R',
  '2117240020033': 'Arvind N',
  '2117240020034': 'Asanthika A',
  '2117240020035': 'Aseema S',
  '2117240020036': 'Asha A',
  '2117240020037': 'Ashwin G',
  '2117240020038': 'Asin D',
  '2117240020039': 'Aswanthar M',
  '2117240020040': 'Aswin R',
  '2117240020041': 'Aswin Kumar E N',
  '2117240020042': 'Aswini M',
  '2117240020043': 'Athishwar J',
  '2117240020044': 'Austin Joshua M',
  '2117240020045': 'Avineshwaran A',
  '2117240020046': 'Balaji M R',
  '2117240020047': 'Balaji P',
  '2117240020048': 'Baskar J',
  '2117240020049': 'Bavatharini R',
  '2117240020050': 'Bharanidharan R',
  '2117240020051': 'Bhuvaneshwaran S',
  '2117240020052': 'Catherin Jenira I',
  '2117240020053': 'Charumathi K',
  '2117240020054': 'Chris Alan',
  '2117240020055': 'Chris Melvyn Raj P',
  '2117240020056': 'Christopher J',
  '2117240020057': 'Darshan A R',
  '2117240020058': 'Darshan B',
  '2117240020059': 'Deborhal L',
  '2117240020060': 'Deepa Shree C',
  '2117240020061': 'Deepesh V',
  '2117240020062': 'Deepika P'
};
const ADMIN_PASSWORD = '9025726185';
const HOD_USERNAME = 'hod.cse';
const HOD_PASSWORD = 'hod@1234';
const TEACHER_USERNAME = 'teacher.cse';
const TEACHER_PASSWORD = 'teach@1234';
const ATTENDANCE_RISK_THRESHOLD = 75;
const ATTENDANCE_DATA = [
  { id: 1, regNo: '2117240020033', ccode: 'CS23411', cname: 'Database Management Systems', fname: 'PANDIARAJAN T.', section: 'III-CSE-A', year: 'III', attended: 26, total: 29, percentage: 89.66 },
  { id: 2, regNo: '2117240020034', ccode: 'CS23413', cname: 'Theory of Computation', fname: 'ANGALAPARAMESWARI ANBAZHAGAN', section: 'III-CSE-A', year: 'III', attended: 30, total: 35, percentage: 85.71 },
  { id: 3, regNo: '2117240020035', ccode: 'CS23414', cname: 'Software Development Practices', fname: 'SRINIVASAN M.L.', section: 'III-CSE-A', year: 'III', attended: 17, total: 19, percentage: 89.47 },
  { id: 4, regNo: '2117240020036', ccode: 'CS23431', cname: 'Design and Analysis of Algorithms', fname: 'MURUGAN P', section: 'III-CSE-B', year: 'III', attended: 30, total: 33, percentage: 90.91 },
  { id: 5, regNo: '2117240020037', ccode: 'AL23432', cname: 'Machine Learning Techniques', fname: 'ARAVINDH S', section: 'III-CSE-B', year: 'III', attended: 36, total: 43, percentage: 83.72 },
  { id: 6, regNo: '2117240020038', ccode: 'CS23421', cname: 'Database Management Systems Laboratory', fname: 'PANDIARAJAN T.', section: 'III-CSE-B', year: 'III', attended: 13, total: 13, percentage: 100.0 },
  { id: 7, regNo: '2117240020039', ccode: 'CS23IC2', cname: 'Visualization Tools', fname: 'ARAVINDH S', section: 'II-CSE-A', year: 'II', attended: 16, total: 16, percentage: 100.0 },
  { id: 8, regNo: '2117240020040', ccode: 'CS23415', cname: 'Operating Systems', fname: 'SOWMYA S', section: 'III-CSE-A', year: 'III', attended: 14, total: 18, percentage: 70.33 },
  { id: 9, regNo: '2117240020041', ccode: 'CS23423', cname: 'Operating Systems Laboratory', fname: 'SOWMYA S', section: 'III-CSE-B', year: 'III', attended: 5, total: 6, percentage: 83.33 },
];

const calculateAttendancePercentage = (attended, total) => {
  if (!total || total <= 0) return 0;
  return Math.round((Number(attended) * 10000) / Number(total)) / 100;
};

const isAttendanceRisk = (percentage) => Number(percentage) < ATTENDANCE_RISK_THRESHOLD;

const pushAuditLog = (entry) => {
  const key = 'ims_audit_logs';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const next = [
    {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...entry,
    },
    ...existing,
  ].slice(0, 100);
  localStorage.setItem(key, JSON.stringify(next));
};

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

const THEME_STORAGE_KEY = 'theme-mode';
const THEME_TRANSITION_STYLE_ID = 'theme-transition-styles';

const createThemeAnimation = ({ variant = 'circle', start = 'top-right', blur = false } = {}) => {
  if (variant === 'rectangle') {
    return `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
      }
      ::view-transition-new(root) {
        animation-name: reveal-light;
        ${blur ? 'filter: blur(2px);' : ''}
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark;
        ${blur ? 'filter: blur(2px);' : ''}
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      @keyframes reveal-dark {
        from { clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%); ${blur ? 'filter: blur(8px);' : ''} }
        to { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); ${blur ? 'filter: blur(0);' : ''} }
      }
      @keyframes reveal-light {
        from { clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%); ${blur ? 'filter: blur(8px);' : ''} }
        to { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); ${blur ? 'filter: blur(0);' : ''} }
      }
    `;
  }

  const positions = {
    'top-left': '0% 0%',
    'top-right': '100% 0%',
    'bottom-left': '0% 100%',
    'bottom-right': '100% 100%',
    'center': '50% 50%',
  };
  const clipPosition = positions[start] || '50% 50%';

  return `
    ::view-transition-group(root) {
      animation-duration: 0.8s;
      animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
    }
    ::view-transition-new(root) {
      animation-name: reveal-light;
      ${blur ? 'filter: blur(2px);' : ''}
    }
    .dark::view-transition-new(root) {
      animation-name: reveal-dark;
      ${blur ? 'filter: blur(2px);' : ''}
    }
    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }
    @keyframes reveal-dark {
      from { clip-path: circle(0% at ${clipPosition}); ${blur ? 'filter: blur(8px);' : ''} }
      to { clip-path: circle(150% at ${clipPosition}); ${blur ? 'filter: blur(0);' : ''} }
    }
    @keyframes reveal-light {
      from { clip-path: circle(0% at ${clipPosition}); ${blur ? 'filter: blur(8px);' : ''} }
      to { clip-path: circle(150% at ${clipPosition}); ${blur ? 'filter: blur(0);' : ''} }
    }
  `;
};

const setThemeTransitionStyles = (css) => {
  if (typeof window === 'undefined') return;
  let styleElement = document.getElementById(THEME_TRANSITION_STYLE_ID);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = THEME_TRANSITION_STYLE_ID;
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = css;
};

const ThemeModeToggle = ({ themeMode, onThemeModeChange, currentTheme }) => {
  const options = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className={`flex items-center gap-1 rounded-full p-1 ${currentTheme.card} ${currentTheme.neoBorder} shadow-sm`}>
      {options.map(({ mode, label, icon: Icon }) => {
        const active = themeMode === mode;
        return (
          <button
            key={mode}
            onClick={() => onThemeModeChange(mode)}
            aria-label={`Use ${label.toLowerCase()} theme`}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
              active
                ? 'bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.35)]'
                : `${currentTheme.textSecondary} hover:bg-black/5 dark:hover:bg-white/10`
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
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
  const [dayFilter, setDayFilter] = useState('ALL');
  const [exporting, setExporting] = useState(false);

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

  const visibleDays = dayFilter === 'ALL' ? days : [dayFilter];
  const totalClasses = visibleDays.reduce((acc, day) => acc + Object.keys(schedule[day] || {}).length, 0);

  const exportTimetablePdf = async () => {
    const rows = [];
    visibleDays.forEach((day) => {
      periods.forEach((period) => {
        const cell = schedule[day]?.[period];
        if (cell) {
          rows.push({
            day,
            period,
            subject: cell.subject,
            courseCode: cell.staff || '-',
          });
        }
      });
    });
    try {
      setExporting(true);
      await downloadBlobFile('/api/export/timetable/pdf', { rows }, 'Timetable_Report.pdf');
    } catch (err) {
      alert(err?.message || 'Unable to export timetable PDF.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-3 md:p-8 md:pt-4 max-w-[1600px] mx-auto w-full animate-fade-in">
      <div className={`${currentTheme.card} rounded-[24px] md:rounded-[32px] p-2 sm:p-4 md:p-6 relative overflow-hidden`}>
        <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>

        <div className="relative z-10 w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1 md:px-0">
            <div>
              <h3 className={`${currentTheme.textPrimary} font-bold text-lg md:text-xl tracking-tight`}>
                Weekly Timetable
              </h3>
              <p className={`${currentTheme.textSecondary} text-xs mt-1`}>
                Showing {dayFilter === 'ALL' ? 'all days' : dayFilter} · {totalClasses} classes
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                className={`px-3 py-1.5 rounded-xl bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-xs font-semibold focus:outline-none`}
              >
                <option value="ALL">All Days</option>
                {days.map((day) => <option key={day} value={day}>{day}</option>)}
              </select>
              <button
                onClick={exportTimetablePdf}
                disabled={exporting}
                className={`px-3 py-1.5 rounded-xl backdrop-blur-md bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-60`}
              >
                {exporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>

          <div className={`min-w-[1040px] grid grid-cols-[84px_repeat(7,minmax(124px,1fr))] gap-px bg-slate-200/80 dark:bg-white/[0.06] rounded-[24px] overflow-hidden ${currentTheme.neoBorder} p-px shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`}>
            <div className={`p-3 text-center font-extrabold text-[10px] uppercase tracking-wider ${currentTheme.bg} ${currentTheme.textSecondary} flex items-center justify-center`}>
              DAY
            </div>
            {periods.map(period => (
              <div key={period} className={`p-3 text-center font-extrabold text-[10px] uppercase tracking-wider ${currentTheme.bg} ${currentTheme.textSecondary}`}>
                PERIOD {period}
              </div>
            ))}

            {visibleDays.map(day => (
              <React.Fragment key={day}>
                <div className={`p-2 font-bold text-[10px] lg:text-xs text-center ${currentTheme.bg} ${currentTheme.textPrimary} flex items-center justify-center border-t border-slate-200/50 dark:border-white/[0.05]`}>
                  {day}
                </div>
                {periods.map(period => {
                  const cell = schedule[day]?.[period];
                  return (
                    <div key={`${day}-${period}`} className={`p-2 min-h-[92px] md:min-h-[98px] flex flex-col justify-center items-center text-center bg-white/60 dark:bg-[#020617]/55 backdrop-blur-3xl transition-colors hover:bg-white/80 dark:hover:bg-[#0b1220]/80 relative group overflow-hidden border-t border-slate-200/50 dark:border-white/[0.05]`}>
                      {cell ? (
                        <div className={`w-full h-full p-2 rounded-xl bg-white/85 dark:bg-gradient-to-b dark:from-slate-900/95 dark:to-slate-950/85 !border border-black/10 dark:!border-blue-400/20 flex flex-col items-center justify-center shadow-sm dark:shadow-[0_0_0_1px_rgba(59,130,246,0.08)]`}>
                          <span className="text-[8px] sm:text-[9px] font-bold uppercase mb-0.5 tracking-wider text-slate-600 dark:text-slate-300">
                            Subject
                          </span>
                          <span className={`text-[10px] md:text-[11px] font-extrabold ${darkMode ? 'text-blue-100' : 'text-slate-900'} ${cell.staff ? 'mb-1.5' : 'mb-0'} leading-snug break-words hyphens-auto text-center`}>
                            {cell.subject}
                          </span>
                          {cell.staff && (
                            <>
                              <span className="text-[8px] sm:text-[9px] font-bold uppercase mb-0.5 tracking-wider mt-0.5 text-slate-600 dark:text-slate-300">
                                Code
                              </span>
                              <span className={`text-[9px] md:text-[10px] font-bold leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
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

const AttendanceContent = ({ currentTheme, darkMode, studentRegNo, authRole }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [exportingPdf, setExportingPdf] = useState(false);

  const attendanceData = ATTENDANCE_DATA;

  const filteredData = attendanceData.filter((row) => {
    if (authRole === 'student' && studentRegNo && row.regNo !== studentRegNo) return false;
    const q = searchText.trim().toLowerCase();
    const matchesSearch = !q || [row.ccode, row.cname, row.fname].some((v) => String(v).toLowerCase().includes(q));
    const matchesRisk =
      riskFilter === 'all' ||
      (riskFilter === 'critical' && isAttendanceRisk(row.percentage)) ||
      (riskFilter === 'safe' && !isAttendanceRisk(row.percentage));
    return matchesSearch && matchesRisk;
  });

  const handleSelectAll = () => setSelectedRows(filteredData.map(d => d.id));
  const handleDeselectAll = () => setSelectedRows([]);

  const handleCheckboxChange = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const getExportData = () => {
    return selectedRows.length > 0
      ? filteredData.filter(d => selectedRows.includes(d.id))
      : filteredData;
  };
  const exportAttendancePdf = async () => {
    const rows = getExportData().map((row) => ({
      subjectCode: row.ccode,
      subjectName: row.cname,
      faculty: row.fname,
      attended: row.attended,
      total: row.total,
      percentage: `${row.percentage.toFixed(2)}%`,
    }));
    try {
      setExportingPdf(true);
      await downloadBlobFile('/api/export/attendance/pdf', { rows }, 'Attendance_Report.pdf');
    } catch (err) {
      alert(err?.message || 'Unable to export attendance PDF.');
    } finally {
      setExportingPdf(false);
    }
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
    if (btn === 'PDF') return exportAttendancePdf;
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
                <option>{filteredData.length}</option>
              </select>
              entries
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative group w-full sm:w-64">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} w-4 h-4 transition-colors group-focus-within:text-blue-500`} />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by subject/faculty..."
                  className={`w-full bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} rounded-xl py-2 pl-9 pr-4 text-sm ${currentTheme.textPrimary} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm`}
                />
              </div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className={`bg-white/50 dark:bg-black/20 ${currentTheme.neoBorder} rounded-xl py-2 px-3 text-xs font-semibold ${currentTheme.textPrimary} focus:outline-none`}
              >
                <option value="all">All</option>
                <option value="critical">Below 75%</option>
                <option value="safe">75% & above</option>
              </select>
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
                {filteredData.map((row) => (
                  <tr key={row.id} className={`transition-colors group ${isAttendanceRisk(row.percentage) ? 'bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 dark:hover:bg-red-500/30 border border-red-500/30' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'}`}>
                    <td className="p-4 text-center">
                      <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} className="w-4 h-4 rounded appearance-none border border-slate-300 dark:border-slate-500 checked:bg-blue-500 checked:border-transparent transition-all cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-1.5 after:top-0.5 after:w-1 after:h-2.5 after:border-white after:border-b-2 after:border-r-2 after:rotate-45" />
                    </td>
                    <td className={`p-4 text-sm font-semibold ${isAttendanceRisk(row.percentage) ? 'text-red-600 dark:text-red-400' : currentTheme.textPrimary}`}>{row.id}</td>
                    <td className={`p-4 text-sm font-bold ${isAttendanceRisk(row.percentage) ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} whitespace-nowrap`}>{row.ccode}</td>
                    <td className={`p-4 text-sm font-semibold ${isAttendanceRisk(row.percentage) ? 'text-red-600 dark:text-red-400' : currentTheme.textPrimary} max-w-[200px] sm:max-w-xs truncate`} title={row.cname}>
                      {row.cname}
                      {isAttendanceRisk(row.percentage) && (
                        <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                          Caution
                        </span>
                      )}
                    </td>
                    <td className={`p-4 text-xs font-bold ${isAttendanceRisk(row.percentage) ? 'text-red-500 dark:text-red-400' : currentTheme.textSecondary} uppercase tracking-wide`}>{row.fname}</td>
                    <td className={`p-4 text-sm font-semibold ${isAttendanceRisk(row.percentage) ? 'text-red-600 dark:text-red-400' : currentTheme.textPrimary} text-center`}>{row.attended}</td>
                    <td className={`p-4 text-sm font-semibold ${isAttendanceRisk(row.percentage) ? 'text-red-500 dark:text-red-400' : currentTheme.textSecondary} text-center`}>{row.total}</td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className={`text-sm font-bold ${isAttendanceRisk(row.percentage) ? 'text-red-500' : 'text-emerald-500'}`}>
                          {row.percentage.toFixed(2)}%
                        </span>
                        <div className="w-16 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden hidden xl:block">
                          <div
                            className={`h-full rounded-full ${isAttendanceRisk(row.percentage) ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}
                            style={{ width: `${row.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button className={`px-3 py-1.5 rounded-lg ${isAttendanceRisk(row.percentage) ? 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white'} text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm`}>
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
            <p className={`${currentTheme.textSecondary} text-xs font-medium`}>Showing 1 to {filteredData.length} of {filteredData.length} entries</p>
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
          {exportingPdf && (
            <p className="text-xs mt-3 text-blue-500 font-medium">Preparing attendance PDF...</p>
          )}

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

const SubjectRegistrationContent = ({ currentTheme, darkMode }) => {
  const [courses, setCourses] = useState([
    { id: 'SUB101', title: 'Cloud Computing Fundamentals', credits: 3, faculty: 'Dr. Karthik M', seats: 8, selected: false },
    { id: 'SUB205', title: 'Data Visualization Studio', credits: 2, faculty: 'Ms. Priya R', seats: 2, selected: false },
    { id: 'SUB309', title: 'Cyber Security Essentials', credits: 3, faculty: 'Mr. Aravind S', seats: 0, selected: false },
    { id: 'SUB412', title: 'Mobile App Prototyping', credits: 2, faculty: 'Ms. Nivetha P', seats: 6, selected: false },
  ]);
  const [flash, setFlash] = useState('');

  const toggleCourse = (id) => {
    setCourses((prev) => prev.map((course) => {
      if (course.id !== id) return course;
      if (!course.selected && course.seats <= 0) return course;
      return { ...course, selected: !course.selected, seats: course.selected ? course.seats + 1 : course.seats - 1 };
    }));
  };

  const selectedCourses = courses.filter((c) => c.selected);
  const selectedCredits = selectedCourses.reduce((acc, c) => acc + c.credits, 0);

  const saveRegistration = () => {
    localStorage.setItem('student_subject_registration', JSON.stringify(selectedCourses));
    setFlash('Subject registration updated successfully.');
    window.setTimeout(() => setFlash(''), 2200);
  };

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-7xl mx-auto w-full animate-fade-in space-y-6">
      <div className={`${currentTheme.card} rounded-[24px] p-6 border ${currentTheme.neoBorder}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={`${currentTheme.textPrimary} text-2xl font-bold`}>My Subject Registration</h2>
            <p className={`${currentTheme.textSecondary} text-sm mt-1`}>Choose elective subjects and confirm your semester plan.</p>
          </div>
          <div className={`px-4 py-2 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
            <p className={`${currentTheme.textPrimary} text-sm font-semibold`}>Selected: {selectedCourses.length} · Credits: {selectedCredits}</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {courses.map((course) => (
            <div key={course.id} className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={`${currentTheme.textPrimary} font-semibold`}>{course.title}</p>
                  <p className={`${currentTheme.textSecondary} text-xs mt-1`}>{course.id} · {course.faculty} · {course.credits} credits</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${course.seats > 0 ? 'text-emerald-500' : 'text-red-500'}`}>Seats: {course.seats}</span>
                  <button
                    onClick={() => toggleCourse(course.id)}
                    disabled={!course.selected && course.seats <= 0}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${course.selected ? 'bg-red-500/15 text-red-500' : 'bg-blue-600 text-white disabled:opacity-50'}`}
                  >
                    {course.selected ? 'Drop' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder} h-fit`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-3`}>Registration Summary</h3>
          {selectedCourses.length > 0 ? (
            <div className="space-y-2">
              {selectedCourses.map((course) => (
                <div key={course.id} className={`p-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
                  <p className={`${currentTheme.textPrimary} text-sm font-semibold`}>{course.id}</p>
                  <p className={`${currentTheme.textSecondary} text-xs`}>{course.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${currentTheme.textSecondary} text-sm`}>No subjects selected yet.</p>
          )}
          <button onClick={saveRegistration} className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold">Save Registration</button>
          {flash && <p className="text-xs text-emerald-500 font-semibold mt-2">{flash}</p>}
        </div>
      </div>
    </div>
  );
};

const GradeBookContent = ({ currentTheme, darkMode }) => {
  const grades = [
    { code: 'CS23411', subject: 'Database Management Systems', internal: 89, grade: 'A', credits: 4 },
    { code: 'CS23413', subject: 'Theory of Computation', internal: 84, grade: 'A', credits: 3 },
    { code: 'CS23414', subject: 'Software Development Practices', internal: 82, grade: 'A', credits: 3 },
    { code: 'CS23431', subject: 'Design and Analysis of Algorithms', internal: 79, grade: 'B+', credits: 4 },
  ];
  const gradePointMap = { 'A+': 10, A: 9, 'B+': 8, B: 7, C: 6 };
  const credits = grades.reduce((acc, g) => acc + g.credits, 0);
  const sgpa = (grades.reduce((acc, g) => acc + ((gradePointMap[g.grade] || 0) * g.credits), 0) / credits).toFixed(2);

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-6xl mx-auto w-full animate-fade-in space-y-6">
      <div className={`${currentTheme.card} rounded-[24px] p-6 border ${currentTheme.neoBorder}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Grade Book</h2>
          <div className="flex gap-2">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`}>Credits: {credits}</span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-500">SGPA: {sgpa}</span>
          </div>
        </div>
      </div>
      <div className={`${currentTheme.card} rounded-[24px] p-4 md:p-6 border ${currentTheme.neoBorder}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${currentTheme.border}`}>
                <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Code</th>
                <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Subject</th>
                <th className={`p-3 text-center text-xs uppercase ${currentTheme.textSecondary}`}>Internal</th>
                <th className={`p-3 text-center text-xs uppercase ${currentTheme.textSecondary}`}>Credits</th>
                <th className={`p-3 text-center text-xs uppercase ${currentTheme.textSecondary}`}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((row) => (
                <tr key={row.code} className={`border-b ${currentTheme.border}`}>
                  <td className="p-3 text-blue-600 dark:text-blue-400 font-semibold">{row.code}</td>
                  <td className={`p-3 ${currentTheme.textPrimary}`}>{row.subject}</td>
                  <td className={`p-3 text-center ${currentTheme.textPrimary}`}>{row.internal}</td>
                  <td className={`p-3 text-center ${currentTheme.textPrimary}`}>{row.credits}</td>
                  <td className="p-3 text-center"><span className="px-2 py-1 rounded-lg bg-blue-500/15 text-blue-500 text-xs font-semibold">{row.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MessagesContent = ({ currentTheme, darkMode }) => {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Dept Office', subject: 'Fee receipt available', time: 'Today', unread: true },
    { id: 2, from: 'Class Advisor', subject: 'Project review at 2 PM', time: 'Yesterday', unread: false },
  ]);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [{ id: Date.now(), from: 'You', subject: draft.trim(), time: 'Now', unread: false }, ...prev]);
    setDraft('');
  };

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-6xl mx-auto w-full animate-fade-in space-y-6">
      <div className={`${currentTheme.card} rounded-[24px] p-6 border ${currentTheme.neoBorder}`}>
        <h2 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Messages</h2>
        <p className={`${currentTheme.textSecondary} text-sm mt-1`}>Stay updated with department and advisor communication.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className={`lg:col-span-2 ${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder} space-y-2`}>
          {messages.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} flex items-center justify-between`}>
              <div>
                <p className={`${currentTheme.textPrimary} text-sm font-semibold`}>{msg.subject}</p>
                <p className={`${currentTheme.textSecondary} text-xs`}>{msg.from}</p>
              </div>
              <div className="text-right">
                <p className={`${currentTheme.textSecondary} text-xs`}>{msg.time}</p>
                {msg.unread && <span className="text-[10px] text-red-500 font-semibold">Unread</span>}
              </div>
            </div>
          ))}
        </div>
        <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}>
          <h3 className={`${currentTheme.textPrimary} font-semibold mb-2`}>Quick Message</h3>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            placeholder="Write to class advisor..."
            className={`w-full p-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-sm`}
          />
          <button onClick={sendMessage} className="w-full mt-3 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">Send</button>
        </div>
      </div>
    </div>
  );
};

const StudentChangePasswordContent = ({ currentTheme, darkMode }) => {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [status, setStatus] = useState('');

  const updatePassword = (e) => {
    e.preventDefault();
    if (newPwd.length < 8) {
      setStatus('New password must be at least 8 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setStatus('New password and confirm password do not match.');
      return;
    }
    setStatus('Password updated successfully.');
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-3xl mx-auto w-full animate-fade-in">
      <div className={`${currentTheme.card} rounded-[24px] p-6 md:p-8 border ${currentTheme.neoBorder}`}>
        <h2 className={`${currentTheme.textPrimary} text-2xl font-bold mb-2`}>Change Password</h2>
        <p className={`${currentTheme.textSecondary} text-sm mb-6`}>Use a strong password with minimum 8 characters.</p>
        <form onSubmit={updatePassword} className="space-y-4">
          <div>
            <label className={`text-xs font-bold uppercase ${currentTheme.textSecondary}`}>Current Password</label>
            <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className={`w-full mt-1 px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
          </div>
          <div>
            <label className={`text-xs font-bold uppercase ${currentTheme.textSecondary}`}>New Password</label>
            <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={`w-full mt-1 px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
          </div>
          <div>
            <label className={`text-xs font-bold uppercase ${currentTheme.textSecondary}`}>Confirm Password</label>
            <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className={`w-full mt-1 px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold">Update Password</button>
          {status && <p className={`text-sm font-medium ${status.includes('successfully') ? 'text-emerald-500' : 'text-red-500'}`}>{status}</p>}
        </form>
      </div>
    </div>
  );
};

const CgpaCalculatorContent = ({ currentTheme, darkMode }) => {
  const [semesters, setSemesters] = useState([
    { id: 1, gpa: '', credits: '22' },
    { id: 2, gpa: '', credits: '21' },
    { id: 3, gpa: '', credits: '20' },
    { id: 4, gpa: '', credits: '19' },
  ]);

  const updateSemester = (id, key, value) => {
    setSemesters((prev) => prev.map((sem) => (sem.id === id ? { ...sem, [key]: value } : sem)));
  };

  const addSemester = () => {
    setSemesters((prev) => [...prev, { id: prev.length + 1, gpa: '', credits: '20' }]);
  };

  const resetAll = () => {
    setSemesters((prev) => prev.map((sem) => ({ ...sem, gpa: '' })));
  };

  const totals = semesters.reduce(
    (acc, sem) => {
      const gpa = Number(sem.gpa);
      const credits = Number(sem.credits);
      if (Number.isFinite(gpa) && Number.isFinite(credits) && gpa > 0 && credits > 0) {
        acc.weighted += gpa * credits;
        acc.credits += credits;
      }
      return acc;
    },
    { weighted: 0, credits: 0 }
  );

  const cgpa = totals.credits > 0 ? (totals.weighted / totals.credits).toFixed(2) : '0.00';

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-5xl mx-auto w-full animate-fade-in space-y-6">
      <div className={`${currentTheme.card} rounded-[24px] p-6 border ${currentTheme.neoBorder}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={`${currentTheme.textPrimary} text-2xl font-bold`}>CGPA Calculator</h2>
            <p className={`${currentTheme.textSecondary} text-sm mt-1`}>Enter semester GPA and credits to compute cumulative CGPA.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-500 text-sm font-semibold">CGPA: {cgpa}</span>
            <button onClick={resetAll} className="px-3 py-1.5 rounded-xl bg-red-500/15 text-red-500 text-xs font-semibold">Reset</button>
          </div>
        </div>
      </div>

      <div className={`${currentTheme.card} rounded-[24px] p-4 md:p-6 border ${currentTheme.neoBorder}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className={`border-b ${currentTheme.border}`}>
                <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Semester</th>
                <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>GPA (0-10)</th>
                <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Credits</th>
                <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Weighted</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((sem) => {
                const gpa = Number(sem.gpa) || 0;
                const credits = Number(sem.credits) || 0;
                const weighted = (gpa * credits).toFixed(2);
                return (
                  <tr key={sem.id} className={`border-b ${currentTheme.border}`}>
                    <td className={`p-3 ${currentTheme.textPrimary} font-semibold`}>Sem {sem.id}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={sem.gpa}
                        onChange={(e) => updateSemester(sem.id, 'gpa', e.target.value)}
                        placeholder="e.g. 8.42"
                        className={`w-full px-3 py-2 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        max="40"
                        step="1"
                        value={sem.credits}
                        onChange={(e) => updateSemester(sem.id, 'credits', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`}
                      />
                    </td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 font-semibold">{weighted}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
          <button onClick={addSemester} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
            Add Semester
          </button>
          <p className={`${currentTheme.textSecondary} text-xs`}>
            Total Credits Counted: <span className={`${currentTheme.textPrimary} font-semibold`}>{totals.credits}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const SWOT_API_BASE = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? '' : 'http://127.0.0.1:5001');

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const downloadBlobFile = async (endpoint, payload, filenameFallback) => {
  const res = await fetch(`${SWOT_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || 'Download failed');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filenameFallback;
  a.click();
  URL.revokeObjectURL(url);
};

const SwotAnalysisContent = ({ currentTheme, darkMode, studentEmail }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingReport, setDownloadingReport] = useState(false);
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

  const downloadReportPdf = async () => {
    try {
      setDownloadingReport(true);
      const res = await fetch(`${SWOT_API_BASE}/api/export/report/pdf?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || 'Unable to export report.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Student_SWOT_Report.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err?.message || 'Unable to export report.');
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div className="p-4 md:p-10 md:pt-4 max-w-7xl mx-auto w-full animate-fade-in space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-1 h-8 rounded-full bg-blue-500" />
          <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>My SWOT Analysis</h1>
          {data.overallGrade && <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${gradeBg(data.overallGrade)} ${gradeColor(data.overallGrade)}`}>{data.overallGrade}</span>}
          {data.avgMark && <span className={`${currentTheme.textSecondary} text-sm font-medium`}>Avg: {data.avgMark}</span>}
        </div>
        <button
          onClick={downloadReportPdf}
          disabled={downloadingReport}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {downloadingReport ? 'Exporting...' : 'Export Report PDF'}
        </button>
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
  const [quickLoginMode, setQuickLoginMode] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      pushAuditLog({ actor: userId, type: 'login_success', message: 'Admin login success' });
      onSignIn({ role: 'admin' });
    } else if (userId === HOD_USERNAME && password === HOD_PASSWORD) {
      pushAuditLog({ actor: userId, type: 'login_success', message: 'HOD login success' });
      onSignIn({ role: 'hod' });
    } else if (userId === TEACHER_USERNAME && password === TEACHER_PASSWORD) {
      pushAuditLog({ actor: userId, type: 'login_success', message: 'Teacher login success' });
      onSignIn({ role: 'teacher' });
    } else if ((userId === '2117240020033' && password === '0123456789') || (password === userId && STUDENT_EMAIL_BY_ROLL[userId])) {
      pushAuditLog({ actor: userId, type: 'login_success', message: 'Student login success' });
      onSignIn({ role: 'student', email: STUDENT_EMAIL_BY_ROLL[userId] || null, name: STUDENT_NAME_BY_ROLL[userId] || 'Student', regNo: userId });
    } else {
      pushAuditLog({ actor: userId || 'unknown', type: 'login_failed', message: 'Invalid login attempt' });
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
      pushAuditLog({ actor: email, type: 'login_success', message: 'Student Google login success' });
      onSignIn({ role: 'student', email });
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

  const handleQuickLogin = (mode) => {
    setError('');
    setQuickLoginMode(mode);

    // Short preloader gives immediate feedback for faster dev flow.
    window.setTimeout(() => {
      if (mode === 'admin') {
        pushAuditLog({ actor: ADMIN_USERNAME, type: 'login_success', message: 'Admin quick login success' });
        onSignIn({ role: 'admin' });
      } else if (mode === 'hod') {
        pushAuditLog({ actor: HOD_USERNAME, type: 'login_success', message: 'HOD quick login success' });
        onSignIn({ role: 'hod' });
      } else {
        pushAuditLog({ actor: '2117240020033', type: 'login_success', message: 'Student quick login success' });
        onSignIn({ role: 'student', email: STUDENT_EMAIL_BY_ROLL['2117240020033'] || null, name: STUDENT_NAME_BY_ROLL['2117240020033'] || 'Arvind N', regNo: '2117240020033' });
      }
      setQuickLoginMode(null);
    }, 350);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans text-slate-900 bg-slate-100/80 dark:bg-[#0a0a0a]">
      {/* Glassmorphism background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 dark:bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 dark:bg-indigo-500/10 blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-white/5 dark:bg-white/[0.02] blur-3xl"></div>
      </div>
      <div className="max-w-5xl w-full relative z-10 grid lg:grid-cols-[1fr_1.1fr] gap-4 animate-fade-in">
        <div className="hidden lg:flex rounded-[32px] p-10 bg-gradient-to-br from-blue-700 to-indigo-700 text-white shadow-[0_20px_60px_rgba(37,99,235,0.35)]">
          <div className="my-auto">
            <img src="/RIT WHITE LOGO.png" alt="RIT IMS" className="w-auto h-16 object-contain mb-6" />
            <h2 className="text-3xl font-black tracking-tight">RIT IMS Portal</h2>
            <p className="text-blue-100/90 text-sm mt-3 max-w-sm">
              Smart access for Students, HOD, Teachers, and Admin with analytics, attendance insights, and secure workflows.
            </p>
          </div>
        </div>
        {/* Glassmorphism card */}
        <div className="relative bg-white/40 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)_inset] rounded-[32px] p-6 md:p-8 lg:p-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/10 dark:from-white/[0.08] dark:to-transparent opacity-90" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent" />
          <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <img src="/RIT WHITE LOGO.png" alt="RIT IMS" className="w-auto h-20 object-contain" />
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
                  disabled={googleLoading || quickLoginMode !== null}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                disabled={quickLoginMode !== null}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold tracking-wide shadow-[0_8px_22px_rgba(5,150,105,0.3)] transition-all"
              >
                {quickLoginMode === 'student' ? 'Loading Student…' : 'Student Login'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('hod')}
                disabled={quickLoginMode !== null}
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold tracking-wide shadow-[0_8px_22px_rgba(217,119,6,0.3)] transition-all"
              >
                {quickLoginMode === 'hod' ? 'Loading HOD…' : 'HOD Login'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={quickLoginMode !== null}
                className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold tracking-wide shadow-[0_8px_22px_rgba(124,58,237,0.3)] transition-all"
              >
                {quickLoginMode === 'admin' ? 'Loading Admin…' : 'Admin Login'}
              </button>
            </div>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 -mt-2">
              Quick preloader login buttons for faster developer testing.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); setError(''); }}
                disabled={quickLoginMode !== null}
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
                disabled={quickLoginMode !== null}
                placeholder="Enter your password"
                className="w-full bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-2xl py-4 px-5 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all shadow-sm"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-semibold text-center animate-fade-in">{error}</p>}

            <button
              type="submit"
              disabled={quickLoginMode !== null}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 border border-white/20"
            >
              Sign In
            </button>

            <div className="pt-4 border-t border-white/30 dark:border-white/10">
              <button
                type="button"
                onClick={() => { setAdminLoginMode(!adminLoginMode); setError(''); }}
                disabled={quickLoginMode !== null}
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
    </div>
  );
};

// RIT Digital Twin | Smart Campus - Admin Panel (reference-based design)
const ADMIN_NAV = [
  { id: 'hodDashboard', label: 'HOD Dashboard', icon: LayoutDashboard },
  { id: 'adminDashboard', label: 'Admin Dashboard', icon: ShieldCheck },
  { id: 'userMgmt', label: 'User Management', icon: Users },
  { id: 'systemControl', label: 'System Control', icon: Settings },
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

const IMS_SECURITY_V2 = {
  blockchain_layer: {
    technology: 'Hyperledger Fabric / Private Ethereum',
    consensus: 'Proof of Authority (PoA)',
    core_function: 'Immutable Audit Logging',
    data_to_chain: [
      'User_Access_Logs',
      'Record_Modifications',
      'Data_Exfiltration_Attempts',
    ],
  },
  prevention_system: {
    mechanism: 'Honeypot & Smart Contract Validation',
    features: {
      integrity_check: 'Every data request compares DB Hash vs. Blockchain Hash',
      access_control: 'Multi-signature approval for bulk data exports',
      honey_tokens: 'Decoy data records that trigger alarms if accessed',
    },
  },
  attacking_system_simulator: {
    purpose: 'Security Validation & Stress Testing',
    attack_vectors: [
      'SQL_Injection_Simulation',
      'Brute_Force_Attempt',
      'Unauthorized_API_Fetch',
    ],
    detection_logic: 'AI-based Anomaly Detection (GSAP/Three.js visualized)',
  },
  admin_dashboard_integration: {
    visuals: {
      blockchain_health: 'Live node status and block height',
      prevention_map: 'Real-time globe showing blocked IP origins',
      threat_level: 'Dynamic meter based on failed hash validations',
    },
    actions: [
      'Rollback to last verified Block',
      'Revoke compromised node credentials',
      'Export tamper-proof audit reports',
    ],
  },
};

const AdminPanel = ({ onLogout, darkMode, themeMode, onThemeModeChange, role = 'admin' }) => {
  const [activeSection, setActiveSection] = useState(role === 'hod' ? 'hodDashboard' : 'adminDashboard');
  const [navSearch, setNavSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [latestAlertId, setLatestAlertId] = useState(null);
  const [hasAlertBaseline, setHasAlertBaseline] = useState(false);
  const [liveAlert, setLiveAlert] = useState(null);
  const currentTheme = darkMode ? themes.dark : themes.light;
  const API_BASE = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? '' : 'http://127.0.0.1:5001');
  const adminToken = localStorage.getItem('ADMIN_API_TOKEN') || '';
  const visibleNav = ADMIN_NAV.filter((item) => {
    if (role === 'hod') return ['hodDashboard', 'swot', 'audit', 'classroom', 'results', 'directory', 'password'].includes(item.id);
    if (role === 'teacher') return ['classroom', 'swot', 'results', 'password'].includes(item.id);
    return true;
  });

  useEffect(() => {
    let cancelled = false;
    const pollAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/security/alerts?limit=20`, {
          headers: adminToken ? { 'X-Admin-Token': adminToken } : {},
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.alerts || cancelled) return;
        const alerts = data.alerts;
        setSecurityAlerts(alerts);
        const newestId = alerts[0]?.id || null;
        if (!hasAlertBaseline) {
          setLatestAlertId(newestId);
          setHasAlertBaseline(true);
        } else if (newestId && newestId !== latestAlertId) {
          setLatestAlertId(newestId);
          setLiveAlert(alerts[0]);
        }
      } catch {
        // Keep admin panel usable if alerts endpoint is offline.
      }
    };

    pollAlerts();
    const timer = window.setInterval(pollAlerts, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [API_BASE, hasAlertBaseline, latestAlertId, adminToken]);

  return (
    <div className={`theme-smooth min-h-screen ${currentTheme.bg} font-sans flex`}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[100px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-50/50 blur-[100px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-900/20 blur-[120px] transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/35 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Glassmorphic Sidebar */}
      <aside className={`w-[280px] flex-shrink-0 fixed h-full z-50 flex flex-col transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${currentTheme.sidebar}`}>
        <div className="p-5 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <img src="/RIT WHITE LOGO.png" alt="RIT IMS" className="w-auto h-10 object-contain" />
            <span className={`text-base font-bold ${currentTheme.textPrimary}`}>RIT Admin</span>
          </div>
          <p className={`text-[11px] uppercase tracking-wider ${currentTheme.textSecondary}`}>Rajalakshmi Institute of Technology</p>
        </div>
        <div className="p-4 border-b border-white/20 dark:border-white/10">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${currentTheme.textSecondary}`} />
            <input
              type="text"
              placeholder="Search functionalities..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-sm ${currentTheme.card} ${currentTheme.neoBorder} ${currentTheme.textPrimary} placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {visibleNav.filter(n => !navSearch || n.label.toLowerCase().includes(navSearch.toLowerCase())).map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl text-left text-sm transition-all ${isActive ? `${currentTheme.sidebarActive} scale-[1.01]` : `${currentTheme.sidebarText} hover:bg-white/40 dark:hover:bg-white/[0.06]`}`}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/20 dark:border-white/10">
          <div onClick={onLogout} className={`flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 ${currentTheme.textSecondary} hover:text-red-500 cursor-pointer transition-colors group ${currentTheme.neoBorder}`}>
            <span className="text-sm font-semibold tracking-wide">Logout</span>
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </aside>

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:ml-[280px] min-h-screen">
        {/* RIT-style Header */}
        <header className={`sticky top-0 z-40 ${currentTheme.headerBg} backdrop-blur-2xl border-b ${currentTheme.border} px-4 md:px-8 h-20 flex items-center justify-between`}>
          <button onClick={() => setSidebarOpen(true)} className={`md:hidden p-2 rounded-lg ${currentTheme.card} ${currentTheme.neoBorder}`}><Menu size={24} className={currentTheme.textPrimary} /></button>
          <div className="flex items-center gap-3">
            <img src="/RIT WHITE LOGO.png" alt="RIT IMS" className="w-auto h-9 object-contain" />
            <span className={`font-bold text-sm md:text-base tracking-tight ${currentTheme.textPrimary}`}>RAJALAKSHMI INSTITUTE OF TECHNOLOGY</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setActiveSection('audit')}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.neoBorder} text-xs font-semibold ${currentTheme.textPrimary}`}
            >
              <AlertTriangle size={14} className={securityAlerts.length ? 'text-red-500' : 'text-emerald-500'} />
              {securityAlerts.length ? `${securityAlerts.length} live alerts` : 'Security stable'}
            </button>
            <ThemeModeToggle
              themeMode={themeMode}
              onThemeModeChange={onThemeModeChange}
              currentTheme={currentTheme}
            />
            <button className={`p-2.5 rounded-lg ${currentTheme.card} ${currentTheme.neoBorder} ${currentTheme.textPrimary} relative`}>
              <Bell size={18} />
              {securityAlerts.length > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {Math.min(securityAlerts.length, 99)}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>
            <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.neoBorder}`}>
              <User size={18} className={currentTheme.textSecondary} />
              <span className={`text-xs font-semibold ${currentTheme.textPrimary}`}>ADMIN@RITCHENNAI.EDU.IN</span>
            </div>
            <button className="hidden sm:flex px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold items-center gap-2 shadow-[0_6px_18px_rgba(37,99,235,0.25)]">
              <MessageSquare size={16} /> Chat
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <AdminContentSection section={activeSection} currentTheme={currentTheme} darkMode={darkMode} onLogout={onLogout} securityAlerts={securityAlerts} role={role} />
        </main>
      </div>
      {liveAlert && (
        <div className="fixed right-6 bottom-6 z-[60] max-w-sm animate-fade-in">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl p-4 shadow-[0_14px_34px_rgba(239,68,68,0.22)]">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-400 mt-0.5" />
              <div>
                <p className="text-red-300 font-bold text-sm">Attack attempt detected</p>
                <p className="text-red-100/90 text-xs mt-1">{liveAlert.message}</p>
                <p className="text-red-200/70 text-[11px] mt-1">{liveAlert.method} {liveAlert.path} · {liveAlert.ip}</p>
              </div>
            </div>
            <button onClick={() => setLiveAlert(null)} className="mt-3 text-xs font-semibold text-red-200 hover:text-white transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Content sections based on RIT reference images
const AdminContentSection = ({ section, currentTheme, darkMode, onLogout, securityAlerts = [], role = 'admin' }) => {
  const [swotRunning, setSwotRunning] = useState(false);
  const [swotMessage, setSwotMessage] = useState(null);
  const [swotFile, setSwotFile] = useState(null);
  const [classDashboard, setClassDashboard] = useState(null);
  const [allStudents, setAllStudents] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [studentDetailLoading, setStudentDetailLoading] = useState(false);
  const [predictEmail, setPredictEmail] = useState('aarav.sharma@example.com');
  const [predictCourseId, setPredictCourseId] = useState('CS23414');
  const [predictResult, setPredictResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [securityConfig, setSecurityConfig] = useState(IMS_SECURITY_V2);
  const [securityConfigLoading, setSecurityConfigLoading] = useState(false);
  const [routeQuery, setRouteQuery] = useState('');
  const [userRecords, setUserRecords] = useState(() => {
    const stored = localStorage.getItem('ims_users');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: 'Dr. Kavitha', role: 'HOD', dept: 'CSE', email: 'hod.cse@rit.edu' },
      { id: 2, name: 'Mr. Aravind', role: 'Teacher', dept: 'CSE', email: 'teacher.cse@rit.edu' },
    ];
  });
  const [newUser, setNewUser] = useState({ name: '', role: 'Teacher', dept: 'CSE', email: '' });
  const [auditLogs, setAuditLogs] = useState(() => JSON.parse(localStorage.getItem('ims_audit_logs') || '[]'));
  const [attendanceLockHours, setAttendanceLockHours] = useState(() => localStorage.getItem('attendance_lock_hours') || '24');
  const [hodSearch, setHodSearch] = useState('');
  
  const API_BASE = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.PROD ? '' : 'http://127.0.0.1:5001');
  const adminToken = localStorage.getItem('ADMIN_API_TOKEN') || '';
  const adminHeaders = adminToken ? { 'X-Admin-Token': adminToken } : {};
  const adminFetch = (url, options = {}) => {
    const mergedHeaders = { ...(options.headers || {}), ...adminHeaders };
    return fetch(url, { ...options, headers: mergedHeaders });
  };
  const canEditUsers = role === 'admin';
  const isReadOnlyDataRole = role === 'admin';

  useEffect(() => {
    localStorage.setItem('ims_users', JSON.stringify(userRecords));
  }, [userRecords]);

  useEffect(() => {
    localStorage.setItem('attendance_lock_hours', String(attendanceLockHours));
  }, [attendanceLockHours]);

  useEffect(() => {
    let cancelled = false;
    const loadSecurityConfig = async () => {
      setSecurityConfigLoading(true);
      try {
        const res = await adminFetch(`${API_BASE}/api/security/ims-v2`);
        const data = await res.json().catch(() => null);
        if (!cancelled && res.ok && data?.ims_security_v2) {
          setSecurityConfig(data.ims_security_v2);
        }
      } catch {
        // Keep frontend fallback if backend is offline.
      } finally {
        if (!cancelled) setSecurityConfigLoading(false);
      }
    };
    loadSecurityConfig();
    return () => { cancelled = true; };
  }, []);

  const triggerMechanics = async () => {
    if (!predictEmail || !predictCourseId) return;
    setIsPredicting(true);
    setPredictResult(null);
    try {
      const res = await adminFetch(`${API_BASE}/api/swot/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: predictEmail, courseId: predictCourseId })
      });
      const data = await res.json();
      setPredictResult(data);
    } catch (e) {
      setPredictResult({ error: 'Mechanics offline or unreachable' });
    }
    setIsPredicting(false);
  };
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
      const res = await adminFetch(`${API_BASE}/api/swot/run`, {
        method: 'POST',
        body: useFile ? formData : JSON.stringify({ useDefault: true }),
        headers: useFile ? adminHeaders : { 'Content-Type': 'application/json', ...adminHeaders },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSwotMessage({ type: 'success', text: `Analysis complete. Results available for ${data.studentCount || 0} students.` });
        // Auto-fetch dashboard and student list
        const [dashRes, studRes] = await Promise.all([
          adminFetch(`${API_BASE}/api/swot/class-dashboard`).then(r => r.json()).catch(() => null),
          adminFetch(`${API_BASE}/api/swot/all-students`).then(r => r.json()).catch(() => null),
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
      const res = await adminFetch(`${API_BASE}/api/swot/result?email=${encodeURIComponent(email)}`);
      const data = await res.json().catch(() => null);
      if (res.ok && data) setStudentDetail(data);
      else setStudentDetail(null);
    } catch { setStudentDetail(null); }
    setStudentDetailLoading(false);
  };

  const addUserRecord = () => {
    if (!canEditUsers || !newUser.name || !newUser.email) return;
    setUserRecords((prev) => [{ id: Date.now(), ...newUser }, ...prev]);
    pushAuditLog({ actor: 'admin', type: 'user_role_write', message: `Added ${newUser.role}: ${newUser.name}` });
    setAuditLogs(JSON.parse(localStorage.getItem('ims_audit_logs') || '[]'));
    setNewUser({ name: '', role: 'Teacher', dept: 'CSE', email: '' });
  };

  const removeUserRecord = (id) => {
    if (!canEditUsers) return;
    setUserRecords((prev) => prev.filter((u) => u.id !== id));
    pushAuditLog({ actor: 'admin', type: 'user_role_write', message: `Removed user id ${id}` });
    setAuditLogs(JSON.parse(localStorage.getItem('ims_audit_logs') || '[]'));
  };

  const riskStudents = ATTENDANCE_DATA.filter((row) => isAttendanceRisk(row.percentage));
  const sectionBuckets = ATTENDANCE_DATA.reduce((acc, row) => {
    const key = row.section;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
  const sectionTrendData = Object.entries(sectionBuckets).map(([sectionName, rows]) => ({
    sectionName,
    avgAttendance: Math.round((rows.reduce((a, b) => a + b.percentage, 0) / rows.length) * 10) / 10,
    riskCount: rows.filter((r) => isAttendanceRisk(r.percentage)).length,
  }));
  const filteredRiskStudents = riskStudents.filter((row) => {
    const q = hodSearch.trim().toLowerCase();
    return !q || row.regNo.toLowerCase().includes(q) || row.fname.toLowerCase().includes(q);
  });

  if (section === 'hodDashboard') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>HOD Dashboard</h1>
            <p className={`${currentTheme.textSecondary} text-sm mt-1`}>Department attendance control center with at-risk analytics.</p>
          </div>
          <div className={`px-3 py-2 rounded-xl ${currentTheme.card} ${currentTheme.neoBorder} text-xs ${currentTheme.textPrimary}`}>Department: CSE</div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Total Students</p><p className={`${currentTheme.textPrimary} text-xl font-bold`}>{ATTENDANCE_DATA.length}</p></div>
          <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>At Risk (&lt;75%)</p><p className="text-red-500 text-xl font-bold">{riskStudents.length}</p></div>
          <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Sections</p><p className={`${currentTheme.textPrimary} text-xl font-bold`}>{Object.keys(sectionBuckets).length}</p></div>
          <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Avg Attendance</p><p className={`${currentTheme.textPrimary} text-xl font-bold`}>{Math.round((ATTENDANCE_DATA.reduce((a, b) => a + b.percentage, 0) / ATTENDANCE_DATA.length) * 10) / 10}%</p></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-3`}>Staff Timetable Completion</h3>
            <div className="space-y-2">
              {['PANDIARAJAN T.', 'SOWMYA S', 'ARAVINDH S', 'MURUGAN P'].map((name, i) => (
                <div key={name} className={`p-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} flex justify-between`}>
                  <span className={currentTheme.textPrimary}>{name}</span>
                  <span className={`text-xs font-semibold ${i % 2 === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>{i % 2 === 0 ? 'Completed' : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-3`}>Attendance Trend by Section</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sectionTrendData}>
                <XAxis dataKey="sectionName" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="avgAttendance" fill="#3b82f6" name="Avg %" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${currentTheme.textPrimary} font-bold`}>Students at Risk (&lt;75%)</h3>
            <span className="text-red-500 text-xs font-semibold">{filteredRiskStudents.length} students</span>
          </div>
          <div className="mb-3">
            <input
              value={hodSearch}
              onChange={(e) => setHodSearch(e.target.value)}
              placeholder="Search register no or staff id/name..."
              className={`w-full sm:w-80 px-3 py-2 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-sm`}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead><tr className={`border-b ${currentTheme.border}`}><th className="p-3 text-left">Reg No</th><th className="p-3 text-left">Student</th><th className="p-3 text-left">Staff</th><th className="p-3 text-left">Section</th><th className="p-3 text-left">Attendance</th></tr></thead>
              <tbody>
                {filteredRiskStudents.map((s) => (
                  <tr key={s.id} className={`border-b ${currentTheme.border}`}>
                    <td className={`p-3 ${currentTheme.textSecondary}`}>{s.regNo}</td>
                    <td className={`p-3 ${currentTheme.textPrimary}`}>{s.cname}</td>
                    <td className={`p-3 ${currentTheme.textSecondary}`}>{s.fname}</td>
                    <td className={`p-3 ${currentTheme.textSecondary}`}>{s.section}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-lg bg-red-500/15 text-red-500 text-xs font-semibold">{s.percentage}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'adminDashboard') {
    const presentToday = ATTENDANCE_DATA.reduce((acc, row) => acc + row.attended, 0);
    const totalToday = ATTENDANCE_DATA.reduce((acc, row) => acc + row.total, 0);
    const presentPercent = calculateAttendancePercentage(presentToday, totalToday);
    return (
      <div className="space-y-6">
        <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Admin Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Total Students</p><p className={`${currentTheme.textPrimary} text-2xl font-bold`}>{ATTENDANCE_DATA.length}</p></div>
          <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Present Today (Aggregate)</p><p className={`${currentTheme.textPrimary} text-2xl font-bold`}>{presentPercent}%</p></div>
          <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Data Access</p><p className={`${currentTheme.textPrimary} text-sm font-semibold mt-2`}>Read-only for attendance and marks</p></div>
        </div>
      </div>
    );
  }

  if (section === 'userMgmt') {
    return (
      <div className="space-y-6">
        <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>User Management</h1>
        <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
          <p className={`${currentTheme.textSecondary} text-sm mb-4`}>Admin can manage role assignments for HOD and teachers.</p>
          <div className="grid md:grid-cols-4 gap-3 mb-4">
            <input value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className={`px-3 py-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
            <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} className={`px-3 py-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`}><option>Teacher</option><option>HOD</option></select>
            <input value={newUser.dept} onChange={(e) => setNewUser((p) => ({ ...p, dept: e.target.value }))} placeholder="Department" className={`px-3 py-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
            <input value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className={`px-3 py-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
          </div>
          <button onClick={addUserRecord} disabled={!canEditUsers} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-60">Add User</button>
        </div>
        <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className={`border-b ${currentTheme.border}`}><th className="p-3 text-left">Name</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Dept</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Action</th></tr></thead>
              <tbody>
                {userRecords.map((u) => (
                  <tr key={u.id} className={`border-b ${currentTheme.border}`}>
                    <td className={`p-3 ${currentTheme.textPrimary}`}>{u.name}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-lg bg-blue-500/15 text-blue-500 text-xs font-semibold">{u.role}</span></td>
                    <td className={`p-3 ${currentTheme.textSecondary}`}>{u.dept}</td>
                    <td className={`p-3 ${currentTheme.textSecondary}`}>{u.email}</td>
                    <td className="p-3"><button disabled={!canEditUsers} onClick={() => removeUserRecord(u.id)} className="text-red-500 text-xs font-semibold disabled:opacity-50">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'systemControl') {
    return (
      <div className="space-y-6">
        <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>System Control</h1>
        <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
              <p className={`${currentTheme.textPrimary} font-semibold mb-2`}>Attendance Edit Window Lock</p>
              <p className={`${currentTheme.textSecondary} text-xs mb-2`}>Lock attendance edits after configured hours.</p>
              <input value={attendanceLockHours} onChange={(e) => setAttendanceLockHours(e.target.value)} className={`w-full px-3 py-2 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
            </div>
            <div className={`p-4 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
              <p className={`${currentTheme.textPrimary} font-semibold mb-2`}>Database Utility</p>
              <div className="flex gap-2">
                <button onClick={() => pushAuditLog({ actor: 'admin', type: 'backup', message: 'Manual backup triggered' })} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold">Backup Now</button>
                <button onClick={() => pushAuditLog({ actor: 'admin', type: 'bulk_upload', message: 'Bulk CSV upload simulated' })} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">Bulk Upload CSV</button>
              </div>
            </div>
          </div>
        </div>
        <div className={`${currentTheme.card} rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-3`}>System Audit Feed</h3>
          <div className="space-y-2">
            {auditLogs.slice(0, 12).map((log) => (
              <div key={log.id} className={`p-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
                <p className={`${currentTheme.textPrimary} text-sm font-medium`}>{log.message || log.type}</p>
                <p className={`${currentTheme.textSecondary} text-xs mt-1`}>{log.actor || 'system'} · {log.timestamp}</p>
              </div>
            ))}
            {auditLogs.length === 0 && <p className={`${currentTheme.textSecondary} text-sm`}>No audit entries yet.</p>}
          </div>
        </div>
      </div>
    );
  }

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
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-4 border ${currentTheme.neoBorder}`}>
          <p className={`${currentTheme.textPrimary} text-sm font-semibold mb-2`}>Recommended flow</p>
          <ol className={`${currentTheme.textSecondary} text-xs space-y-1 list-decimal pl-4`}>
            <li>Upload CSV (or use demo data) and run analysis.</li>
            <li>Review class dashboard and at-risk list.</li>
            <li>Open student drill-down and export report PDFs.</li>
          </ol>
        </div>

        {/* Run Analysis Card */}
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-4`}>Run Analysis</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className={`text-xs font-bold uppercase ${currentTheme.textSecondary} block mb-2`}>Upload CSV (optional)</label>
              <input type="file" accept=".csv" onChange={(e) => setSwotFile(e.target.files?.[0] || null)} className={`text-sm ${currentTheme.textPrimary}`} />
            </div>
            <button id="analyse-btn" onClick={() => runSwot(false)} disabled={swotRunning || isReadOnlyDataRole} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold disabled:opacity-60 flex items-center gap-2 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all">
              <Activity size={18} className={swotRunning ? 'animate-spin' : ''} /> {swotRunning ? 'Running ML Scripts...' : 'Analyse'}
            </button>
            <button onClick={() => { setSwotFile(null); runSwot(true); }} disabled={swotRunning || isReadOnlyDataRole} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-60 flex items-center gap-2 transition-colors">
              <Activity size={18} /> Use Demo Data
            </button>
          </div>
          {isReadOnlyDataRole && <p className="text-xs text-amber-500 mt-3">Admin has read-only access for attendance analytics. User role management remains writable.</p>}
          {swotMessage && (
            <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${swotMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {swotMessage.type === 'success' ? <CheckCircle2 size={16} className="inline mr-2" /> : <XCircle size={16} className="inline mr-2" />}
              {swotMessage.text}
            </div>
          )}
        </div>

        {/* AI Mechanics Card */}
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder} mt-6`}>
          <h3 className={`${currentTheme.textPrimary} font-bold mb-4 flex items-center gap-2`}><Zap size={20} className="text-yellow-500" /> Trigger AI Predictive Mechanics</h3>
          <p className={`${currentTheme.textSecondary} text-sm mb-4`}>Simulate and preview a student's mark in a specific module for their next iteration using the ML model.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full relative">
              <label className={`text-xs font-bold uppercase ${currentTheme.textSecondary} block mb-2`}>Student Email</label>
              <input value={predictEmail} onChange={e => setPredictEmail(e.target.value)} type="text" placeholder="e.g. aarav.sharma@example.com" className={`w-full py-2.5 px-4 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary} outline-none focus:ring-2 focus:ring-blue-500/50`} />
            </div>
            <div className="w-full sm:w-48 relative">
              <label className={`text-xs font-bold uppercase ${currentTheme.textSecondary} block mb-2`}>Course ID</label>
              <input value={predictCourseId} onChange={e => setPredictCourseId(e.target.value)} type="text" placeholder="e.g. AL23432" className={`w-full py-2.5 px-4 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary} outline-none focus:ring-2 focus:ring-blue-500/50`} />
            </div>
            <button onClick={triggerMechanics} disabled={isPredicting || isReadOnlyDataRole} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold disabled:opacity-60 flex items-center gap-2 shadow-md transition-all whitespace-nowrap">
              <Zap size={18} className={isPredicting ? "animate-pulse" : ""} /> {isPredicting ? 'Computing...' : 'Trigger Predict'}
            </button>
          </div>
          {predictResult && (
            <div className={`mt-4 p-4 rounded-xl border ${predictResult.error ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'}`}>
              {predictResult.error ? predictResult.error : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase opacity-80">Predicted Evaluation Result</p>
                    <p className="text-lg font-black mt-1">Student {predictResult.email} in {predictResult.courseId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase opacity-80">Expected Mark</p>
                    <p className="text-3xl font-black">{predictResult.predictedMark} <span className="text-sm">/ 100</span></p>
                  </div>
                </div>
              )}
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

  if (section === 'directory') {
    const busRoutes = [
      { no: 'R01', name: 'Ennore', start: '5.50 am' }, { no: 'R01A', name: 'Tondiarpet', start: '6.17 am' },
      { no: 'R01B', name: 'Kasimedu', start: '6.15 am' }, { no: 'R02', name: 'Triplicane', start: '6.20 am' },
      { no: 'R03', name: 'Choolai', start: '6.20 am' }, { no: 'R03A', name: 'Collector Nagar', start: '6.50 am' },
      { no: 'R03B', name: 'Water Tank', start: '6.40 am' }, { no: 'R04', name: 'East Mogappair', start: '6.30 am' },
      { no: 'R05', name: 'CIT Nagar', start: '6.10 am' }, { no: 'R05A', name: 'Loyola College', start: '6.40 am' },
      { no: 'R06', name: 'Chinmayanagar', start: '6.10 am' }, { no: 'R07', name: 'Santhome', start: '6.10 am' },
      { no: 'R08', name: 'Kovilambakkam', start: '6.10 am' }, { no: 'R08A', name: 'Adambakkam', start: '6.30 am' },
      { no: 'R09', name: 'MKB Nagar', start: '6.00 am' }, { no: 'R09A', name: 'Perambur', start: '6.30 am' },
      { no: 'R10', name: 'Thachoor', start: '5.50 am' }, { no: 'R11', name: 'Chengalpattu', start: '6.00 am' },
      { no: 'R11A', name: 'Guduvanchery', start: '6.30 am' }, { no: 'R12', name: 'Minjur', start: '5.45 am' },
      { no: 'R13', name: 'Vyasarpadi', start: '6.10 am' }, { no: 'R13A', name: 'ICF', start: '6.45 am' },
      { no: 'R14', name: 'Thiruvallur', start: '6.25 am' }, { no: 'R14A', name: 'Kakkalur', start: '6.55 am' },
      { no: 'R15', name: 'Kancheepuram', start: '6.00 am' }, { no: 'R15A', name: 'Orikkai', start: '6.15 am' },
      { no: 'R16', name: 'Neelangkarai', start: '6.10 am' }, { no: 'R16A', name: 'Guindy', start: '6.45 am' },
      { no: 'R16B', name: 'Sholinganallur', start: '6.10 am' }, { no: 'R17', name: 'Valluvarkottam', start: '6.15 am' },
      { no: 'R17A', name: 'Valasaravakkam', start: '6.45 am' }, { no: 'R18', name: 'Pallikaranai', start: '6.15 am' },
      { no: 'R18A', name: 'Sembakkam', start: '6.25 am' }, { no: 'R18B', name: 'Kelambakkam', start: '6.00 am' },
      { no: 'R19', name: 'Poombukar', start: '6.10 am' }, { no: 'R19A', name: 'Vinayagapuram', start: '6.45 am' },
      { no: 'R20', name: 'Vepampattu', start: '6.30 am' }, { no: 'R21', name: 'Ayyapakkam', start: '6.15 am' },
      { no: 'R22', name: 'Thiruthani', start: '5.55 am' }, { no: 'R22A', name: 'SR Gate', start: '6.30 am' },
      { no: 'R23', name: 'K4 Police Station', start: '6.35 am' }, { no: 'R24', name: 'Arcot', start: '5.25 am' },
      { no: 'R25', name: 'Kallikuppam', start: '6.45 am' }, { no: 'R25A', name: 'Pudur', start: '6.45 am' },
      { no: 'R26', name: 'Andarkuppam', start: '6.35 am' }, { no: 'R27', name: 'Avadi', start: '6.25 am' },
      { no: 'R27A', name: 'Kollumedu', start: '6.30 am' }, { no: 'R28', name: 'Agaram', start: '6.20 am' },
      { no: 'R29', name: 'Velachery', start: '6.10 am' }, { no: 'R29A', name: 'Pammal', start: '6.35 am' },
      { no: 'R29B', name: 'Sivanthangal', start: '7.05 am' },
    ];
    const filteredRoutes = busRoutes.filter((r) => {
      const q = routeQuery.trim().toLowerCase();
      return !q || r.no.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className={`${currentTheme.textPrimary} text-2xl font-bold flex items-center gap-2`}><MapPin size={22} /> Transport Directory</h1>
            <p className={`${currentTheme.textSecondary} text-sm mt-1`}>Updated bus routes and pickup start timings.</p>
          </div>
          <a href="https://www.rittransport.com/js/51jan26.php" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
            Source Link
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Total Routes</p><p className={`${currentTheme.textPrimary} text-xl font-bold`}>{busRoutes.length}</p></div>
          <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Earliest Start</p><p className={`${currentTheme.textPrimary} text-xl font-bold`}>5.25 am</p></div>
          <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Latest Start</p><p className={`${currentTheme.textPrimary} text-xl font-bold`}>7.05 am</p></div>
          <div className={`${currentTheme.card} rounded-2xl p-4 border ${currentTheme.neoBorder}`}><p className={`${currentTheme.textSecondary} text-xs`}>Visible</p><p className={`${currentTheme.textPrimary} text-xl font-bold`}>{filteredRoutes.length}</p></div>
        </div>

        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative w-full sm:w-80">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} w-4 h-4`} />
              <input
                value={routeQuery}
                onChange={(e) => setRouteQuery(e.target.value)}
                placeholder="Search route no or area..."
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary} text-sm`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className={`border-b ${currentTheme.border}`}>
                  <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>S.No</th>
                  <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Route No</th>
                  <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Route Name</th>
                  <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Starting Time</th>
                  <th className={`p-3 text-left text-xs uppercase ${currentTheme.textSecondary}`}>Boarding</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route, idx) => (
                  <tr key={route.no} className={`border-b ${currentTheme.border} hover:bg-black/[0.03] dark:hover:bg-white/[0.03]`}>
                    <td className={`p-3 ${currentTheme.textSecondary}`}>{idx + 1}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-lg bg-blue-500/15 text-blue-500 text-xs font-semibold">{route.no}</span></td>
                    <td className={`p-3 ${currentTheme.textPrimary} font-medium`}>{route.name}</td>
                    <td className={`p-3 ${currentTheme.textPrimary}`}>{route.start}</td>
                    <td className="p-3"><span className={`${currentTheme.textSecondary} text-xs`}>Boarding points available</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Security architecture and immutable audit flow
  if (section === 'audit') {
    const chain = securityConfig?.blockchain_layer || IMS_SECURITY_V2.blockchain_layer;
    const prevention = securityConfig?.prevention_system || IMS_SECURITY_V2.prevention_system;
    const simulator = securityConfig?.attacking_system_simulator || IMS_SECURITY_V2.attacking_system_simulator;
    const dashboard = securityConfig?.admin_dashboard_integration || IMS_SECURITY_V2.admin_dashboard_integration;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="w-1 h-8 rounded-full bg-amber-500" />
          <h1 className={`${currentTheme.textPrimary} text-2xl font-bold`}>IMS Security v2 - Blockchain Audit Layer</h1>
        </div>
        <p className={`${currentTheme.textSecondary} text-sm`}>
          Security control plane combining immutable audit logs, prevention pipelines, and attack simulation telemetry for rapid response.
        </p>
        <div className={`text-xs ${currentTheme.textSecondary}`}>
          Source: {securityConfigLoading ? 'Loading from backend...' : 'Synced from backend endpoint /api/security/ims-v2 (fallback enabled)'}
        </div>
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${currentTheme.textPrimary} font-bold`}>Live Attack Alerts</h3>
            <span className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-500 font-semibold">
              {securityAlerts.length} detected
            </span>
          </div>
          {securityAlerts.length > 0 ? (
            <div className="space-y-2">
              {securityAlerts.slice(0, 6).map((alert) => (
                <div key={alert.id} className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-red-400">{alert.type}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold uppercase">{alert.severity || 'high'}</span>
                      <p className="text-[10px] text-red-300/80">{alert.timestamp}</p>
                    </div>
                  </div>
                  <p className={`${currentTheme.textPrimary} text-sm mt-1`}>{alert.message}</p>
                  <p className={`text-[11px] mt-1 ${currentTheme.textSecondary}`}>{alert.method} {alert.path} · {alert.ip}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${currentTheme.textSecondary} text-sm`}>No suspicious requests detected yet.</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Blockchain Tech', value: chain.technology, icon: ShieldCheck, color: 'text-blue-500' },
            { label: 'Consensus', value: chain.consensus, icon: CheckCircle2, color: 'text-emerald-500' },
            { label: 'Core Function', value: chain.core_function, icon: FileText, color: 'text-indigo-500' },
          ].map((card, idx) => (
            <div key={idx} className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-5 border ${currentTheme.neoBorder}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs uppercase font-bold ${currentTheme.textSecondary}`}>{card.label}</span>
                <card.icon size={18} className={card.color} />
              </div>
              <p className={`${currentTheme.textPrimary} text-sm font-semibold`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-3`}>Blockchain Layer - Data Anchored On Chain</h3>
            <div className="space-y-2">
              {chain.data_to_chain.map((entry) => (
                <div key={entry} className={`flex items-center gap-2 p-2 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span className={`${currentTheme.textPrimary} text-sm font-medium`}>{entry}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-3`}>Prevention System</h3>
            <p className={`${currentTheme.textSecondary} text-sm mb-3`}>{prevention.mechanism}</p>
            <div className="space-y-2">
              {Object.entries(prevention.features).map(([key, value]) => (
                <div key={key} className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                  <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mb-1">{key.replace('_', ' ')}</p>
                  <p className={`${currentTheme.textPrimary} text-sm`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-3 flex items-center gap-2`}><Target size={18} className="text-red-500" />Attacking System Simulator</h3>
            <p className={`${currentTheme.textSecondary} text-sm mb-3`}>{simulator.purpose}</p>
            <div className="space-y-2 mb-4">
              {simulator.attack_vectors.map((vector) => (
                <div key={vector} className="flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle size={14} />
                  <span>{vector}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-[10px] uppercase font-bold text-red-500 mb-1">Detection Logic</p>
              <p className={`${currentTheme.textPrimary} text-sm`}>{simulator.detection_logic}</p>
            </div>
          </div>

          <div className={`${currentTheme.card} backdrop-blur-2xl rounded-2xl p-6 border ${currentTheme.neoBorder}`}>
            <h3 className={`${currentTheme.textPrimary} font-bold mb-3`}>Admin Dashboard Integration</h3>
            <div className="space-y-2 mb-4">
              {Object.entries(dashboard.visuals).map(([key, value]) => (
                <div key={key} className={`p-2 rounded-lg ${currentTheme.bg} ${currentTheme.neoBorder}`}>
                  <p className={`text-[10px] uppercase font-bold ${currentTheme.textSecondary}`}>{key.replace('_', ' ')}</p>
                  <p className={`${currentTheme.textPrimary} text-sm`}>{value}</p>
                </div>
              ))}
            </div>
            <h4 className={`${currentTheme.textPrimary} font-semibold text-sm mb-2`}>Rapid Actions</h4>
            <div className="flex flex-wrap gap-2">
              {dashboard.actions.map((action) => (
                <button key={action} className="px-3 py-1.5 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Placements, Timetables, Directory, Crowd - placeholder
  const placeholders = { placements: 'Placements', timetables: 'Exam Timetables', directory: 'Transport Directory', crowd: 'Crowd Flow' };
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
  const [authRole, setAuthRole] = useState('student');
  const [studentEmail, setStudentEmail] = useState(null);
  const [studentName, setStudentName] = useState('Student');
  const [studentRegNo, setStudentRegNo] = useState(null);
  const [themeMode, setThemeMode] = useState('system');
  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
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
  const darkMode = themeMode === 'system' ? systemPrefersDark : themeMode === 'dark';
  const currentTheme = darkMode ? themes.dark : themes.light;

  useEffect(() => {
    const storedThemeMode = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedThemeMode === 'light' || storedThemeMode === 'dark' || storedThemeMode === 'system') {
      setThemeMode(storedThemeMode);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (event) => setSystemPrefersDark(event.matches);
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const handleThemeModeChange = (nextMode) => {
    const animationCss = createThemeAnimation({ variant: 'circle', start: 'top-right', blur: false });
    setThemeTransitionStyles(animationCss);

    const applyMode = () => setThemeMode(nextMode);

    if (!document.startViewTransition) {
      applyMode();
      return;
    }

    document.startViewTransition(applyMode);
  };

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
    { icon: BookOpen, label: 'My Subject Registration' },
    { icon: ClipboardList, label: 'Leave / OD' },
    { icon: UserCheck, label: 'Attendance' },
    { icon: Zap, label: 'CAT Mark' },
    { icon: Clock, label: 'LAB Mark' },
    { icon: BarChart3, label: 'Grade Book' },
    { icon: GraduationCap, label: 'CGPA Calculator' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: KeyRound, label: 'Change Password' },
    { icon: Wallet, label: 'Academic Fee' },
    { icon: Settings, label: 'Profile & Settings' },
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

  const generateStudentStats = (regNo) => {
    if (!regNo) return { cgpa: '8.42', arrears: '0', attendance: '92', leaves: '2' };
    if (regNo === '2117240020033') return { cgpa: '9.42', arrears: '0', attendance: '90', leaves: '2' };
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
  ];
  const quickActions = [
    { label: 'View Timetable', hint: 'Today + week plan', tab: 'My Timetable' },
    { label: 'Check Attendance', hint: 'Low-risk subjects first', tab: 'Attendance' },
    { label: 'Open SWOT Report', hint: 'Performance insights', tab: 'SWOT Analysis' },
  ];
  const announcementList = [
    { title: 'Placement Drive: Google Cloud', info: 'Pre-placement talk at Main Auditorium', time: 'Today, 10:00 AM' },
    { title: 'Internal Assessment III Postponed', info: 'Updated schedule published', time: 'Yesterday' },
    { title: 'Hackathon 2026 Registrations', info: 'Team registration closes Jan 26', time: 'Jan 20' },
  ];

  if (!isAuthenticated) {
    return (
      <SignInPage
        onSignIn={({ role, email, name, regNo }) => {
          setIsAuthenticated(true);
          setAuthRole(role || 'student');
          setStudentEmail(email || null);
          setStudentName(name || (role === 'admin' ? 'Admin' : role === 'hod' ? 'HOD' : role === 'teacher' ? 'Teacher' : 'Student'));
          setStudentRegNo(regNo || null);
        }}
      />
    );
  }

  if (authRole === 'admin' || authRole === 'hod' || authRole === 'teacher') {
    return (
      <div className={`theme-smooth min-h-screen ${darkMode ? 'dark bg-[#000000]' : 'bg-slate-100/80'}`}>
        <AdminPanel
          onLogout={() => {
            setIsAuthenticated(false);
            setAuthRole('student');
          }}
          darkMode={darkMode}
          themeMode={themeMode}
          onThemeModeChange={handleThemeModeChange}
          role={authRole}
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

      {/* Mobile Sidebar Overlay (Disabled for new Bottom Nav) */}

      {/* Desktop Sidebar - Glassmorphism */}
      <aside className={`${currentTheme.sidebar} hidden md:flex ${isSidebarCollapsed ? 'w-0 overflow-hidden md:w-[100px]' : 'w-[280px]'} transition-[width] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex-col fixed h-full z-50`}>

        {/* Logo Section */}
        <div className="h-28 flex items-center px-8 relative">
          <div className="flex items-center gap-4 w-full">
            <img src="/RIT WHITE LOGO.png" alt="RIT" className="w-auto h-12 object-contain flex-shrink-0" />

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
      <main className={`flex-1 flex flex-col transition-all duration-500 ml-0 ${isSidebarCollapsed ? 'md:ml-[100px]' : 'md:ml-[280px]'} relative z-10 w-full overflow-x-hidden pb-24 md:pb-0`}>

        {/* Floating Glass Header */}
        <header className={`sticky top-0 z-40 ${scrolled ? currentTheme.headerBg : 'bg-transparent'} px-4 md:px-6 lg:px-10 h-16 sm:h-20 lg:h-24 flex items-center justify-between gap-2 backdrop-blur-3xl md:backdrop-blur-none`}>
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop Menu toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`hidden md:block p-2.5 rounded-full ${currentTheme.card} ${currentTheme.neoBorder} hover:scale-105 transition-all shadow-sm group`}
            >
              <Menu size={18} className={`${currentTheme.textPrimary}`} />
            </button>
            <div className="md:hidden -ml-1">
              <img src="/RIT WHITE LOGO.png" alt="RIT" className="w-auto h-10 object-contain" />
            </div>

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

            <ThemeModeToggle
              themeMode={themeMode}
              onThemeModeChange={handleThemeModeChange}
              currentTheme={currentTheme}
            />

            <button className={`relative p-3 rounded-full ${currentTheme.card} ${currentTheme.neoBorder} shadow-sm hover:scale-105 transition-all`}>
              <Bell size={18} className={currentTheme.textPrimary} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

            <div className={`flex items-center gap-3 pl-2 p-1.5 rounded-full ${currentTheme.card} ${currentTheme.neoBorder} pr-4 cursor-pointer hover:shadow-md transition-shadow`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentName)}&backgroundColor=transparent`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <span className={`text-sm font-semibold ${currentTheme.textPrimary} hidden sm:block`}>{studentName}</span>
              <ChevronDown size={14} className={currentTheme.textSecondary} />
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        {activeTab === 'Dashboard' && (
          <div className="p-4 md:p-10 md:pt-4 max-w-7xl mx-auto w-full animate-fade-in">
            <div className={`${currentTheme.heroGradient} rounded-[24px] md:rounded-[32px] p-6 md:p-8 mb-8`}>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">Good morning, {studentName}.</h1>
                  <p className="text-blue-100/80 text-sm mt-1">Today focus: 2 classes, no low-attendance critical alerts.</p>
                </div>
                <button
                  onClick={() => setActiveTab('My Timetable')}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold ${darkMode ? 'bg-white text-black' : 'bg-white text-blue-600'}`}
                >
                  Open Timetable
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} theme={currentTheme} darkMode={darkMode} />
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className={`lg:col-span-2 ${currentTheme.card} rounded-[24px] p-6 relative overflow-hidden`}>
                <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`${currentTheme.textPrimary} text-lg font-bold`}>Quick Actions</h3>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => setActiveTab(action.tab)}
                        className={`text-left p-4 rounded-2xl ${currentTheme.bg} ${currentTheme.neoBorder} hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}
                      >
                        <p className={`${currentTheme.textPrimary} text-sm font-semibold`}>{action.label}</p>
                        <p className={`${currentTheme.textSecondary} text-xs mt-1`}>{action.hint}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`${currentTheme.card} rounded-[24px] p-6 relative overflow-hidden`}>
                <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
                <div className="relative z-10">
                  <h3 className={`${currentTheme.textPrimary} text-lg font-bold mb-4`}>Next Class</h3>
                  <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03]">
                    <p className={`${currentTheme.textSecondary} text-xs uppercase font-bold`}>09:30 AM</p>
                    <p className={`${currentTheme.textPrimary} text-sm font-semibold mt-1`}>Compiler Design</p>
                    <p className={`${currentTheme.textSecondary} text-xs mt-1`}>Room 402</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${currentTheme.card} rounded-[24px] p-6 relative overflow-hidden`}>
              <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${currentTheme.textPrimary} text-lg font-bold`}>Announcements</h3>
                  <span className={`${currentTheme.textSecondary} text-xs`}>Latest 3 updates</span>
                </div>
                <div className="space-y-2">
                  {announcementList.map((item) => (
                    <div key={item.title} className={`p-4 rounded-2xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
                      <p className={`${currentTheme.textPrimary} text-sm font-semibold`}>{item.title}</p>
                      <p className={`${currentTheme.textSecondary} text-xs mt-1`}>{item.info}</p>
                      <p className={`${currentTheme.textSecondary} text-[11px] mt-1`}>{item.time}</p>
                    </div>
                  ))}
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

        {/* Subject Registration */}
        {activeTab === 'My Subject Registration' && (
          <SubjectRegistrationContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* Leave/OD Content Container */}
        {activeTab === 'Leave / OD' && (
          <LeaveODContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* Attendance Content Container */}
        {activeTab === 'Attendance' && (
          <AttendanceContent currentTheme={currentTheme} darkMode={darkMode} studentRegNo={studentRegNo} authRole={authRole} />
        )}

        {/* Grade Book */}
        {activeTab === 'Grade Book' && (
          <GradeBookContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* Messages */}
        {activeTab === 'Messages' && (
          <MessagesContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* CGPA Calculator */}
        {activeTab === 'CGPA Calculator' && (
          <CgpaCalculatorContent currentTheme={currentTheme} darkMode={darkMode} />
        )}

        {/* Change Password */}
        {activeTab === 'Change Password' && (
          <StudentChangePasswordContent currentTheme={currentTheme} darkMode={darkMode} />
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

        {/* Profile & Settings */}
        {activeTab === 'Profile & Settings' && (
          <div className="p-4 md:p-10 md:pt-4 max-w-5xl mx-auto w-full animate-fade-in space-y-6">
            <div className={`${currentTheme.card} rounded-[24px] p-6 md:p-8 relative overflow-hidden`}>
              <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div>
                  <h2 className={`${currentTheme.textPrimary} text-2xl font-bold`}>Profile & Settings</h2>
                  <p className={`${currentTheme.textSecondary} text-sm mt-1`}>Manage account basics and preferences.</p>
                </div>
                <div className={`px-3 py-2 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder}`}>
                  <p className={`${currentTheme.textPrimary} text-sm font-semibold`}>{studentEmail || 'student@ritchennai.edu.in'}</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${currentTheme.card} rounded-[24px] p-6 relative overflow-hidden`}>
                <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
                <div className="relative z-10 space-y-4">
                  <h3 className={`${currentTheme.textPrimary} font-bold`}>Account</h3>
                  <div>
                    <label className={`${currentTheme.textSecondary} text-xs font-bold uppercase`}>Display Name</label>
                    <input defaultValue={studentName} className={`mt-1 w-full px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
                  </div>
                  <div>
                    <label className={`${currentTheme.textSecondary} text-xs font-bold uppercase`}>Department</label>
                    <input defaultValue="CSE" className={`mt-1 w-full px-4 py-3 rounded-xl ${currentTheme.bg} ${currentTheme.neoBorder} ${currentTheme.textPrimary}`} />
                  </div>
                </div>
              </div>
              <div className={`${currentTheme.card} rounded-[24px] p-6 relative overflow-hidden`}>
                <div className={`absolute inset-0 ${currentTheme.cardInner} opacity-50`}></div>
                <div className="relative z-10 space-y-4">
                  <h3 className={`${currentTheme.textPrimary} font-bold`}>Preferences</h3>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
                    <span className={`${currentTheme.textPrimary} text-sm`}>Email notifications</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
                    <span className={`${currentTheme.textPrimary} text-sm`}>Show attendance alerts</span>
                    <input type="checkbox" defaultChecked />
                  </label>
                  <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold">Save Preferences</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Native Mobile Bottom Navigation Bar */}
      <nav className={`md:hidden fixed bottom-6 left-4 right-4 z-50 ${currentTheme.card} ${currentTheme.neoBorder} rounded-[28px] p-2 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-x-auto no-scrollbar gap-2 backdrop-blur-xl`}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.label;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex flex-col items-center justify-center min-w-[70px] py-2.5 px-1 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-50 dark:bg-blue-500/20 shadow-inner' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
            >
              <Icon size={22} className={`mb-1 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400 shadow-blue-500/50' : 'text-slate-400 opacity-60'}`} />
              <span className={`text-[9px] font-bold tracking-wide transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 opacity-60'} truncate w-full text-center`}>
                {item.label}
              </span>
            </button>
          )
        })}
        {/* Mobile logout capability inside scrollbar */}
        <button onClick={() => setIsAuthenticated(false)} className="flex flex-col items-center justify-center min-w-[70px] py-2.5 px-1 rounded-2xl transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400">
          <LogOut size={22} className="mb-1" />
          <span className="text-[9px] font-bold tracking-wide truncate w-full text-center">Logout</span>
        </button>
      </nav>

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