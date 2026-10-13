import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { FileText, Save, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const FacultyMarks = () => {
  const {
    currentUser,
    facultyAssignments,
    exams,
    classes,
    subjects,
    users,
    marks,
    saveMarks
  } = useApp();

  // Find assignments for this faculty
  const myAssignments = facultyAssignments.filter((a) => a.facultyId === currentUser.id);
  const assignedClassIds = [...new Set(myAssignments.map((a) => a.classId))];
  const assignedSubjectIds = [...new Set(myAssignments.map((a) => a.subjectId))];

  // Exams relevant to this faculty's classes & subjects (or all exams if flexible)
  const myExams = exams.filter(
    (e) => assignedClassIds.includes(e.classId) || assignedSubjectIds.includes(e.subjectId)
  );

  const [selectedExamId, setSelectedExamId] = useState(myExams[0]?.id || exams[0]?.id || "");
  const [marksMap, setMarksMap] = useState({});
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  // Enrolled students for this exam's class
  const examStudents = selectedExam
    ? users.filter((u) => u.role === "student" && u.classId === selectedExam.classId)
    : [];

  // Load existing saved marks when exam changes
  useEffect(() => {
    if (!selectedExamId) return;

    const existingRecord = marks.find((m) => m.examId === selectedExamId);
    if (existingRecord) {
      setMarksMap({ ...existingRecord.records });
    } else {
      setMarksMap({});
    }
    setValidationError("");
    setSuccessMsg("");
  }, [selectedExamId, marks]);

  const handleScoreChange = (studentId, value) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: value
    }));
    setValidationError("");
    setSuccessMsg("");
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMsg("");

    if (!selectedExam) {
      setValidationError("Please select an exam first.");
      return;
    }

    // Comprehensive client-side validation
    for (const student of examStudents) {
      const scoreVal = marksMap[student.id];
      if (scoreVal === "" || scoreVal === undefined || scoreVal === null) {
        continue; // Permitted if student was absent / not evaluated yet
      }

      const num = Number(scoreVal);
      if (isNaN(num)) {
        setValidationError(`Marks for ${student.name} must be a valid number.`);
        return;
      }

      if (num < 0) {
        setValidationError(`Marks for ${student.name} cannot be negative (entered: ${num}).`);
        return;
      }

      if (num > selectedExam.maxScore) {
        setValidationError(
          `Marks for ${student.name} (${num}) exceed the exam maximum score (${selectedExam.maxScore}).`
        );
        return;
      }
    }

    const res = saveMarks({
      examId: selectedExamId,
      records: marksMap
    });

    if (res.success) {
      setSuccessMsg(`Marks successfully saved for "${selectedExam.name}"!`);
    } else {
      setValidationError(res.message);
    }
  };

  const getClass = (id) => classes.find((c) => c.id === id);
  const getSubject = (id) => subjects.find((s) => s.id === id);

  if (exams.length === 0) {
    return (
      <EmptyState
        title="No Exams Available"
        description="There are currently no examinations scheduled. Please contact the administrator to create exams."
      />
    );
  }

  const examClass = selectedExam ? getClass(selectedExam.classId) : null;
  const examSubject = selectedExam ? getSubject(selectedExam.subjectId) : null;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem" }}>Examination Marks Entry</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Input, validate, and publish marks for scheduled examinations and term tests.
        </p>
      </div>

      {/* Exam Selector Card */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr", gap: "1.5rem", alignItems: "center" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Examination *</label>
            <select
              className="form-select"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
            >
              {(myExams.length > 0 ? myExams : exams).map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} - Max: {e.maxScore} pts ({e.date})
                </option>
              ))}
            </select>
          </div>

          {selectedExam && (
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "0.85rem 1rem",
                display: "flex",
                justifyContent: "space-around",
                fontSize: "0.85rem"
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>Class</span>
                <strong>{examClass ? examClass.name : "—"}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>Subject</span>
                <strong>{examSubject ? examSubject.name : "—"}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.75rem" }}>Max Score</span>
                <strong style={{ color: "#4f46e5", fontSize: "1.05rem" }}>{selectedExam.maxScore}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div
          style={{
            backgroundColor: "var(--color-danger-bg)",
            color: "var(--color-danger-text)",
            border: "1px solid var(--color-danger-border)",
            padding: "0.85rem 1.25rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <AlertTriangle size={18} />
          <span><strong>Validation Error:</strong> {validationError}</span>
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div
          style={{
            backgroundColor: "var(--color-success-bg)",
            color: "var(--color-success-text)",
            border: "1px solid var(--color-success-border)",
            padding: "0.85rem 1.25rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <CheckCircle size={18} />
          <span><strong>Success!</strong> {successMsg}</span>
        </div>
      )}

      {/* Student Marks Entry Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Enter Marks (0 to {selectedExam?.maxScore} pts)
          </h3>
          <button onClick={handleSaveMarks} className="btn btn-primary">
            <Save size={16} />
            <span>Save Marks</span>
          </button>
        </div>

        {examStudents.length === 0 ? (
          <EmptyState
            title="No Students in Cohort"
            description="There are no students enrolled in the class assigned to this exam."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th style={{ width: "200px" }}>Marks Obtained</th>
                  <th>Max Marks</th>
                  <th>Percentage</th>
                  <th>Grade Preview</th>
                </tr>
              </thead>
              <tbody>
                {examStudents.map((student) => {
                  const score = marksMap[student.id];
                  const hasValue = score !== "" && score !== undefined && score !== null;
                  const numScore = Number(score);
                  const max = selectedExam?.maxScore || 100;
                  const isInvalid = hasValue && (isNaN(numScore) || numScore < 0 || numScore > max);

                  let pct = null;
                  let grade = "—";
                  if (hasValue && !isInvalid) {
                    pct = Math.round((numScore / max) * 100);
                    if (pct >= 90) grade = "A+";
                    else if (pct >= 80) grade = "A";
                    else if (pct >= 70) grade = "B";
                    else if (pct >= 60) grade = "C";
                    else if (pct >= 50) grade = "D";
                    else grade = "F";
                  }

                  return (
                    <tr key={student.id} style={{ backgroundColor: isInvalid ? "#fef2f2" : "" }}>
                      <td>
                        <code style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: 700 }}>
                          {student.rollNo}
                        </code>
                      </td>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td>
                        <div style={{ position: "relative" }}>
                          <input
                            type="number"
                            min="0"
                            max={max}
                            step="0.5"
                            className="form-input"
                            value={score ?? ""}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                            placeholder="Enter score"
                            style={{
                              borderColor: isInvalid ? "#ef4444" : "",
                              fontWeight: 600,
                              fontSize: "0.95rem"
                            }}
                          />
                          {isInvalid && (
                            <span
                              style={{
                                color: "#ef4444",
                                fontSize: "0.72rem",
                                display: "block",
                                marginTop: "2px",
                                fontWeight: 600
                              }}
                            >
                              Must be between 0 and {max}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{max}</strong>
                      </td>
                      <td>
                        {pct !== null ? (
                          <strong style={{ color: pct >= 50 ? "#047857" : "#b91c1c" }}>
                            {pct}%
                          </strong>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {grade !== "—" ? (
                          <span
                            className={`badge ${
                              grade === "A+" || grade === "A"
                                ? "badge-present"
                                : grade === "F"
                                ? "badge-absent"
                                : "badge-late"
                            }`}
                          >
                            {grade}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {examStudents.length > 0 && (
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSaveMarks} className="btn btn-primary btn-lg">
              <Save size={18} />
              <span>Validate & Submit Marks</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
