import {
  FaThLarge, // LayoutDashboard
  FaBookOpen, // BookOpen / Courses
  FaGraduationCap, // GraduationCap
  FaDollarSign, // DollarSign / Financials
  FaLifeRing, // LifeBuoy / Support
  FaCog, // Settings
  FaUserPlus, // UserPlus / Admissions
  FaUsers, // Users / Students Directory
  FaCalendarAlt, // Calendar / Batches
  FaAward, // Award / Staff
  FaVideo, // Video / Live Classes
  FaClipboardList, // ClipboardList / Assignments
  FaChartBar, // BarChart / Progress
  FaShoppingBag, // Products
  FaCodeBranch, // Branches
  FaCheckCircle,
} from "react-icons/fa";

export const navigationConfig = {
  // ─── ADMIN ──────────────────────────────────────────────
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: FaThLarge },
    { label: "Control Panel", path: "/admin/control-panel", icon: FaCog },
    { label: "Franchises", path: "/admin/franchises", icon: FaUsers },
    { label: "Courses & Curriculum", path: "/admin/courses", icon: FaBookOpen },
    {
      label: "Global Students",
      path: "/admin/students",
      icon: FaGraduationCap,
    },
    {
      label: "Financials & Payouts",
      path: "/admin/financials",
      icon: FaDollarSign,
    },
    { label: "Support Tickets", path: "/admin/support", icon: FaLifeRing },
    { label: "Products", path: "/admin/products", icon: FaShoppingBag },
    { label: "Manage Branches", path: "/admin/branches", icon: FaCodeBranch },
    { label: "All Approvals", path: "/admin/approvals", icon: FaCheckCircle },
  ],

  // ─── FRANCHISE ──────────────────────────────────────────
  franchise: [
    { label: "Dashboard", path: "/franchise/dashboard", icon: FaThLarge },
    { label: "Admissions", path: "/franchise/admissions", icon: FaUserPlus },
    { label: "Students", path: "/franchise/students", icon: FaUsers },
    {
      label: "Batches & Schedules",
      path: "/franchise/batches",
      icon: FaCalendarAlt,
    },
    { label: "Staff & Instructors", path: "/franchise/staff", icon: FaAward },
    {
      label: "Local Financials",
      path: "/franchise/billing",
      icon: FaDollarSign,
    },
    { label: "Branches", path: "/franchise/branches", icon: FaCodeBranch },
    { label: "Courses", path: "/franchise/courses", icon: FaBookOpen },
  ],

  // ─── STUDENT ────────────────────────────────────────────
  student: [
    { label: "My Portal", path: "/student/dashboard", icon: FaThLarge },
    { label: "My Courses", path: "/student/courses", icon: FaBookOpen },
    {
      label: "Live Classes",
      path: "/student/live",
      icon: FaVideo,
      badge: "Live",
    },
    {
      label: "Assignments",
      path: "/student/assignments",
      icon: FaClipboardList,
    },
    { label: "Progress & Grades", path: "/student/progress", icon: FaChartBar },
    { label: "Fee Ledger", path: "/student/fees", icon: FaDollarSign },
    { label: "Study Material", path: "/student/studymat", icon: FaShoppingBag },
    { label: "Order History", path: "/student/orders", icon: FaClipboardList },
  ],
};

/**
 * Role meta — color-coded badge config per role.
 */
export const roleMeta = {
  admin: {
    label: "Admin",
    color: "#4f46e5",
    bg: "#ede9fe",
    home: "/admin/dashboard",
  },
  franchise: {
    label: "Franchise",
    color: "#0284c7",
    bg: "#e0f2fe",
    home: "/franchise/dashboard",
  },
  student: {
    label: "Student",
    color: "#16a34a",
    bg: "#dcfce7",
    home: "/student/dashboard",
  },
};
