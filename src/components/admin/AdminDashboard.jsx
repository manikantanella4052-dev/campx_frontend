import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  CalendarCheck,
  FileCheck2,
  PlusCircle,
  TrendingUp,
  UserCheck
} from "lucide-react";

export const AdminDashboard = ({ setActiveTab }) => {
  const { users, classes, subjects, departments, exams, attendance } = useApp();

  const studentsCount = users.filter((u) => u.role === "student").length;
  const facultyCount = users.filter((u) => u.role === "faculty").length;
  const activeUsersCount = users.filter((u) => u.status === "active").length;

  return (
    <div>
      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--stat-accent": "#4f46e5" }}>
          <div className="stat-content">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{studentsCount}</span>
            <span className="stat-subtext">Active student enrollments</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#eef2ff", "--stat-icon-color": "#4f46e5" }}
          >
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#0ea5e9" }}>
          <div className="stat-content">
            <span className="stat-label">Faculty Members</span>
            <span className="stat-value">{facultyCount}</span>
            <span className="stat-subtext">Teaching & research staff</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#f0f9ff", "--stat-icon-color": "#0ea5e9" }}
          >
            <UserCheck size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#10b981" }}>
          <div className="stat-content">
            <span className="stat-label">Active Classes</span>
            <span className="stat-value">{classes.length}</span>
            <span className="stat-subtext">Across {departments.length} departments</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#ecfdf5", "--stat-icon-color": "#10b981" }}
          >
            <Building2 size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#8b5cf6" }}>
          <div className="stat-content">
            <span className="stat-label">Course Subjects</span>
            <span className="stat-value">{subjects.length}</span>
            <span className="stat-subtext">Curriculum course offerings</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#f5f3ff", "--stat-icon-color": "#8b5cf6" }}
          >
            <BookOpen size={24} />
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Quick Action Hub */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} color="var(--color-primary)" />
              Administrative Operations & Shortcuts
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <button
              onClick={() => setActiveTab("users")}
              className="btn btn-secondary"
              style={{ justifyContent: "flex-start", padding: "1rem", borderRadius: "var(--radius-lg)" }}
            >
              <Users size={20} color="var(--color-primary)" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700 }}>Add / Manage Users</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Provision accounts</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("academic")}
              className="btn btn-secondary"
              style={{ justifyContent: "flex-start", padding: "1rem", borderRadius: "var(--radius-lg)" }}
            >
              <Building2 size={20} color="var(--color-secondary)" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700 }}>Academic Structure</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Classes & Subjects</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("assignments")}
              className="btn btn-secondary"
              style={{ justifyContent: "flex-start", padding: "1rem", borderRadius: "var(--radius-lg)" }}
            >
              <UserCheck size={20} color="#10b981" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700 }}>Faculty Assignments</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Assign classes & courses</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("exams")}
              className="btn btn-secondary"
              style={{ justifyContent: "flex-start", padding: "1rem", borderRadius: "var(--radius-lg)" }}
            >
              <FileCheck2 size={20} color="#f59e0b" />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700 }}>Schedule Exams</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Assessments & Tests</div>
              </div>
            </button>
          </div>
        </div>

        {/* Academic Health Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CalendarCheck size={18} color="var(--color-primary)" />
              Academic Status
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Attendance Sessions:</span>
              <strong>{attendance.length} logged</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Exams Scheduled:</span>
              <strong>{exams.length} exams</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Active Accounts:</span>
              <span className="badge badge-active">{activeUsersCount} / {users.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Academic Departments:</span>
              <strong>{departments.length} departments</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Summary Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Campus Departments Overview</h3>
          <button onClick={() => setActiveTab("academic")} className="btn btn-secondary btn-sm">
            View All Academics
          </button>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Code</th>
                <th>Head of Department</th>
                <th>Classes</th>
                <th>Subjects</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => {
                const deptClasses = classes.filter((c) => c.departmentId === dept.id).length;
                const deptSubjects = subjects.filter((s) => s.departmentId === dept.id).length;
                return (
                  <tr key={dept.id}>
                    <td>
                      <strong>{dept.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-inactive">{dept.code}</span>
                    </td>
                    <td>{dept.headOfDept || "Not Assigned"}</td>
                    <td>{deptClasses} Class(es)</td>
                    <td>{deptSubjects} Subject(s)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
