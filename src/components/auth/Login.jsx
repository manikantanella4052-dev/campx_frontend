import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GraduationCap, Lock, Mail, User, ShieldAlert, ArrowRight, BookOpen, Hash, Phone } from "lucide-react";

export const Login = () => {
  const { login, registerStudent, departments, classes } = useApp();

  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  const [errorMessage, setErrorMessage] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Student registration form state
  const [regName, setRegName] = useState("");
  const [regRollNo, setRegRollNo] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDeptId, setRegDeptId] = useState(departments[0]?.id || "");
  const [regClassId, setRegClassId] = useState(classes[0]?.id || "");
  const [regPhone, setRegPhone] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!loginEmail || !loginPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = (email, pass) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMessage("");
    login(email, pass);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!regName.trim() || !regRollNo.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage("Please fill in all required registration fields.");
      return;
    }

    const res = registerStudent({
      name: regName,
      rollNo: regRollNo,
      email: regEmail,
      password: regPassword,
      departmentId: regDeptId,
      classId: regClassId,
      phone: regPhone
    });

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const filteredClasses = classes.filter(
    (c) => !regDeptId || c.departmentId === regDeptId
  );

  return (
    <div className="auth-page">
      <div className="auth-card-wrapper">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <GraduationCap size={32} />
          </div>
          <h1>CAMPEX</h1>
          <p>Campus Attendance & Marks Management Portal</p>
        </div>

        {/* Security / Demonstration Notice */}
        <div className="disclaimer-banner">
          <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Demonstration Sandbox Notice:</strong> This application utilizes browser{" "}
            <code>localStorage</code> for simulated authentication and persistence. This setup is
            purely for functional prototype demonstration and is not suitable for production security.
          </div>
        </div>

        <div className="auth-card">
          {/* Navigation Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${activeTab === "register" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
              }}
            >
              Student Registration
            </button>
          </div>

          {errorMessage && (
            <div
              style={{
                backgroundColor: "var(--color-danger-bg)",
                border: "1px solid var(--color-danger-border)",
                color: "var(--color-danger-text)",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.85rem",
                marginBottom: "1.25rem"
              }}
            >
              {errorMessage}
            </div>
          )}

          {activeTab === "login" ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Campus Email Address</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. admin@campex.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{ paddingLeft: "2.4rem" }}
                  />
                  <Mail
                    size={16}
                    style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ paddingLeft: "2.4rem" }}
                  />
                  <Lock
                    size={16}
                    style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.75rem", padding: "0.8rem" }}>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </button>


            </form>
          ) : (
            /* Student Registration Form (Public registration restricted strictly to students) */
            <form onSubmit={handleRegisterSubmit}>
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "var(--radius-md)",
                  padding: "0.65rem 0.85rem",
                  fontSize: "0.8rem",
                  color: "#1e40af",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <BookOpen size={16} />
                <span>
                  <strong>Student Portal Enrollment:</strong> Admin and Faculty accounts must be provisioned
                  by system administrators.
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Jordan Miller"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CS2026-099"
                    value={regRollNo}
                    onChange={(e) => setRegRollNo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. jordan.m@campex.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Create a password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    className="form-select"
                    value={regDeptId}
                    onChange={(e) => setRegDeptId(e.target.value)}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Class / Section *</label>
                  <select
                    className="form-select"
                    value={regClassId}
                    onChange={(e) => setRegClassId(e.target.value)}
                  >
                    {filteredClasses.length > 0 ? (
                      filteredClasses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No classes in department</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. +1 (555) 000-0000"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem", padding: "0.8rem" }}>
                <span>Create Student Account & Sign In</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
