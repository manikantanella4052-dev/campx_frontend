import React from "react";
import { useApp } from "../../context/AppContext";
import {
  CalendarCheck,
  Award,
  AlertTriangle,
  CheckCircle,
  FileText,
  Building2,
  GraduationCap,
  Clock
} from "lucide-react";

export const StudentDashboard = ({ setActiveTab }) => {
  const { currentUser, classes, departments, subjects, exams, attendance, marks } = useApp();

  const myClass = classes.find((c) => c.id === currentUser.classId);
  const myDept = departments.find((d) => d.id === currentUser.departmentId);

  // Relevant attendance sessions for this student's class
  const classAttendanceSessions = attendance.filter((a) => a.classId === currentUser.classId);

  let totalSessions = 0;
  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;

  classAttendanceSessions.forEach((session) => {
    const status = session.records[currentUser.id];
    if (status) {
      totalSessions++;
      if (status === "Present") presentCount++;
      else if (status === "Late") lateCount++;
      else if (status === "Absent") absentCount++;
    }
  });

  const overallAttendancePercentage =
    totalSessions > 0
      ? Math.round(((presentCount + lateCount * 0.75) / totalSessions) * 100)
      : 100;

  const isShortage = overallAttendancePercentage < 75;

  // Student's marks across all exams
  const studentExamMarks = exams
    .map((exam) => {
      const markEntry = marks.find((m) => m.examId === exam.id);
      const score = markEntry?.records[currentUser.id];
      const hasScore = score !== undefined && score !== null && score !== "";
      const numScore = hasScore ? Number(score) : null;
      const sub = subjects.find((s) => s.id === exam.subjectId);
      const percentage = numScore !== null ? Math.round((numScore / exam.maxScore) * 100) : null;

      return {
        exam,
        subject: sub,
        score: numScore,
        maxScore: exam.maxScore,
        percentage
      };
    })
    .filter((e) => e.score !== null);

  const avgMarksPercentage =
    studentExamMarks.length > 0
      ? Math.round(studentExamMarks.reduce((acc, m) => acc + m.percentage, 0) / studentExamMarks.length)
      : 0;

  return (
    <div>
      {/* Student Banner */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          color: "#ffffff",
          marginBottom: "1.75rem",
          padding: "1.75rem",
          borderColor: "#3730a3"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <span className="badge badge-active" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                Roll No: {currentUser.rollNo || "N/A"}
              </span>
              <span className="badge badge-inactive" style={{ background: "rgba(255,255,255,0.1)", color: "#c7d2fe" }}>
                {myClass ? myClass.name : "Class Not Assigned"}
              </span>
            </div>
            <h2 style={{ color: "#ffffff", fontSize: "1.6rem" }}>Hello, {currentUser.name}!</h2>
            <p style={{ color: "#c7d2fe", fontSize: "0.88rem" }}>
              {myDept ? myDept.name : "Department Not Assigned"} • Semester {currentUser.semester || "N/A"}
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "var(--radius-lg)",
              padding: "1rem 1.5rem",
              textAlign: "center",
              backdropFilter: "blur(5px)"
            }}
          >
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#c7d2fe" }}>
              Attendance Rating
            </span>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: isShortage ? "#fca5a5" : "#34d399",
                lineHeight: 1.1
              }}
            >
              {overallAttendancePercentage}%
            </div>
            <span style={{ fontSize: "0.75rem", color: "#e0e7ff" }}>
              {isShortage ? "⚠️ Below 75% Requirement" : "✅ Attendance Compliant"}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Warning if < 75% */}
      {isShortage && (
        <div
          style={{
            backgroundColor: "var(--color-danger-bg)",
            border: "1px solid var(--color-danger-border)",
            color: "var(--color-danger-text)",
            padding: "1rem 1.25rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}
        >
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>Attendance Shortage Alert!</strong> Your current attendance ({overallAttendancePercentage}%)
            is below the mandatory 75% institutional requirement. Please meet your faculty advisor to regularize your attendance.
          </div>
        </div>
      )}

      {/* Key Metric KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--stat-accent": isShortage ? "#ef4444" : "#10b981" }}>
          <div className="stat-content">
            <span className="stat-label">Overall Attendance</span>
            <span className="stat-value" style={{ color: isShortage ? "#ef4444" : "#10b981" }}>
              {overallAttendancePercentage}%
            </span>
            <span className="stat-subtext">
              Attended {presentCount + lateCount} of {totalSessions} total lectures
            </span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{
              "--stat-icon-bg": isShortage ? "#fef2f2" : "#ecfdf5",
              "--stat-icon-color": isShortage ? "#ef4444" : "#10b981"
            }}
          >
            <CalendarCheck size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#4f46e5" }}>
          <div className="stat-content">
            <span className="stat-label">Exam Average</span>
            <span className="stat-value">{avgMarksPercentage}%</span>
            <span className="stat-subtext">Across {studentExamMarks.length} graded exams</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#eef2ff", "--stat-icon-color": "#4f46e5" }}
          >
            <Award size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#0ea5e9" }}>
          <div className="stat-content">
            <span className="stat-label">Lectures Present</span>
            <span className="stat-value">{presentCount}</span>
            <span className="stat-subtext">{lateCount} late arrivals noted</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#f0f9ff", "--stat-icon-color": "#0ea5e9" }}
          >
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#f59e0b" }}>
          <div className="stat-content">
            <span className="stat-label">Unexcused Absences</span>
            <span className="stat-value">{absentCount}</span>
            <span className="stat-subtext">Missed sessions</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#fffbeb", "--stat-icon-color": "#f59e0b" }}
          >
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Marks & Attendance Breakdown Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem" }}>
        {/* Recent Marks */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={18} color="var(--color-primary)" />
              Recent Examination Results
            </h3>
            <button onClick={() => setActiveTab("marks")} className="btn btn-secondary btn-sm">
              View All Marks
            </button>
          </div>

          {studentExamMarks.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", padding: "1rem" }}>
              No examination marks published yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {studentExamMarks.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "#f8fafc",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                      {item.exam.name}
                    </div>
                    <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                      {item.subject ? item.subject.name : "Subject"} • {item.exam.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#4f46e5" }}>
                      {item.score} <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>/ {item.maxScore}</span>
                    </div>
                    <span
                      className={`badge ${item.percentage >= 50 ? "badge-present" : "badge-absent"}`}
                      style={{ fontSize: "0.72rem" }}
                    >
                      {item.percentage}% {item.percentage >= 50 ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Academic Profile Quick Glance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <GraduationCap size={18} color="var(--color-secondary)" />
              Student Academic Overview
            </h3>
            <button onClick={() => setActiveTab("profile")} className="btn btn-secondary btn-sm">
              Profile Details
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Full Name:</span>
              <strong>{currentUser.name}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>University Roll No:</span>
              <code style={{ color: "#4f46e5", fontWeight: 700 }}>{currentUser.rollNo}</code>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Department:</span>
              <span>{myDept ? myDept.name : "Not Assigned"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Class & Section:</span>
              <strong>{myClass ? myClass.name : "Not Assigned"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Academic Standing:</span>
              <span className="badge badge-active">Good Standing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
