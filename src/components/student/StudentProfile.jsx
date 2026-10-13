import React from "react";
import { useApp } from "../../context/AppContext";
import { User, Mail, Phone, Calendar, Building2, Layers, BookOpen, Award, CheckCircle } from "lucide-react";

export const StudentProfile = () => {
  const { currentUser, classes, departments, subjects, facultyAssignments, users } = useApp();

  const myClass = classes.find((c) => c.id === currentUser.classId);
  const myDept = departments.find((d) => d.id === currentUser.departmentId);

  // Instructors teaching in this class
  const classAssignments = facultyAssignments.filter((a) => a.classId === currentUser.classId);
  const classInstructors = classAssignments.map((asn) => {
    const faculty = users.find((u) => u.id === asn.facultyId);
    const sub = subjects.find((s) => s.id === asn.subjectId);
    return {
      faculty,
      subject: sub
    };
  });

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem" }}>Student Profile & Academic Record</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Official registration credentials, program enrollment, and academic advisor details.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Profile Identity Card */}
        <div className="card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              fontSize: "2rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)"
            }}
          >
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>

          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.25rem" }}>{currentUser.name}</h3>
          <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "0.75rem" }}>
            Undergraduate Student
          </div>

          <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <span className="badge badge-active">Active Matriculation</span>
            <span className="badge badge-role-student">Student</span>
          </div>

          <div
            style={{
              textAlign: "left",
              borderTop: "1px solid var(--border-light)",
              paddingTop: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              fontSize: "0.88rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Mail size={15} color="var(--text-muted)" />
              <span style={{ color: "var(--text-muted)" }}>{currentUser.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Phone size={15} color="var(--text-muted)" />
              <span style={{ color: "var(--text-muted)" }}>{currentUser.phone || "Not Provided"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Calendar size={15} color="var(--text-muted)" />
              <span style={{ color: "var(--text-muted)" }}>
                Enrolled: {currentUser.joinDate || "Not Provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Enrollment Details Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Building2 size={18} color="var(--color-primary)" />
                Institutional Enrollment Data
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  University Roll Number
                </span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#4f46e5" }}>
                  {currentUser.rollNo}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Assigned Section / Cohort
                </span>
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  {myClass ? myClass.name : "Not Assigned"}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Academic Department
                </span>
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  {myDept ? myDept.name : "Not Assigned"} {myDept ? "(" + myDept.code + ")" : ""}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Current Semester
                </span>
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  Semester {currentUser.semester || "N/A"} {myClass?.academicYear ? `(Academic Year ${myClass.academicYear})` : ""}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Primary Classroom
                </span>
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  {myClass?.room || "Not Assigned"}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Head of Department
                </span>
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  {myDept?.headOfDept || "Not Assigned"}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Course Instructors */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <BookOpen size={18} color="var(--color-secondary)" />
                Current Semester Course Faculty
              </h3>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Course Subject</th>
                    <th>Code</th>
                    <th>Assigned Faculty Instructor</th>
                    <th>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {classInstructors.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)", padding: "1.5rem" }}>
                        No course instructors assigned to your class yet.
                      </td>
                    </tr>
                  ) : (
                    classInstructors.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{item.subject ? item.subject.name : "Subject"}</strong>
                        </td>
                        <td>
                          <span className="badge badge-inactive">
                            {item.subject ? item.subject.code : "—"}
                          </span>
                        </td>
                        <td>
                          <strong>{item.faculty ? item.faculty.name : "TBA"}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {item.faculty ? item.faculty.designation : "Faculty"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
