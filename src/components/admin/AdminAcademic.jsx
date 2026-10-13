import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Building2, Layers, BookOpen, Plus, Trash2, X } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const AdminAcademic = () => {
  const {
    departments,
    classes,
    subjects,
    users,
    addDepartment,
    deleteDepartment,
    addClass,
    deleteClass,
    addSubject,
    deleteSubject
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState("classes"); // 'classes' | 'departments' | 'subjects'

  // Department Modal State
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptHOD, setDeptHOD] = useState("");
  const [deptDesc, setDeptDesc] = useState("");
  const [deptError, setDeptError] = useState("");

  // Class Modal State
  const [showClassModal, setShowClassModal] = useState(false);
  const [className, setClassName] = useState("");
  const [classDeptId, setClassDeptId] = useState(departments[0]?.id || "");
  const [classSemester, setClassSemester] = useState(1);
  const [classRoom, setClassRoom] = useState("");
  const [classYear, setClassYear] = useState("2026-2027");
  const [classError, setClassError] = useState("");

  // Subject Modal State
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subName, setSubName] = useState("");
  const [subCode, setSubCode] = useState("");
  const [subDeptId, setSubDeptId] = useState(departments[0]?.id || "");
  const [subCredits, setSubCredits] = useState(3);
  const [subError, setSubError] = useState("");

  // Handlers
  const handleCreateDept = (e) => {
    e.preventDefault();
    setDeptError("");
    if (!deptName.trim() || !deptCode.trim()) {
      setDeptError("Department name and code are required.");
      return;
    }
    const res = addDepartment({
      name: deptName,
      code: deptCode,
      headOfDept: deptHOD,
      description: deptDesc
    });
    if (res.success) {
      setShowDeptModal(false);
      setDeptName("");
      setDeptCode("");
      setDeptHOD("");
      setDeptDesc("");
    } else {
      setDeptError(res.message);
    }
  };

  const handleCreateClass = (e) => {
    e.preventDefault();
    setClassError("");
    if (!className.trim() || !classDeptId) {
      setClassError("Class name and department are required.");
      return;
    }
    const res = addClass({
      name: className,
      departmentId: classDeptId,
      semester: classSemester,
      room: classRoom,
      academicYear: classYear
    });
    if (res.success) {
      setShowClassModal(false);
      setClassName("");
      setClassRoom("");
    } else {
      setClassError(res.message);
    }
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    setSubError("");
    if (!subName.trim() || !subCode.trim() || !subDeptId) {
      setSubError("Subject name, code, and department are required.");
      return;
    }
    const res = addSubject({
      name: subName,
      code: subCode,
      departmentId: subDeptId,
      credits: subCredits
    });
    if (res.success) {
      setShowSubjectModal(false);
      setSubName("");
      setSubCode("");
    } else {
      setSubError(res.message);
    }
  };

  const getDeptCode = (id) => {
    const d = departments.find((dept) => dept.id === id);
    return d ? d.code : "—";
  };

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
          <h2 style={{ fontSize: "1.4rem" }}>Academic Structure Management</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Configure academic departments, class sections, and course subjects.
          </p>
        </div>

        <div>
          {activeSubTab === "classes" && (
            <button onClick={() => setShowClassModal(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Add New Class</span>
            </button>
          )}
          {activeSubTab === "departments" && (
            <button onClick={() => setShowDeptModal(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Department</span>
            </button>
          )}
          {activeSubTab === "subjects" && (
            <button onClick={() => setShowSubjectModal(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="card" style={{ padding: "0.5rem 1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className={`btn ${activeSubTab === "classes" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveSubTab("classes")}
          >
            <Layers size={16} />
            <span>Classes & Cohorts ({classes.length})</span>
          </button>
          <button
            className={`btn ${activeSubTab === "departments" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveSubTab("departments")}
          >
            <Building2 size={16} />
            <span>Departments ({departments.length})</span>
          </button>
          <button
            className={`btn ${activeSubTab === "subjects" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveSubTab("subjects")}
          >
            <BookOpen size={16} />
            <span>Subjects & Curriculum ({subjects.length})</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 1: CLASSES */}
      {activeSubTab === "classes" && (
        <div>
          {classes.length === 0 ? (
            <EmptyState
              title="No Classes Configured"
              description="Create your first class cohort to organize students."
              actionText="Add Class"
              onAction={() => setShowClassModal(true)}
            />
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Classroom / Room</th>
                    <th>Enrolled Students</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => {
                    const studentCount = users.filter((u) => u.classId === c.id).length;
                    return (
                      <tr key={c.id}>
                        <td>
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            AY {c.academicYear}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-inactive">{getDeptCode(c.departmentId)}</span>
                        </td>
                        <td>Semester {c.semester}</td>
                        <td>{c.room}</td>
                        <td>
                          <span className="badge badge-active">{studentCount} Students</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete class ${c.name}?`)) {
                                deleteClass(c.id);
                              }
                            }}
                            className="btn btn-sm"
                            style={{ background: "#fee2e2", color: "#b91c1c" }}
                            title="Delete Class"
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
      )}

      {/* SUB TAB 2: DEPARTMENTS */}
      {activeSubTab === "departments" && (
        <div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Code</th>
                  <th>Head of Department</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <strong>{dept.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-inactive">{dept.code}</span>
                    </td>
                    <td>{dept.headOfDept || "—"}</td>
                    <td style={{ fontSize: "0.825rem", color: "var(--text-muted)", maxWidth: 300 }}>
                      {dept.description}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete department ${dept.name}?`)) {
                            deleteDepartment(dept.id);
                          }
                        }}
                        className="btn btn-sm"
                        style={{ background: "#fee2e2", color: "#b91c1c" }}
                        title="Delete Department"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: SUBJECTS */}
      {activeSubTab === "subjects" && (
        <div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Department</th>
                  <th>Credits</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <span className="badge badge-inactive">{sub.code}</span>
                    </td>
                    <td>
                      <strong>{sub.name}</strong>
                    </td>
                    <td>{getDeptCode(sub.departmentId)}</td>
                    <td>
                      <span className="badge badge-role-faculty">{sub.credits} Credits</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete subject ${sub.name}?`)) {
                            deleteSubject(sub.id);
                          }
                        }}
                        className="btn btn-sm"
                        style={{ background: "#fee2e2", color: "#b91c1c" }}
                        title="Delete Subject"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD CLASS MODAL */}
      {showClassModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">Create Class Section</h3>
              <button onClick={() => setShowClassModal(false)} style={{ background: "none", border: "none" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateClass}>
              <div className="modal-body">
                {classError && <div style={{ color: "var(--color-danger)", marginBottom: "1rem" }}>{classError}</div>}
                <div className="form-group">
                  <label className="form-label">Class Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Year 3 - Section A (CSE)"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Department *</label>
                    <select
                      className="form-select"
                      value={classDeptId}
                      onChange={(e) => setClassDeptId(e.target.value)}
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-input"
                      value={classSemester}
                      onChange={(e) => setClassSemester(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Classroom / Hall</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Hall 304"
                      value={classRoom}
                      onChange={(e) => setClassRoom(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Academic Year</label>
                    <input
                      type="text"
                      className="form-input"
                      value={classYear}
                      onChange={(e) => setClassYear(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowClassModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DEPT MODAL */}
      {showDeptModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">Create Academic Department</h3>
              <button onClick={() => setShowDeptModal(false)} style={{ background: "none", border: "none" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateDept}>
              <div className="modal-body">
                {deptError && <div style={{ color: "var(--color-danger)", marginBottom: "1rem" }}>{deptError}</div>}
                <div className="form-group">
                  <label className="form-label">Department Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mechanical Engineering"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. MECH"
                      value={deptCode}
                      onChange={(e) => setDeptCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Head of Department</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. Jane Smith"
                      value={deptHOD}
                      onChange={(e) => setDeptHOD(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Academic scope and curriculum highlights..."
                    value={deptDesc}
                    onChange={(e) => setDeptDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowDeptModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUBJECT MODAL */}
      {showSubjectModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">Create Course Subject</h3>
              <button onClick={() => setShowSubjectModal(false)} style={{ background: "none", border: "none" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateSubject}>
              <div className="modal-body">
                {subError && <div style={{ color: "var(--color-danger)", marginBottom: "1rem" }}>{subError}</div>}
                <div className="form-group">
                  <label className="form-label">Subject Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Machine Learning"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Subject Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CS401"
                      value={subCode}
                      onChange={(e) => setSubCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credits *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-input"
                      value={subCredits}
                      onChange={(e) => setSubCredits(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    className="form-select"
                    value={subDeptId}
                    onChange={(e) => setSubDeptId(e.target.value)}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
