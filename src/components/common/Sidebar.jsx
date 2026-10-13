import React from "react";
import { useApp } from "../../context/AppContext";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  FileCheck2,
  BarChart3,
  CalendarCheck,
  FileText,
  User,
  LogOut,
  Layers,
  X
} from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  const role = currentUser.role;

  // Navigation Items per Role
  const adminNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Students & Faculty", icon: Users },
    { id: "academic", label: "Departments & Classes", icon: Building2 },
    { id: "assignments", label: "Faculty Assignments", icon: UserCheck },
    { id: "exams", label: "Exam Management", icon: FileCheck2 },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 }
  ];

  const facultyNav = [
    { id: "dashboard", label: "Faculty Dashboard", icon: LayoutDashboard },
    { id: "attendance", label: "Mark Attendance", icon: CalendarCheck },
    { id: "marks", label: "Enter Marks", icon: FileText },
    { id: "roster", label: "My Classes & Roster", icon: Layers }
  ];

  const studentNav = [
    { id: "dashboard", label: "Student Dashboard", icon: LayoutDashboard },
    { id: "attendance", label: "Attendance Records", icon: CalendarCheck },
    { id: "marks", label: "Exam Results & Marks", icon: FileText },
    { id: "profile", label: "Academic Profile", icon: User }
  ];

  const navItems = role === "admin" ? adminNav : role === "faculty" ? facultyNav : studentNav;

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "faculty":
        return "Faculty Member";
      case "student":
        return "Student Portal";
      default:
        return "User";
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand Logo & Name */}
      <div className="sidebar-header">
        <div className="brand-badge">
          <div className="brand-logo-icon">
            <GraduationCap size={24} />
          </div>
          <div className="brand-info">
            <h2>CAMPEX</h2>
            <span>Campus Excellence</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="menu-toggle-btn"
          style={{ display: isOpen ? "inline-flex" : "none", color: "#94a3b8", borderColor: "#334155" }}
        >
          <X size={18} />
        </button>
      </div>

      {/* User Information Card */}
      <div className="sidebar-user-card">
        <div className="sidebar-avatar">{getInitials(currentUser.name)}</div>
        <div className="sidebar-user-details">
          <div className="sidebar-user-name" title={currentUser.name}>
            {currentUser.name}
          </div>
          <span className={`badge badge-role-${role}`} style={{ marginTop: 4 }}>
            {getRoleLabel()}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth <= 900) onClose();
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer / Sign Out */}
      <div className="sidebar-footer">
        <button className="btn-sidebar-logout" onClick={logout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
