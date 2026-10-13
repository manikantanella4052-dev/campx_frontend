import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyAssignments, setFacultyAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("campex_current_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all initial data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes, deptsRes, classesRes, subjectsRes, 
          facultyRes, examsRes, attRes, marksRes
        ] = await Promise.all([
          fetch(`${API_BASE}/users`).then(r => r.json()),
          fetch(`${API_BASE}/departments`).then(r => r.json()),
          fetch(`${API_BASE}/classes`).then(r => r.json()),
          fetch(`${API_BASE}/subjects`).then(r => r.json()),
          fetch(`${API_BASE}/faculty-assignments`).then(r => r.json()),
          fetch(`${API_BASE}/exams`).then(r => r.json()),
          fetch(`${API_BASE}/attendance`).then(r => r.json()),
          fetch(`${API_BASE}/marks`).then(r => r.json())
        ]);

        setUsers(usersRes || []);
        setDepartments(deptsRes || []);
        setClasses(classesRes || []);
        setSubjects(subjectsRes || []);
        setFacultyAssignments(facultyRes || []);
        setExams(examsRes || []);
        setAttendance(attRes || []);
        setMarks(marksRes || []);
      } catch (err) {
        console.error("Failed to fetch data from backend", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync current user to localStorage (for persistent login only)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("campex_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("campex_current_user");
    }
  }, [currentUser]);

  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Auth methods
  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, message: "No account found with this email." };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please try again." };
    }

    if (user.status === "inactive") {
      return {
        success: false,
        message: "Your account is currently deactivated. Please contact campus admin."
      };
    }

    // Call backend login just to verify but we don't await since UI expects sync response
    fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, password })
    }).catch(console.error);

    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, "success");
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast("Logged out successfully.", "info");
  };

  // Student public registration (Only student role permitted)
  const registerStudent = ({ name, rollNo, email, password, departmentId, classId, phone }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedRoll = rollNo.trim().toUpperCase();

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: "Email is already registered." };
    }

    if (users.some((u) => u.rollNo && u.rollNo.toUpperCase() === trimmedRoll)) {
      return { success: false, message: "Roll number is already registered." };
    }

    const newStudent = {
      id: `usr-stu-${Date.now()}`,
      role: "student",
      name: name.trim(),
      rollNo: trimmedRoll,
      email: trimmedEmail,
      password,
      status: "active",
      departmentId: departmentId || "",
      classId: classId || "",
      semester: 1,
      phone: phone || "",
      joinDate: new Date().toISOString().split("T")[0]
    };

    setUsers((prev) => [...prev, newStudent]);
    
    // Background sync
    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    }).catch(console.error);

    setCurrentUser(newStudent);
    showToast("Student account registered and logged in successfully!", "success");
    return { success: true, user: newStudent };
  };

  // Admin user management
  const addUser = (userData) => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: "A user with this email already exists." };
    }

    if (userData.role === "student" && userData.rollNo) {
      const trimmedRoll = userData.rollNo.trim().toUpperCase();
      if (users.some((u) => u.rollNo && u.rollNo.toUpperCase() === trimmedRoll)) {
        return { success: false, message: "Roll number is already in use." };
      }
    }

    const newUser = {
      ...userData,
      id: `usr-${userData.role.slice(0, 3)}-${Date.now()}`,
      email: trimmedEmail,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setUsers((prev) => [...prev, newUser]);

    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(console.error);

    showToast(`${userData.role.toUpperCase()} user "${newUser.name}" created!`, "success");
    return { success: true, user: newUser };
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updatedStatus = u.status === "active" ? "inactive" : "active";
          if (currentUser && currentUser.id === userId && updatedStatus === "inactive") {
            setTimeout(() => { logout(); }, 300);
          }
          
          fetch(`${API_BASE}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: updatedStatus })
          }).catch(console.error);

          return { ...u, status: updatedStatus };
        }
        return u;
      })
    );
    showToast("User status updated successfully.", "success");
  };

  const deleteUser = (userId) => {
    if (currentUser && currentUser.id === userId) {
      return { success: false, message: "You cannot delete your own active account." };
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setFacultyAssignments((prev) => prev.filter((a) => a.facultyId !== userId));
    showToast("User removed from the system.", "info");
    return { success: true };
  };

  // Department Management
  const addDepartment = ({ name, code, headOfDept, description }) => {
    const trimmedCode = code.trim().toUpperCase();
    if (departments.some((d) => d.code.toUpperCase() === trimmedCode)) {
      return { success: false, message: "Department code already exists." };
    }
    const newDept = {
      id: `DEP-${trimmedCode}`,
      name: name.trim(),
      code: trimmedCode,
      headOfDept: headOfDept || "",
      description: description || ""
    };
    setDepartments((prev) => [...prev, newDept]);

    fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDept)
    }).catch(console.error);

    showToast(`Department "${newDept.name}" added.`, "success");
    return { success: true };
  };

  const deleteDepartment = (deptId) => {
    const hasClasses = classes.some((c) => c.departmentId === deptId);
    if (hasClasses) {
      return { success: false, message: "Cannot delete department: classes are assigned to it." };
    }
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    showToast("Department deleted.", "info");
    return { success: true };
  };

  // Class Management
  const addClass = ({ name, departmentId, semester, room, academicYear }) => {
    const newClass = {
      id: `CLS-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      departmentId,
      semester: parseInt(semester, 10) || 1,
      room: room || "Main Campus",
      academicYear: academicYear || "2026-2027"
    };
    setClasses((prev) => [...prev, newClass]);

    fetch(`${API_BASE}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClass)
    }).catch(console.error);

    showToast(`Class "${newClass.name}" added.`, "success");
    return { success: true };
  };

  const deleteClass = (classId) => {
    const hasStudents = users.some((u) => u.classId === classId);
    if (hasStudents) {
      return { success: false, message: "Cannot delete class: students are enrolled in it." };
    }
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    setFacultyAssignments((prev) => prev.filter((a) => a.classId !== classId));
    setExams((prev) => prev.filter((e) => e.classId !== classId));
    showToast("Class deleted.", "info");
    return { success: true };
  };

  // Subject Management
  const addSubject = ({ name, code, departmentId, credits }) => {
    const trimmedCode = code.trim().toUpperCase();
    if (subjects.some((s) => s.code.toUpperCase() === trimmedCode)) {
      return { success: false, message: "Subject code already exists." };
    }
    const newSubject = {
      id: `SUB-${trimmedCode}`,
      name: name.trim(),
      code: trimmedCode,
      departmentId,
      credits: parseInt(credits, 10) || 3
    };
    setSubjects((prev) => [...prev, newSubject]);

    fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubject)
    }).catch(console.error);

    showToast(`Subject "${newSubject.name}" created.`, "success");
    return { success: true };
  };

  const deleteSubject = (subjectId) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    setFacultyAssignments((prev) => prev.filter((a) => a.subjectId !== subjectId));
    setExams((prev) => prev.filter((e) => e.subjectId !== subjectId));
    showToast("Subject deleted.", "info");
    return { success: true };
  };

  // Faculty Assignment Management
  const assignFaculty = ({ facultyId, classId, subjectId }) => {
    const exists = facultyAssignments.some(
      (a) => a.facultyId === facultyId && a.classId === classId && a.subjectId === subjectId
    );
    if (exists) {
      return { success: false, message: "This faculty member is already assigned to this class & subject." };
    }
    const newAssignment = {
      id: `ASN-${Date.now()}`,
      facultyId,
      classId,
      subjectId
    };
    setFacultyAssignments((prev) => [...prev, newAssignment]);

    fetch(`${API_BASE}/faculty-assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAssignment)
    }).catch(console.error);

    showToast("Faculty assigned to class and subject.", "success");
    return { success: true };
  };

  const removeFacultyAssignment = (assignmentId) => {
    setFacultyAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    showToast("Faculty assignment removed.", "info");
    return { success: true };
  };

  // Exam Management
  const createExam = ({ name, classId, subjectId, date, maxScore }) => {
    if (!name || !classId || !subjectId || !date || !maxScore) {
      return { success: false, message: "All exam fields are required." };
    }
    const parsedMax = Number(maxScore);
    if (isNaN(parsedMax) || parsedMax <= 0) {
      return { success: false, message: "Maximum score must be a positive number greater than 0." };
    }

    const newExam = {
      id: `EXAM-${Date.now()}`,
      name: name.trim(),
      classId,
      subjectId,
      date,
      maxScore: parsedMax
    };

    setExams((prev) => [...prev, newExam]);

    fetch(`${API_BASE}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExam)
    }).catch(console.error);

    showToast(`Exam "${newExam.name}" scheduled successfully!`, "success");
    return { success: true, exam: newExam };
  };

  const deleteExam = (examId) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
    setMarks((prev) => prev.filter((m) => m.examId !== examId));
    showToast("Exam and associated marks records deleted.", "info");
    return { success: true };
  };

  // Attendance Management
  const saveAttendance = ({ classId, subjectId, date, records }) => {
    if (!classId || !subjectId || !date || !records || Object.keys(records).length === 0) {
      return { success: false, message: "Invalid attendance parameters." };
    }

    let newRecordToSave = null;

    setAttendance((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.classId === classId && a.subjectId === subjectId && a.date === date
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          records: { ...updated[existingIndex].records, ...records }
        };
        newRecordToSave = updated[existingIndex];
        return updated;
      } else {
        const newRecord = {
          id: `ATT-${Date.now()}`,
          classId,
          subjectId,
          date,
          records
        };
        newRecordToSave = newRecord;
        return [...prev, newRecord];
      }
    });

    // Wait for the next tick to ensure we have the generated record
    setTimeout(() => {
      if (newRecordToSave) {
        fetch(`${API_BASE}/attendance`, {
          method: 'POST', // Simplified to always POST for this prototype, backend can handle it or we ignore duplicates
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecordToSave)
        }).catch(console.error);
      }
    }, 0);

    showToast(`Attendance saved successfully for ${date}!`, "success");
    return { success: true };
  };

  // Marks Management
  const saveMarks = ({ examId, records }) => {
    const exam = exams.find((e) => e.id === examId);
    if (!exam) {
      return { success: false, message: "Exam not found." };
    }

    for (const [studentId, scoreVal] of Object.entries(records)) {
      if (scoreVal === "" || scoreVal === null || scoreVal === undefined) {
        continue;
      }
      const score = Number(scoreVal);
      if (isNaN(score)) {
        return { success: false, message: `Marks must be valid numbers.` };
      }
      if (score < 0 || score > exam.maxScore) {
        return {
          success: false,
          message: `Marks must be between 0 and maximum score (${exam.maxScore}).`
        };
      }
    }

    let newRecordToSave = null;

    setMarks((prev) => {
      const existingIndex = prev.findIndex((m) => m.examId === examId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          records: { ...updated[existingIndex].records, ...records }
        };
        newRecordToSave = updated[existingIndex];
        return updated;
      } else {
        const newRecord = {
          id: `MRK-${Date.now()}`,
          examId,
          records
        };
        newRecordToSave = newRecord;
        return [...prev, newRecord];
      }
    });

    setTimeout(() => {
      if (newRecordToSave) {
        fetch(`${API_BASE}/marks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecordToSave)
        }).catch(console.error);
      }
    }, 0);

    showToast("Marks recorded successfully!", "success");
    return { success: true };
  };

  const resetDemoData = () => {
    showToast("Demo data reset is handled via restarting the backend server.", "info");
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#1e3a8a', fontFamily: 'sans-serif' }}><h2>Connecting to Backend...</h2></div>;
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        departments,
        classes,
        subjects,
        facultyAssignments,
        exams,
        attendance,
        marks,
        toast,
        showToast,
        closeToast,
        login,
        logout,
        registerStudent,
        addUser,
        toggleUserStatus,
        deleteUser,
        addDepartment,
        deleteDepartment,
        addClass,
        deleteClass,
        addSubject,
        deleteSubject,
        assignFaculty,
        removeFacultyAssignment,
        createExam,
        deleteExam,
        saveAttendance,
        saveMarks,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
