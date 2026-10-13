import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BarChart3, CalendarCheck, FileText, CheckCircle, AlertTriangle, XCircle, Award, Printer } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const AdminReports = () => {
  const { classes, subjects, users, exams, attendance, marks } = useApp();

  const [reportType, setReportType] = useState("attendance"); // 'attendance' | 'marks'

  // Attendance Filters
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || "");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");

  // Marks Filters
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || "");

  // Helper calculations for Attendance Report
  const classStudents = users.filter((u) => u.role === "student" && u.classId === selectedClassId);

  const relevantAttendanceSessions = attendance.filter((att) => {
    const matchClass = att.classId === selectedClassId;
    const matchSubject = selectedSubjectId === "all" || att.subjectId === selectedSubjectId;
    return matchClass && matchSubject;
  });

  const totalSessions = relevantAttendanceSessions.length;

  const studentAttendanceStats = classStudents.map((student) => {
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    relevantAttendanceSessions.forEach((session) => {
      const status = session.records[student.id];
      if (status === "Present") presentCount++;
      else if (status === "Late") lateCount++;
      else if (status === "Absent") absentCount++;
    });

    // Attendance % counting Present fully (1.0) and Late as 0.5 (or full session present with late mark)
    // In standard academic systems, late is often credited as half or full attendance. Let's credit late as 0.75 or 1.0. Let's use (present + late * 0.75) / total * 100:
    const percentage =
      totalSessions > 0
        ? Math.round(((presentCount + lateCount * 0.75) / totalSessions) * 100)
        : 100;

    return {
      student,
      presentCount,
      lateCount,
      absentCount,
      totalSessions,
      percentage,
      isShortage: percentage < 75
    };
  });

  const overallClassAvgAttendance =
    studentAttendanceStats.length > 0
      ? Math.round(
          studentAttendanceStats.reduce((acc, s) => acc + s.percentage, 0) /
            studentAttendanceStats.length
        )
      : 0;

  // Marks Report calculations
  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const examMarkEntry = marks.find((m) => m.examId === selectedExamId);
  const examRecords = examMarkEntry?.records || {};

  const examClassStudents = selectedExam
    ? users.filter((u) => u.role === "student" && u.classId === selectedExam.classId)
    : [];

  const studentMarksStats = examClassStudents.map((student) => {
    const rawScore = examRecords[student.id];
    const score = rawScore !== undefined && rawScore !== null && rawScore !== "" ? Number(rawScore) : null;
    const maxScore = selectedExam?.maxScore || 100;
    const percentage = score !== null ? Math.round((score / maxScore) * 100) : null;

    let grade = "—";
    let isPass = false;
    if (percentage !== null) {
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";
      else grade = "F";

      isPass = percentage >= 40;
    }

    return {
      student,
      score,
      maxScore,
      percentage,
      grade,
      isPass
    };
  });

  const gradedStudents = studentMarksStats.filter((s) => s.score !== null);
  const highestScore = gradedStudents.length > 0 ? Math.max(...gradedStudents.map((s) => s.score)) : 0;
  const lowestScore = gradedStudents.length > 0 ? Math.min(...gradedStudents.map((s) => s.score)) : 0;
  const avgScore =
    gradedStudents.length > 0
      ? (gradedStudents.reduce((acc, s) => acc + s.score, 0) / gradedStudents.length).toFixed(1)
      : 0;
  const passedStudentsCount = gradedStudents.filter((s) => s.isPass).length;
  const passRate =
    gradedStudents.length > 0 ? Math.round((passedStudentsCount / gradedStudents.length) * 100) : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.4rem" }}>Academic Reports & Performance Analytics</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Comprehensive analytics for student attendance compliance and examination score distributions.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          title="Print or export current report"
        >
          <Printer size={16} />
          <span>Print / Export Report</span>
        </button>
      </div>

      {/* Main Report Type Toggle */}
      <div className="card" style={{ padding: "0.5rem 1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className={`btn ${reportType === "attendance" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setReportType("attendance")}
          >
            <CalendarCheck size={16} />
            <span>Attendance Reports</span>
          </button>
          <button
            className={`btn ${reportType === "marks" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setReportType("marks")}
          >
            <FileText size={16} />
            <span>Examination & Marks Reports</span>
          </button>
        </div>
      </div>

      {/* ===================== ATTENDANCE REPORT VIEW ===================== */}
      {reportType === "attendance" && (
        <div>
          {/* Filter Bar */}
          <div
            className="card"
            style={{
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              flexWrap: "wrap"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Select Class:</span>
              <select
                className="form-select"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{ width: "auto" }}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Filter Subject:</span>
              <select
                className="form-select"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                style={{ width: "auto" }}
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.code}] {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendance KPI Cards */}
          <div className="stats-grid">
            <div className="stat-card" style={{ "--stat-accent": "#10b981" }}>
              <div className="stat-content">
                <span className="stat-label">Class Avg Attendance</span>
                <span className="stat-value">{overallClassAvgAttendance}%</span>
                <span className="stat-subtext">Cumulative average attendance</span>
              </div>
              <div
                className="stat-icon-wrapper"
                style={{ "--stat-icon-bg": "#ecfdf5", "--stat-icon-color": "#10b981" }}
              >
                <CheckCircle size={24} />
              </div>
            </div>

            <div className="stat-card" style={{ "--stat-accent": "#4f46e5" }}>
              <div className="stat-content">
                <span className="stat-label">Sessions Held</span>
                <span className="stat-value">{totalSessions}</span>
                <span className="stat-subtext">Recorded class lectures</span>
              </div>
              <div
                className="stat-icon-wrapper"
                style={{ "--stat-icon-bg": "#eef2ff", "--stat-icon-color": "#4f46e5" }}
              >
                <CalendarCheck size={24} />
              </div>
            </div>

            <div className="stat-card" style={{ "--stat-accent": "#f59e0b" }}>
              <div className="stat-content">
                <span className="stat-label">Enrolled Cohort</span>
                <span className="stat-value">{classStudents.length}</span>
                <span className="stat-subtext">Students in this section</span>
              </div>
              <div
                className="stat-icon-wrapper"
                style={{ "--stat-icon-bg": "#fffbeb", "--stat-icon-color": "#f59e0b" }}
              >
                <BarChart3 size={24} />
              </div>
            </div>
          </div>

          {/* Student Breakdown Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Student Attendance Breakdown & Eligibility</h3>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Minimum 75% required for exam eligibility
              </span>
            </div>

            {studentAttendanceStats.length === 0 ? (
              <EmptyState title="No Students Enrolled" description="There are no students enrolled in this class." />
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Roll Number</th>
                      <th>Present</th>
                      <th>Late</th>
                      <th>Absent</th>
                      <th>Attendance %</th>
                      <th>Eligibility Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttendanceStats.map((item) => (
                      <tr key={item.student.id}>
                        <td>
                          <strong>{item.student.name}</strong>
                        </td>
                        <td>
                          <code style={{ fontSize: "0.825rem", color: "#4f46e5" }}>
                            {item.student.rollNo}
                          </code>
                        </td>
                        <td>
                          <span className="badge badge-present">{item.presentCount}</span>
                        </td>
                        <td>
                          <span className="badge badge-late">{item.lateCount}</span>
                        </td>
                        <td>
                          <span className="badge badge-absent">{item.absentCount}</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <strong
                              style={{
                                color: item.percentage >= 75 ? "var(--color-success-text)" : "var(--color-danger)"
                              }}
                            >
                              {item.percentage}%
                            </strong>
                            <div
                              style={{
                                width: 60,
                                height: 6,
                                background: "#e2e8f0",
                                borderRadius: 4,
                                overflow: "hidden"
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(100, item.percentage)}%`,
                                  height: "100%",
                                  background: item.percentage >= 75 ? "#10b981" : "#ef4444"
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          {item.percentage >= 75 ? (
                            <span className="badge badge-present">Eligible</span>
                          ) : (
                            <span className="badge badge-absent" style={{ display: "inline-flex", gap: "0.3rem" }}>
                              <AlertTriangle size={12} />
                              Shortage Warning
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== MARKS REPORT VIEW ===================== */}
      {reportType === "marks" && (
        <div>
          {/* Exam Selector */}
          <div
            className="card"
            style={{
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              flexWrap: "wrap"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Select Examination:</span>
              <select
                className="form-select"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                style={{ width: "auto" }}
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.date}) - Max: {ex.maxScore}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!selectedExam ? (
            <EmptyState title="No Exam Selected" description="Please select an exam to view marks." />
          ) : (
            <>
              {/* Exam KPI Stats */}
              <div className="stats-grid">
                <div className="stat-card" style={{ "--stat-accent": "#4f46e5" }}>
                  <div className="stat-content">
                    <span className="stat-label">Class Average Score</span>
                    <span className="stat-value">
                      {avgScore} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ {selectedExam.maxScore}</span>
                    </span>
                    <span className="stat-subtext">Mean performance across graded students</span>
                  </div>
                  <div
                    className="stat-icon-wrapper"
                    style={{ "--stat-icon-bg": "#eef2ff", "--stat-icon-color": "#4f46e5" }}
                  >
                    <BarChart3 size={24} />
                  </div>
                </div>

                <div className="stat-card" style={{ "--stat-accent": "#10b981" }}>
                  <div className="stat-content">
                    <span className="stat-label">Pass Percentage</span>
                    <span className="stat-value">{passRate}%</span>
                    <span className="stat-subtext">{passedStudentsCount} of {gradedStudents.length} students passed</span>
                  </div>
                  <div
                    className="stat-icon-wrapper"
                    style={{ "--stat-icon-bg": "#ecfdf5", "--stat-icon-color": "#10b981" }}
                  >
                    <CheckCircle size={24} />
                  </div>
                </div>

                <div className="stat-card" style={{ "--stat-accent": "#f59e0b" }}>
                  <div className="stat-content">
                    <span className="stat-label">Highest Score (Topper)</span>
                    <span className="stat-value">
                      {highestScore} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ {selectedExam.maxScore}</span>
                    </span>
                    <span className="stat-subtext">Lowest score: {lowestScore}</span>
                  </div>
                  <div
                    className="stat-icon-wrapper"
                    style={{ "--stat-icon-bg": "#fffbeb", "--stat-icon-color": "#f59e0b" }}
                  >
                    <Award size={24} />
                  </div>
                </div>
              </div>

              {/* Student Marks Table */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Student Marks Roster: {selectedExam.name}
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Date: {selectedExam.date} • Maximum Score: {selectedExam.maxScore}
                  </span>
                </div>

                {studentMarksStats.length === 0 ? (
                  <EmptyState title="No Students Found" description="No students found for this exam's class." />
                ) : (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Roll Number</th>
                          <th>Score Obtained</th>
                          <th>Max Marks</th>
                          <th>Percentage</th>
                          <th>Grade</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentMarksStats.map((item) => (
                          <tr key={item.student.id}>
                            <td>
                              <strong>{item.student.name}</strong>
                            </td>
                            <td>
                              <code style={{ fontSize: "0.825rem", color: "#4f46e5" }}>
                                {item.student.rollNo}
                              </code>
                            </td>
                            <td>
                              {item.score !== null ? (
                                <strong style={{ fontSize: "1rem" }}>{item.score}</strong>
                              ) : (
                                <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                                  Not Entered
                                </span>
                              )}
                            </td>
                            <td>{item.maxScore}</td>
                            <td>{item.percentage !== null ? `${item.percentage}%` : "—"}</td>
                            <td>
                              {item.grade !== "—" ? (
                                <span
                                  className={`badge ${
                                    item.grade === "A+" || item.grade === "A"
                                      ? "badge-present"
                                      : item.grade === "F"
                                      ? "badge-absent"
                                      : "badge-late"
                                  }`}
                                >
                                  {item.grade}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td>
                              {item.score !== null ? (
                                item.isPass ? (
                                  <span className="badge badge-present">Passed</span>
                                ) : (
                                  <span className="badge badge-absent">Failed</span>
                                )
                              ) : (
                                <span className="badge badge-inactive">Pending</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
