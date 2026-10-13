import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { UserPlus, Search, Shield, Award, GraduationCap, Power, Trash2, X, AlertTriangle } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const AdminUsers = () => {
  const { users, departments, classes, addUser, toggleUserStatus, deleteUser, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formRole, setFormRole] = useState("student");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("password123");
  const [formRollNo, setFormRollNo] = useState("");
  const [formDeptId, setFormDeptId] = useState(departments[0]?.id || "");
  const [formClassId, setFormClassId] = useState(classes[0]?.id || "");
  const [formDesignation, setFormDesignation] = useState("Assistant Professor");
  const [formPhone, setFormPhone] = useState("");
  const [modalError, setModalError] = useState("");

  const handleOpenAddModal = (defaultRole = "student") => {
    setFormRole(defaultRole);
    setFormName("");
    setFormEmail("");
    setFormPassword("password123");
    setFormRollNo("");
    setFormDeptId(departments[0]?.id || "");
    setFormClassId(classes[0]?.id || "");
    setFormDesignation(defaultRole === "faculty" ? "Assistant Professor" : "Staff Administrator");
    setFormPhone("");
    setModalError("");
    setShowAddModal(true);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    setModalError("");

    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setModalError("Please fill out all required fields.");
      return;
    }

    if (formRole === "student" && !formRollNo.trim()) {
      setModalError("Student Roll Number is required.");
      return;
    }

    const payload = {
      name: formName,
      email: formEmail,
      password: formPassword,
      role: formRole,
      departmentId: formDeptId,
      phone: formPhone
    };

    if (formRole === "student") {
      payload.rollNo = formRollNo;
      payload.classId = formClassId;
      payload.semester = 1;
    } else if (formRole === "faculty") {
      payload.designation = formDesignation;
    } else if (formRole === "admin") {
      payload.designation = formDesignation || "System Administrator";
    }

    const result = addUser(payload);
    if (result.success) {
      setShowAddModal(false);
    } else {
      setModalError(result.message);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.rollNo && u.rollNo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.code : "—";
  };

  const getClassName = (id) => {
    const cls = classes.find((c) => c.id === id);
    return cls ? cls.name : "—";
  };

  return (
    <div>
      {/* Top action header */}
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
          <h2 style={{ fontSize: "1.4rem" }}>User Accounts Management</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Create, view, activate, or deactivate students, faculty, and administrative staff.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => handleOpenAddModal("student")} className="btn btn-primary">
            <UserPlus size={16} />
            <span>Add Student</span>
          </button>
          <button onClick={() => handleOpenAddModal("faculty")} className="btn btn-secondary">
            <Award size={16} />
            <span>Add Faculty</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: "1 1 300px" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="Search by name, email, or roll number..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "2.3rem" }}
            />
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>Role:</span>
            <select
              className="form-select"
              style={{ padding: "0.45rem 0.75rem", width: "auto" }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>Status:</span>
            <select
              className="form-select"
              style={{ padding: "0.45rem 0.75rem", width: "auto" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users match your filter"
          description="Try adjusting your search criteria or add a new user to the campus database."
          actionText="Add New User"
          onAction={() => handleOpenAddModal("student")}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Dept / Class</th>
                <th>Status</th>
                <th>Password</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isCurrentUser = currentUser?.id === u.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <div>
                        <strong>{u.name}</strong>
                        {u.rollNo && (
                          <span style={{ fontSize: "0.75rem", color: "#4f46e5", marginLeft: 6, fontWeight: 600 }}>
                            ({u.rollNo})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>{u.email}</div>
                    </td>
                    <td>
                      <span className={`badge badge-role-${u.role}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {u.role === "student" ? (
                        <div style={{ fontSize: "0.825rem" }}>
                          <div>{getClassName(u.classId)}</div>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                            {getDepartmentName(u.departmentId)}
                          </span>
                        </div>
                      ) : (
                        <div style={{ fontSize: "0.825rem" }}>
                          <div>{u.designation || "Staff"}</div>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                            {getDepartmentName(u.departmentId)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${u.status}`}>
                        {u.status === "active" ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: "0.78rem", background: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: 4 }}>
                        {u.password}
                      </code>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`btn btn-sm ${u.status === "active" ? "btn-secondary" : "btn-success"}`}
                          title={u.status === "active" ? "Deactivate Account" : "Activate Account"}
                        >
                          <Power size={13} />
                          <span>{u.status === "active" ? "Deactivate" : "Activate"}</span>
                        </button>

                        {!isCurrentUser && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete user ${u.name}?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="btn btn-sm"
                            style={{ background: "#fee2e2", color: "#b91c1c" }}
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">Create New User Account</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                {modalError && (
                  <div
                    style={{
                      background: "var(--color-danger-bg)",
                      border: "1px solid var(--color-danger-border)",
                      color: "var(--color-danger-text)",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.85rem",
                      marginBottom: "1rem"
                    }}
                  >
                    {modalError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Account Role *</label>
                  <select
                    className="form-select"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. John Doe"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. j.doe@campex.edu"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div className="form-group">
                    <label className="form-label">Initial Password *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Password"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+1 (555) 000-0000"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                </div>

                {formRole === "student" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <div className="form-group">
                      <label className="form-label">Roll Number *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. CS2026-101"
                        value={formRollNo}
                        onChange={(e) => setFormRollNo(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Assign Class *</label>
                      <select
                        className="form-select"
                        value={formClassId}
                        onChange={(e) => setFormClassId(e.target.value)}
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {formRole !== "student" && (
                  <div className="form-group">
                    <label className="form-label">Designation / Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Associate Professor, Dean"
                      value={formDesignation}
                      onChange={(e) => setFormDesignation(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    className="form-select"
                    value={formDeptId}
                    onChange={(e) => setFormDeptId(e.target.value)}
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
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
