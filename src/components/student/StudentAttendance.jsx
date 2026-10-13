import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CalendarCheck, AlertTriangle, CheckCircle, Clock, XCircle, Filter } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const StudentAttendance = () => {
  const { currentUser, attendance, subjects, classes } = useApp();

  const [filterSubjectId, setFilterSubjectId] = useState("all");

  // All attendance sessions for this student's class
  const classAttendance = attendance.filter((a) => a.classId === currentUser.classId);

  // Group by subjects for subject-wise attendance percentages
  // Get all unique subjects from attendance or from curriculum
  const classSubjects = subjects.filter((s) =>
    classAttendance.some((a) => a.subjectId === s.id)
  );

  const subjectWiseStats = classSubjects.map((sub) => {
    const subSessions = classAttendance.filter((a) => a.subjectId === sub.id);
    let present = 0;
    let late = 0;
    let absent = 0;

    subSessions.forEach((s) => {
      const status = s.records[currentUser.id];
      if (status === "Present") present++;
      else if (status === "Late") late++;
      else if (status === "Absent") absent++;
    });

    const total = subSessions.length;
    const percentage = total > 0 ? Math.round(((present + late * 0.75) / total) * 100) : 100;

    return {
      subject: sub,
      total,
      present,
      late,
      absent,
      percentage,
      isShortage: percentage < 75
    };
  });

  // Detailed chronological attendance log
  const attendanceLog = classAttendance
    .map((session) => {
      const status = session.records[currentUser.id];
      const sub = subjects.find((s) => s.id === session.subjectId);
      return {
        id: session.id,
        date: session.date,
        subject: sub,
        status: status || "Not Marked"
      };
    })
    .filter((entry) => filterSubjectId === "all" || entry.subject?.id === filterSubjectId)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort latest first

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem" }}>My Attendance Records & Analytics</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Subject-wise attendance percentages and complete chronological lecture logs.
        </p>
      </div>

      {/* Subject-Wise Performance Table */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-header">
          <h3 className="card-title">
            <CalendarCheck size={18} color="var(--color-primary)" />
            Subject-Wise Attendance Percentages
          </h3>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Threshold: 75% minimum required
          </span>
        </div>

        {subjectWiseStats.length === 0 ? (
          <EmptyState
            title="No Attendance Recorded"
            description="Your faculty instructors have not recorded attendance for your courses yet."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Course Subject</th>
                  <th>Code</th>
                  <th>Sessions Held</th>
                  <th>Present</th>
                  <th>Late</th>
                  <th>Absent</th>
                  <th style={{ width: "220px" }}>Attendance Percentage</th>
                  <th>Eligibility</th>
                </tr>
              </thead>
              <tbody>
                {subjectWiseStats.map((item) => (
                  <tr key={item.subject.id}>
                    <td>
                      <strong>{item.subject.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-inactive">{item.subject.code}</span>
                    </td>
                    <td>{item.total}</td>
                    <td>
                      <span className="badge badge-present">{item.present}</span>
                    </td>
                    <td>
                      <span className="badge badge-late">{item.late}</span>
                    </td>
                    <td>
                      <span className="badge badge-absent">{item.absent}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            flex: 1,
                            height: 8,
                            backgroundColor: "#e2e8f0",
                            borderRadius: 4,
                            overflow: "hidden"
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(100, item.percentage)}%`,
                              height: "100%",
                              backgroundColor: item.percentage >= 75 ? "#10b981" : "#ef4444"
                            }}
                          />
                        </div>
                        <strong
                          style={{
                            minWidth: "42px",
                            color: item.percentage >= 75 ? "#047857" : "#b91c1c"
                          }}
                        >
                          {item.percentage}%
                        </strong>
                      </div>
                    </td>
                    <td>
                      {item.isShortage ? (
                        <span className="badge badge-absent" style={{ display: "inline-flex", gap: "0.3rem" }}>
                          <AlertTriangle size={12} />
                          Shortage Alert
                        </span>
                      ) : (
                        <span className="badge badge-present">Eligible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chronological Lecture History Log */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Chronological Daily Lecture Log
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.825rem" }}
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {classSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.code}] {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {attendanceLog.length === 0 ? (
          <EmptyState
            title="No Lecture Logs Found"
            description="No lecture attendance records found matching this filter."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Session Date</th>
                  <th>Course Subject</th>
                  <th>Subject Code</th>
                  <th>Status Recorded</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLog.map((log) => {
                  let badgeClass = "badge-inactive";
                  if (log.status === "Present") badgeClass = "badge-present";
                  else if (log.status === "Late") badgeClass = "badge-late";
                  else if (log.status === "Absent") badgeClass = "badge-absent";

                  return (
                    <tr key={log.id}>
                      <td>
                        <strong>{log.date}</strong>
                      </td>
                      <td>{log.subject ? log.subject.name : "Subject"}</td>
                      <td>
                        <span className="badge badge-inactive">
                          {log.subject ? log.subject.code : "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{log.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
