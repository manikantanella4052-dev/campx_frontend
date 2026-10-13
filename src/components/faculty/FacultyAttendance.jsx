import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CalendarCheck, Save, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const FacultyAttendance = () => {
  const {
    currentUser,
    facultyAssignments,
    classes,
    subjects,
    users,
    attendance,
    saveAttendance
  } = useApp();

  // Find assignments for this faculty
  const myAssignments = facultyAssignments.filter((a) => a.facultyId === currentUser.id);

  // Available classes
  const assignedClassIds = [...new Set(myAssignments.map((a) => a.classId))];
  const myClasses = classes.filter((c) => assignedClassIds.includes(c.id));

  const [selectedClassId, setSelectedClassId] = useState(myClasses[0]?.id || "");

  // Available subjects for selected class
  const availableSubjectIds = myAssignments
    .filter((a) => a.classId === selectedClassId)
    .map((a) => a.subjectId);
  const mySubjectsForClass = subjects.filter((s) => availableSubjectIds.includes(s.id));

  const [selectedSubjectId, setSelectedSubjectId] = useState(mySubjectsForClass[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Attendance map: { [studentId]: "Present" | "Absent" | "Late" }
  const [statusMap, setStatusMap] = useState({});
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Update subject dropdown if class changes
  useEffect(() => {
    if (mySubjectsForClass.length > 0 && !availableSubjectIds.includes(selectedSubjectId)) {
      setSelectedSubjectId(mySubjectsForClass[0].id);
    }
  }, [selectedClassId, mySubjectsForClass]);

  // Students in selected class
  const classStudents = users.filter((u) => u.role === "student" && u.classId === selectedClassId);

  // Load existing attendance record if already saved for (class, subject, date)
  useEffect(() => {
    if (!selectedClassId || !selectedSubjectId || !selectedDate) return;

    const existingRecord = attendance.find(
      (a) =>
        a.classId === selectedClassId &&
        a.subjectId === selectedSubjectId &&
        a.date === selectedDate
    );

    if (existingRecord) {
      setIsEditingExisting(true);
      // Fill from existing, fallback to Present for any new students
      const initialMap = {};
      classStudents.forEach((student) => {
        initialMap[student.id] = existingRecord.records[student.id] || "Present";
      });
      setStatusMap(initialMap);
    } else {
      setIsEditingExisting(false);
      // Default all to Present
      const initialMap = {};
      classStudents.forEach((student) => {
        initialMap[student.id] = "Present";
      });
      setStatusMap(initialMap);
    }
    setSaveSuccessMsg("");
  }, [selectedClassId, selectedSubjectId, selectedDate, attendance, classStudents.length]);

  const handleStatusChange = (studentId, status) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
    setSaveSuccessMsg("");
  };

  const handleMarkAll = (status) => {
    const updated = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setStatusMap(updated);
    setSaveSuccessMsg("");
  };

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedSubjectId || !selectedDate) return;

    const res = saveAttendance({
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      date: selectedDate,
      records: statusMap
    });

    if (res.success) {
      setSaveSuccessMsg(
        isEditingExisting
          ? `Changes updated for session on ${selectedDate}!`
          : `Attendance successfully saved for ${selectedDate}!`
      );
    }
  };

  if (myClasses.length === 0) {
    return (
      <EmptyState
        title="No Assigned Classes Found"
        description="You do not have any teaching classes assigned yet. Please request the administrator to assign classes to your account."
      />
    );
  }

  // Summary counts for current entry
  const presentCount = Object.values(statusMap).filter((s) => s === "Present").length;
  const absentCount = Object.values(statusMap).filter((s) => s === "Absent").length;
  const lateCount = Object.values(statusMap).filter((s) => s === "Late").length;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem" }}>Student Attendance Tracker</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Mark, verify, and modify attendance entries for your assigned classes.
        </p>
      </div>

      {/* Filter and Selection Card */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Class *</label>
            <select
              className="form-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {myClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Subject *</label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              {mySubjectsForClass.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.code}] {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Session Date *</label>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Status indicator bar */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {isEditingExisting ? (
              <span className="badge badge-late" style={{ padding: "0.35rem 0.75rem" }}>
                Editing Saved Record ({selectedDate})
              </span>
            ) : (
              <span className="badge badge-active" style={{ padding: "0.35rem 0.75rem" }}>
                New Session Log
              </span>
            )}

            <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem" }}>
              <span>Present: <strong>{presentCount}</strong></span>
              <span>•</span>
              <span>Late: <strong>{lateCount}</strong></span>
              <span>•</span>
              <span>Absent: <strong>{absentCount}</strong></span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => handleMarkAll("Present")}
              className="btn btn-secondary btn-sm"
            >
              <CheckCircle2 size={14} color="#10b981" />
              <span>Mark All Present</span>
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll("Absent")}
              className="btn btn-secondary btn-sm"
            >
              <XCircle size={14} color="#ef4444" />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div
          style={{
            background: "var(--color-success-bg)",
            border: "1px solid var(--color-success-border)",
            color: "var(--color-success-text)",
            padding: "0.85rem 1.25rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <CheckCircle2 size={18} />
          <span><strong>Saved!</strong> {saveSuccessMsg}</span>
        </div>
      )}

      {/* Student Attendance List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Class Student Roster ({classStudents.length} Students)
          </h3>
          <button onClick={handleSaveAttendance} className="btn btn-primary">
            <Save size={16} />
            <span>{isEditingExisting ? "Save Changes" : "Save Attendance"}</span>
          </button>
        </div>

        {classStudents.length === 0 ? (
          <EmptyState
            title="No Students in this Class"
            description="There are currently no students enrolled in this section."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th style={{ textAlign: "center" }}>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student, idx) => {
                  const currentStatus = statusMap[student.id] || "Present";

                  return (
                    <tr key={student.id}>
                      <td style={{ color: "var(--text-muted)" }}>{idx + 1}</td>
                      <td>
                        <code style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: 700 }}>
                          {student.rollNo}
                        </code>
                      </td>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "Present")}
                            className={`btn btn-sm ${
                              currentStatus === "Present" ? "btn-success" : "btn-secondary"
                            }`}
                            style={{
                              minWidth: "85px",
                              backgroundColor: currentStatus === "Present" ? "#10b981" : "",
                              color: currentStatus === "Present" ? "#ffffff" : ""
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "Late")}
                            className={`btn btn-sm ${
                              currentStatus === "Late" ? "btn-warning" : "btn-secondary"
                            }`}
                            style={{
                              minWidth: "80px",
                              backgroundColor: currentStatus === "Late" ? "#f59e0b" : "",
                              color: currentStatus === "Late" ? "#ffffff" : ""
                            }}
                          >
                            <Clock size={14} />
                            <span>Late</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, "Absent")}
                            className={`btn btn-sm ${
                              currentStatus === "Absent" ? "btn-danger" : "btn-secondary"
                            }`}
                            style={{
                              minWidth: "85px",
                              backgroundColor: currentStatus === "Absent" ? "#ef4444" : "",
                              color: currentStatus === "Absent" ? "#ffffff" : ""
                            }}
                          >
                            <XCircle size={14} />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {classStudents.length > 0 && (
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSaveAttendance} className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>{isEditingExisting ? "Update Attendance Records" : "Submit Attendance"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
