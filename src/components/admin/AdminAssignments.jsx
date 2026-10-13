import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { UserCheck, Trash2, Plus, AlertCircle } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const AdminAssignments = () => {
  const {
    users,
    classes,
    subjects,
    facultyAssignments,
    assignFaculty,
    removeFacultyAssignment
  } = useApp();

  const activeFaculty = users.filter((u) => u.role === "faculty" && u.status === "active");

  const [selectedFacultyId, setSelectedFacultyId] = useState(activeFaculty[0]?.id || "");
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || "");
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || "");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAssign = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedFacultyId || !selectedClassId || !selectedSubjectId) {
      setErrorMsg("Please select faculty, class, and subject.");
      return;
    }

    const res = assignFaculty({
      facultyId: selectedFacultyId,
      classId: selectedClassId,
      subjectId: selectedSubjectId
    });

    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const getFaculty = (id) => users.find((u) => u.id === id);
  const getClass = (id) => classes.find((c) => c.id === id);
  const getSubject = (id) => subjects.find((s) => s.id === id);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem" }}>Faculty Course Assignments</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Map faculty members to designated classes and curriculum subjects for teaching, attendance, and grading.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Assignment Form Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Plus size={18} color="var(--color-primary)" />
              New Assignment
            </h3>
          </div>

          <form onSubmit={handleAssign}>
            {errorMsg && (
              <div
                style={{
                  backgroundColor: "var(--color-danger-bg)",
                  color: "var(--color-danger-text)",
                  border: "1px solid var(--color-danger-border)",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.825rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Select Faculty Member *</label>
              {activeFaculty.length === 0 ? (
                <div style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>
                  No active faculty found. Please add or activate faculty first.
                </div>
              ) : (
                <select
                  className="form-select"
                  value={selectedFacultyId}
                  onChange={(e) => setSelectedFacultyId(e.target.value)}
                  required
                >
                  {activeFaculty.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.designation || "Faculty"})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Target Class / Section *</label>
              <select
                className="form-select"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
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
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                required
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.code}] {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.75rem" }}
              disabled={activeFaculty.length === 0}
            >
              <UserCheck size={16} />
              <span>Assign Course</span>
            </button>
          </form>
        </div>

        {/* Existing Assignments Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              Current Faculty Course Mappings ({facultyAssignments.length})
            </h3>
          </div>

          {facultyAssignments.length === 0 ? (
            <EmptyState
              title="No Faculty Assignments Yet"
              description="Use the assignment form on the left to map professors to classes and courses."
            />
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Faculty Member</th>
                    <th>Assigned Class</th>
                    <th>Course Subject</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyAssignments.map((asn) => {
                    const faculty = getFaculty(asn.facultyId);
                    const cls = getClass(asn.classId);
                    const subject = getSubject(asn.subjectId);

                    return (
                      <tr key={asn.id}>
                        <td>
                          <strong>{faculty ? faculty.name : "Unassigned"}</strong>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {faculty ? faculty.designation : "Faculty"}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-active">{cls ? cls.name : "Unknown Class"}</span>
                        </td>
                        <td>
                          {subject ? (
                            <div>
                              <strong>{subject.name}</strong>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                Code: {subject.code} • {subject.credits} Credits
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            onClick={() => {
                              if (window.confirm("Remove this faculty assignment?")) {
                                removeFacultyAssignment(asn.id);
                              }
                            }}
                            className="btn btn-sm"
                            style={{ background: "#fee2e2", color: "#b91c1c" }}
                            title="Unassign Faculty"
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
        </div>
      </div>
    </div>
  );
};
