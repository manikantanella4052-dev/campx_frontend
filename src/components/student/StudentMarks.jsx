import React from "react";
import { useApp } from "../../context/AppContext";
import { FileText, Award, CheckCircle, BarChart3, Calendar } from "lucide-react";
import { EmptyState } from "../common/EmptyState";

export const StudentMarks = () => {
  const { currentUser, exams, subjects, marks } = useApp();

  // Find all exams for this student's class
  const classExams = exams.filter((e) => e.classId === currentUser.classId);

  const examResults = classExams.map((exam) => {
    const markEntry = marks.find((m) => m.examId === exam.id);
    const scoreVal = markEntry?.records[currentUser.id];
    const hasScore = scoreVal !== undefined && scoreVal !== null && scoreVal !== "";
    const score = hasScore ? Number(scoreVal) : null;
    const maxScore = exam.maxScore;
    const sub = subjects.find((s) => s.id === exam.subjectId);

    const percentage = score !== null ? Math.round((score / maxScore) * 100) : null;

    let grade = "—";
    let isPass = false;
    if (percentage !== null) {
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B";
      else if (percentage >= 60) grade = "C";
      else if (percentage >= 50) grade = "D";
      else grade = "F";

      isPass = percentage >= 40;
    }

    return {
      exam,
      subject: sub,
      score,
      maxScore,
      percentage,
      grade,
      isPass
    };
  });

  const gradedExams = examResults.filter((r) => r.score !== null);
  const totalScoreObtained = gradedExams.reduce((acc, r) => acc + r.score, 0);
  const totalMaxPossible = gradedExams.reduce((acc, r) => acc + r.maxScore, 0);
  const overallPercentage =
    totalMaxPossible > 0 ? Math.round((totalScoreObtained / totalMaxPossible) * 100) : 0;
  const passedCount = gradedExams.filter((r) => r.isPass).length;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem" }}>My Examination Marks & Academic Results</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Official scores, maximum points, percentage evaluations, and assigned letter grades.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--stat-accent": "#4f46e5" }}>
          <div className="stat-content">
            <span className="stat-label">Cumulative Performance</span>
            <span className="stat-value">{overallPercentage}%</span>
            <span className="stat-subtext">Overall grade percentage</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#eef2ff", "--stat-icon-color": "#4f46e5" }}
          >
            <BarChart3 size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#10b981" }}>
          <div className="stat-content">
            <span className="stat-label">Total Points Scored</span>
            <span className="stat-value">
              {totalScoreObtained} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ {totalMaxPossible}</span>
            </span>
            <span className="stat-subtext">Cumulative marks earned</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#ecfdf5", "--stat-icon-color": "#10b981" }}
          >
            <Award size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ "--stat-accent": "#0ea5e9" }}>
          <div className="stat-content">
            <span className="stat-label">Assessments Graded</span>
            <span className="stat-value">{gradedExams.length}</span>
            <span className="stat-subtext">{passedCount} exam(s) passed successfully</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ "--stat-icon-bg": "#f0f9ff", "--stat-icon-color": "#0ea5e9" }}
          >
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Exam Results Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <FileText size={18} color="var(--color-primary)" />
            Exam-Wise Marks & Scorecards
          </h3>
        </div>

        {examResults.length === 0 ? (
          <EmptyState
            title="No Examinations Found"
            description="No exams have been scheduled for your class cohort yet."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Course Subject</th>
                  <th>Exam Date</th>
                  <th>Marks Scored</th>
                  <th>Maximum Score</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Result Status</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map((result) => (
                  <tr key={result.exam.id}>
                    <td>
                      <strong>{result.exam.name}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{result.subject ? result.subject.name : "Subject"}</strong>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: 6 }}>
                          ({result.subject ? result.subject.code : "—"})
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <Calendar size={13} color="var(--text-muted)" />
                        <span>{result.exam.date}</span>
                      </div>
                    </td>
                    <td>
                      {result.score !== null ? (
                        <strong style={{ fontSize: "1.05rem", color: "#4f46e5" }}>
                          {result.score}
                        </strong>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                          Under Evaluation
                        </span>
                      )}
                    </td>
                    <td>
                      <strong>{result.maxScore}</strong>
                    </td>
                    <td>
                      {result.percentage !== null ? (
                        <strong style={{ color: result.percentage >= 50 ? "#047857" : "#b91c1c" }}>
                          {result.percentage}%
                        </strong>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {result.grade !== "—" ? (
                        <span
                          className={`badge ${
                            result.grade === "A+" || result.grade === "A"
                              ? "badge-present"
                              : result.grade === "F"
                              ? "badge-absent"
                              : "badge-late"
                          }`}
                        >
                          {result.grade}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {result.score !== null ? (
                        result.isPass ? (
                          <span className="badge badge-present">Pass</span>
                        ) : (
                          <span className="badge badge-absent">Fail</span>
                        )
                      ) : (
                        <span className="badge badge-inactive">Pending</span>
                      )}
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
