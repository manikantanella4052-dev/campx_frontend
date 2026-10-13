import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Toast } from "./components/common/Toast";
import { Sidebar } from "./components/common/Sidebar";
import { Header } from "./components/common/Header";
import { Login } from "./components/auth/Login";

// Admin components
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminUsers } from "./components/admin/AdminUsers";
import { AdminAcademic } from "./components/admin/AdminAcademic";
import { AdminAssignments } from "./components/admin/AdminAssignments";
import { AdminExams } from "./components/admin/AdminExams";
import { AdminReports } from "./components/admin/AdminReports";

// Faculty components
import { FacultyDashboard } from "./components/faculty/FacultyDashboard";
import { FacultyAttendance } from "./components/faculty/FacultyAttendance";
import { FacultyMarks } from "./components/faculty/FacultyMarks";
import { FacultyRoster } from "./components/faculty/FacultyRoster";

// Student components
import { StudentDashboard } from "./components/student/StudentDashboard";
import { StudentAttendance } from "./components/student/StudentAttendance";
import { StudentMarks } from "./components/student/StudentMarks";
import { StudentProfile } from "./components/student/StudentProfile";

const MainAppContent = () => {
  const { currentUser, toast, closeToast } = useApp();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // When currentUser changes (e.g. login or role switch), default back to dashboard
  useEffect(() => {
    setActiveTab("dashboard");
  }, [currentUser?.role, currentUser?.id]);

  if (!currentUser) {
    return (
      <>
        <Login />
        <Toast toast={toast} onClose={closeToast} />
      </>
    );
  }

  // Get Page Meta
  const getPageMeta = () => {
    const role = currentUser.role;

    if (role === "admin") {
      switch (activeTab) {
        case "dashboard":
          return {
            title: "Campus Executive Dashboard",
            subtitle: "Overall metrics, department allocations, and operational shortcuts"
          };
        case "users":
          return {
            title: "Student & Faculty User Management",
            subtitle: "Provision accounts, search directory, and activate/deactivate access"
          };
        case "academic":
          return {
            title: "Academic Structure Management",
            subtitle: "Departments, class cohorts, and curricular subjects"
          };
        case "assignments":
          return {
            title: "Faculty Course Allocations",
            subtitle: "Assign professors to classes and curriculum subjects"
          };
        case "exams":
          return {
            title: "Examination Management",
            subtitle: "Schedule assessments, tests, and max scoring parameters"
          };
        case "reports":
          return {
            title: "Institutional Reports & Analytics",
            subtitle: "Attendance compliance statistics and exam score distributions"
          };
        default:
          return { title: "Administrator Portal", subtitle: "CAMPEX Operations" };
      }
    } else if (role === "faculty") {
      switch (activeTab) {
        case "dashboard":
          return {
            title: "Faculty Academic Dashboard",
            subtitle: "Course allocations and teaching schedule summary"
          };
        case "attendance":
          return {
            title: "Lecture Attendance Tracker",
            subtitle: "Mark daily student presence, absences, and late arrivals"
          };
        case "marks":
          return {
            title: "Assessment Marks Entry",
            subtitle: "Score examinations with range validations and immediate feedback"
          };
        case "roster":
          return {
            title: "My Classes & Student Cohorts",
            subtitle: "Enrolled student rosters and contact directories"
          };
        default:
          return { title: "Faculty Portal", subtitle: "CAMPEX Operations" };
      }
    } else {
      // Student
      switch (activeTab) {
        case "dashboard":
          return {
            title: "Student Academic Dashboard",
            subtitle: "Your attendance progress and examination scorecards"
          };
        case "attendance":
          return {
            title: "Attendance Records & History",
            subtitle: "Subject-wise attendance percentages and daily lecture logs"
          };
        case "marks":
          return {
            title: "Examination Results & Grades",
            subtitle: "Assessment scores, maximum marks, and evaluation breakdown"
          };
        case "profile":
          return {
            title: "Student Profile & Details",
            subtitle: "Matriculation credentials, department, and course instructors"
          };
        default:
          return { title: "Student Portal", subtitle: "CAMPEX Operations" };
      }
    }
  };

  const pageMeta = getPageMeta();

  // Render current role view
  const renderRoleContent = () => {
    const role = currentUser.role;

    if (role === "admin") {
      switch (activeTab) {
        case "dashboard":
          return <AdminDashboard setActiveTab={setActiveTab} />;
        case "users":
          return <AdminUsers />;
        case "academic":
          return <AdminAcademic />;
        case "assignments":
          return <AdminAssignments />;
        case "exams":
          return <AdminExams />;
        case "reports":
          return <AdminReports />;
        default:
          return <AdminDashboard setActiveTab={setActiveTab} />;
      }
    } else if (role === "faculty") {
      switch (activeTab) {
        case "dashboard":
          return <FacultyDashboard setActiveTab={setActiveTab} />;
        case "attendance":
          return <FacultyAttendance />;
        case "marks":
          return <FacultyMarks />;
        case "roster":
          return <FacultyRoster />;
        default:
          return <FacultyDashboard setActiveTab={setActiveTab} />;
      }
    } else {
      switch (activeTab) {
        case "dashboard":
          return <StudentDashboard setActiveTab={setActiveTab} />;
        case "attendance":
          return <StudentAttendance />;
        case "marks":
          return <StudentMarks />;
        case "profile":
          return <StudentProfile />;
        default:
          return <StudentDashboard setActiveTab={setActiveTab} />;
      }
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          title={pageMeta.title}
          subtitle={pageMeta.subtitle}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="page-content">
          {renderRoleContent()}
        </main>
      </div>

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
