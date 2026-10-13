import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { FileCheck2, Plus, Trash2, Calendar, Award, X } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const AdminExams = () => {
  const { classes, subjects, exams, marks, createExam, deleteExam } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [examName, setExamName] = useState("");
  const [examClassId, setExamClassId] = useState(classes[0]?.id || "");
  const [examSubjectId, setExamSubjectId] = useState(subjects[0]?.id || "");
  const [examDate, setExamDate] = useState(new Date().toISOString().split("T")[0]);
  const [examMaxScore, setExamMaxScore] = useState(50);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateExam = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!examName.trim() || !examClassId || !examSubjectId || !examDate || !examMaxScore) {
      setErrorMsg("All fields are required.");
      return;
    }

    const res = createExam({
      name: examName,
      classId: examClassId,
      subjectId: examSubjectId,
      date: examDate,
      maxScore: examMaxScore
    });

    if (res.success) {
      setShowAddModal(false);
      setExamName("");
    } else {
      setErrorMsg(res.message);
    }
  };

  const getClass = (id) => classes.find((c) => c.id === id);
  const getSubject = (id) => subjects.find((s) => s.id === id);

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
          <h2 style={{ fontSize: "1.4rem" }}>Examination Schedule & Assessment</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Schedule midterm assessments, practical exams, and finals for classes and subjects.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Schedule New Exam</span>
        </button>
      </div>

      {exams.length === 0 ? (
        <EmptyState
          title="No Examinations Scheduled"
          description="Create your first exam to begin recording student assessment marks."
          actionText="Create Exam"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Target Class</th>
                <th>Course Subject</th>
                <th>Exam Date</th>
                <th>Maximum Score</th>
                <th>Grading Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => {
                const cls = getClass(exam.classId);
                const sub = getSubject(exam.subjectId);
                const markRecord = marks.find((m) => m.examId === exam.id);
                const gradedCount = markRecord ? Object.keys(markRecord.records).length : 0;

                return (
                  <tr key={exam.id}>
                    <td>
                      <strong>{exam.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-active">{cls ? cls.name : "—"}</span>
                    </td>
                    <td>
                      {sub ? (
                        <div>
                          <strong>{sub.name}</strong>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: 6 }}>
                            ({sub.code})
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        <span>{exam.date}</span>
                      </div>
                    </td>
                    <td>
                      <strong>{exam.maxScore} pts</strong>
                    </td>
                    <td>
                      {gradedCount > 0 ? (
                        <span className="badge badge-present">
                          Graded ({gradedCount} students)
                        </span>
                      ) : (
                        <span className="badge badge-inactive">Pending Marks</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete exam "${exam.name}" and any submitted marks?`)) {
                            deleteExam(exam.id);
                          }
                        }}
                        className="btn btn-sm"
                        style={{ background: "#fee2e2", color: "#b91c1c" }}
                        title="Delete Exam"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">Schedule New Examination</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateExam}>
              <div className="modal-body">
                {errorMsg && (
                  <div
                    style={{
                      background: "var(--color-danger-bg)",
                      color: "var(--color-danger-text)",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "1rem",
                      fontSize: "0.85rem"
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Exam Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Midterm Assessment 1, Final Exam"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Target Class *</label>
                    <select
                      className="form-select"
                      value={examClassId}
                      onChange={(e) => setExamClassId(e.target.value)}
                      required
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject Course *</label>
                    <select
                      className="form-select"
                      value={examSubjectId}
                      onChange={(e) => setExamSubjectId(e.target.value)}
                      required
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          [{s.code}] {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Exam Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maximum Score (Max Marks) *</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      className="form-input"
                      value={examMaxScore}
                      onChange={(e) => setExamMaxScore(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
