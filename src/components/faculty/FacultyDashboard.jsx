import React from "react";
import { useApp } from "../../context/AppContext";
import { Layers, BookOpen, Users, CalendarCheck, FileText, CheckCircle } from "lucide-react";

export const FacultyDashboard = ({ setActiveTab }) => {
  const { currentUser, facultyAssignments, classes, subjects, users, exams, attendance } = useApp();

  // Find assignments for this faculty member
  const myAssignments = facultyAssignments.filter((a) => a.facultyId === currentUser.id);

  // Unique assigned classes
  const assignedClassIds = [...new Set(myAssignments.map((a) => a.classId))];
  const myClasses = classes.filter((c) => assignedClassIds.includes(c.id));

  // Unique assigned subjects
  const assignedSubjectIds = [...new Set(myAssignments.map((a) => a.subjectId))];
  const mySubjects = subjects.filter((s) => assignedSubjectIds.includes(s.id));

  // Total students taught
  const myStudents = users.filter((u) => u.role === "student" && assignedClassIds.includes(u.classId));

  // Recent attendance sessions taken by this faculty
  const myAttendanceCount = attendance.filter((att) =>
    myAssignments.some((a) => a.classId === att.classId && a.subjectId === att.subjectId)
  ).length;

  return (
    <div>
      {/* Welcome banner */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          color: "#ffffff",
          marginBottom: "2rem",
          padding: "1.75rem",
          borderColor: "#3730a3"
        }}
      >
        <h2 style={{ color: "#ffffff", fontSize: "1.5rem", marginBottom: "0.4rem" }}>
          Welcome back, {currentUser.name}!
        </h2>
        <p style={{ color: "#c7d2fe", fontSize: "0.9rem", maxWidth: "600px" }}>
          You have {myClasses.length} assigned class section(s) and {mySubjects.length} course offering(s) active this semester.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--stat-accent": "#4f46e5" }}>
          <div className="stat-content">
            <span className="stat-label">Assigned Classes</span>
            <span className="stat-value">{myClasses.length}</span>
            <span className="stat-subtext">Class cohorts taught</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#eef2ff", "--stat-icon-color": "#4f46e5" }}
          >
            <Layers size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#0ea5e9" }}>
          <div className="stat-content">
            <span className="stat-label">Assigned Subjects</span>
            <span className="stat-value">{mySubjects.length}</span>
            <span className="stat-subtext">Curriculum courses</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#f0f9ff", "--stat-icon-color": "#0ea5e9" }}
          >
            <BookOpen size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#10b981" }}>
          <div className="stat-content">
            <span className="stat-label">Enrolled Students</span>
            <span className="stat-value">{myStudents.length}</span>
            <span className="stat-subtext">In your cohorts</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#ecfdf5", "--stat-icon-color": "#10b981" }}
          >
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#8b5cf6" }}>
          <div className="stat-content">
            <span className="stat-label">Attendance Logs</span>
            <span className="stat-value">{myAttendanceCount}</span>
            <span className="stat-subtext">Recorded class lectures</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#f5f3ff", "--stat-icon-color": "#8b5cf6" }}
          >
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CalendarCheck size={20} color="var(--color-primary)" />
              Daily Attendance Logging
            </h3>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
            Select class and subject to record daily presence, absences, or late arrivals. You can also edit previous dates anytime.
          </p>
          <button onClick={() => setActiveTab("attendance")} className="btn btn-primary">
            <CalendarCheck size={16} />
            <span>Open Attendance Tracker</span>
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={20} color="var(--color-secondary)" />
              Examination Marks Entry
            </h3>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
            Input and validate student marks for scheduled assessments and practical exams with automatic limit checks.
          </p>
          <button onClick={() => setActiveTab("marks")} className="btn btn-secondary">
            <FileText size={16} />
            <span>Enter Exam Marks</span>
          </button>
        </div>
      </div>

      {/* My Assigned Courses Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">My Assigned Classes & Teaching Allocation</h3>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Class / Cohort</th>
                <th>Course Subject</th>
                <th>Subject Code</th>
                <th>Credits</th>
                <th>Classroom</th>
              </tr>
            </thead>
            <tbody>
              {myAssignments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                    No class assignments yet. Please contact the administrator.
                  </td>
                </tr>
              ) : (
                myAssignments.map((asn) => {
                  const cls = classes.find((c) => c.id === asn.classId);
                  const sub = subjects.find((s) => s.id === asn.subjectId);
                  return (
                    <tr key={asn.id}>
                      <td>
                        <strong>{cls ? cls.name : "Unknown Class"}</strong>
                      </td>
                      <td>
                        <strong>{sub ? sub.name : "Unknown Subject"}</strong>
                      </td>
                      <td>
                        <span className="badge badge-inactive">{sub ? sub.code : "—"}</span>
                      </td>
                      <td>{sub ? `${sub.credits} Credits` : "—"}</td>
                      <td>{cls ? cls.room : "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
