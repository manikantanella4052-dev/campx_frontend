import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Users, Mail, Phone, BookOpen, Layers } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const FacultyRoster = () => {
  const { currentUser, facultyAssignments, classes, subjects, users, attendance } = useApp();

  const myAssignments = facultyAssignments.filter((a) => a.facultyId === currentUser.id);
  const assignedClassIds = [...new Set(myAssignments.map((a) => a.classId))];
  const myClasses = classes.filter((c) => assignedClassIds.includes(c.id));

  const [selectedClassId, setSelectedClassId] = useState(myClasses[0]?.id || "");

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const classStudents = users.filter((u) => u.role === "student" && u.classId === selectedClassId);

  // Subjects taught in this class by this faculty
  const classSubjectIds = myAssignments
    .filter((a) => a.classId === selectedClassId)
    .map((a) => a.subjectId);
  const classSubjects = subjects.filter((s) => classSubjectIds.includes(s.id));

  if (myClasses.length === 0) {
    return (
      <EmptyState
        title="No Classes Assigned"
        description="You have not been assigned to any class sections."
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem" }}>My Assigned Classes & Student Roster</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Inspect student enrollment details, roll numbers, and contact channels for your cohorts.
        </p>
      </div>

      {/* Class selector */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {myClasses.map((c) => (
            <button
              key={c.id}
              className={`btn ${selectedClassId === c.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedClassId(c.id)}
            >
              <Layers size={16} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Class Overview Card */}
      {selectedClass && (
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            backgroundColor: "#f8fafc",
            border: "1px solid var(--border-light)"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Class Section
              </span>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{selectedClass.name}</div>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Classroom Venue
              </span>
              <div style={{ fontWeight: 600 }}>{selectedClass.room}</div>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Academic Term
              </span>
              <div style={{ fontWeight: 600 }}>AY {selectedClass.academicYear} • Sem {selectedClass.semester}</div>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Courses Taught
              </span>
              <div style={{ fontWeight: 600, color: "#4f46e5" }}>
                {classSubjects.map((s) => s.code).join(", ") || "—"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Enrolled Students ({classStudents.length})
          </h3>
        </div>

        {classStudents.length === 0 ? (
          <EmptyState title="No Students" description="No students found in this class." />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Email Address</th>
                  <th>Phone</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <code style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: 700 }}>
                        {student.rollNo}
                      </code>
                    </td>
                    <td>
                      <strong>{student.name}</strong>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Mail size={13} color="var(--text-muted)" />
                        <span>{student.email}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Phone size={13} color="var(--text-muted)" />
                        <span>{student.phone || "—"}</span>
                      </div>
                    </td>
                    <td>{student.joinDate || "2024-08-15"}</td>
                    <td>
                      <span className={`badge badge-${student.status}`}>
                        {student.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
