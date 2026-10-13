import React from "react";
import { useApp } from "../../context/AppContext";
import { Menu, LogOut, ShieldCheck, GraduationCap, Award, RefreshCw } from "lucide-react";

export const Header = ({ activeTab, title, subtitle, onToggleSidebar }) => {
  const { currentUser, logout, users, setCurrentUser, showToast, resetDemoData } = useApp();



  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <ShieldCheck size={14} />;
      case "faculty":
        return <Award size={14} />;
      case "student":
        return <GraduationCap size={14} />;
      default:
        return null;
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <div className="header-title-block">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {/* Academic Session Badge */}
        <div className="academic-badge" title="Academic Term Session">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f46e5", display: "inline-block" }}></span>
          <span>AY 2026-2027 • Fall Term</span>
        </div>





        {/* Logout Button */}
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ color: "var(--color-danger)", borderColor: "#fecaca" }}
          title="Sign out of CAMPEX"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
