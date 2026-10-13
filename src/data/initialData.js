export const initialUsers = [
  {
    id: "usr-admin-1",
    role: "admin",
    name: "Dr. Evelyn Reed",
    email: "admin@campex.edu",
    password: "admin123",
    status: "active",
    designation: "Head of Academic Operations",
    departmentId: "DEP-CS",
    phone: "+1 (555) 100-2001",
    createdAt: "2024-01-10"
  },
  {
    id: "usr-fac-1",
    role: "faculty",
    name: "Prof. Robert Smith",
    email: "faculty.smith@campex.edu",
    password: "faculty123",
    status: "active",
    designation: "Associate Professor",
    departmentId: "DEP-CS",
    phone: "+1 (555) 234-5678",
    createdAt: "2024-02-15"
  },
  {
    id: "usr-fac-2",
    role: "faculty",
    name: "Dr. Ananya Patel",
    email: "faculty.patel@campex.edu",
    password: "faculty123",
    status: "active",
    designation: "Assistant Professor",
    departmentId: "DEP-CS",
    phone: "+1 (555) 345-6789",
    createdAt: "2024-03-01"
  },
  {
    id: "usr-fac-3",
    role: "faculty",
    name: "Prof. David Miller",
    email: "faculty.miller@campex.edu",
    password: "faculty123",
    status: "active",
    designation: "Senior Lecturer",
    departmentId: "DEP-ECE",
    phone: "+1 (555) 456-7890",
    createdAt: "2024-03-10"
  },
  {
    id: "usr-stu-1",
    role: "student",
    name: "Alex Johnson",
    rollNo: "CS2024-001",
    email: "student.alex@campex.edu",
    password: "student123",
    status: "active",
    departmentId: "DEP-CS",
    classId: "CLS-CS3A",
    semester: 5,
    phone: "+1 (555) 890-1234",
    joinDate: "2024-08-15"
  },
  {
    id: "usr-stu-2",
    role: "student",
    name: "Sophia Chen",
    rollNo: "CS2024-002",
    email: "sophia.chen@campex.edu",
    password: "student123",
    status: "active",
    departmentId: "DEP-CS",
    classId: "CLS-CS3A",
    semester: 5,
    phone: "+1 (555) 890-1235",
    joinDate: "2024-08-15"
  },
  {
    id: "usr-stu-3",
    role: "student",
    name: "Marcus Williams",
    rollNo: "CS2024-003",
    email: "marcus.w@campex.edu",
    password: "student123",
    status: "active",
    departmentId: "DEP-CS",
    classId: "CLS-CS3A",
    semester: 5,
    phone: "+1 (555) 890-1236",
    joinDate: "2024-08-15"
  },
  {
    id: "usr-stu-4",
    role: "student",
    name: "Emily Davis",
    rollNo: "CS2024-004",
    email: "emily.davis@campex.edu",
    password: "student123",
    status: "active",
    departmentId: "DEP-CS",
    classId: "CLS-CS3A",
    semester: 5,
    phone: "+1 (555) 890-1237",
    joinDate: "2024-08-15"
  },
  {
    id: "usr-stu-5",
    role: "student",
    name: "Liam Garcia",
    rollNo: "CS2024-005",
    email: "liam.garcia@campex.edu",
    password: "student123",
    status: "active",
    departmentId: "DEP-CS",
    classId: "CLS-CS3A",
    semester: 5,
    phone: "+1 (555) 890-1238",
    joinDate: "2024-08-15"
  },
  {
    id: "usr-stu-6",
    role: "student",
    name: "Olivia Brown",
    rollNo: "IT2024-001",
    email: "olivia.brown@campex.edu",
    password: "student123",
    status: "active",
    departmentId: "DEP-IT",
    classId: "CLS-IT2B",
    semester: 3,
    phone: "+1 (555) 890-1239",
    joinDate: "2024-08-15"
  }
];

export const initialDepartments = [
  {
    id: "DEP-CS",
    name: "Computer Science & Engineering",
    code: "CSE",
    headOfDept: "Dr. Evelyn Reed",
    description: "Focus on algorithmic thinking, software engineering, and artificial intelligence."
  },
  {
    id: "DEP-IT",
    name: "Information Technology",
    code: "IT",
    headOfDept: "Dr. Michael Vance",
    description: "Enterprise networking, database architecture, and cybersecurity."
  },
  {
    id: "DEP-ECE",
    name: "Electronics & Communication",
    code: "ECE",
    headOfDept: "Dr. Sarah Lin",
    description: "Embedded systems, signals processing, VLSI design, and IoT."
  }
];

export const initialClasses = [
  {
    id: "CLS-CS3A",
    name: "Year 3 - Section A (CSE)",
    departmentId: "DEP-CS",
    semester: 5,
    room: "CS Hall 304",
    academicYear: "2026-2027"
  },
  {
    id: "CLS-CS3B",
    name: "Year 3 - Section B (CSE)",
    departmentId: "DEP-CS",
    semester: 5,
    room: "CS Hall 305",
    academicYear: "2026-2027"
  },
  {
    id: "CLS-IT2B",
    name: "Year 2 - Section B (IT)",
    departmentId: "DEP-IT",
    semester: 3,
    room: "IT Lab 202",
    academicYear: "2026-2027"
  },
  {
    id: "CLS-ECE4",
    name: "Year 4 - Section A (ECE)",
    departmentId: "DEP-ECE",
    semester: 7,
    room: "VLSI Center 401",
    academicYear: "2026-2027"
  }
];

export const initialSubjects = [
  {
    id: "SUB-CS301",
    code: "CS301",
    name: "Data Structures & Algorithms",
    departmentId: "DEP-CS",
    credits: 4
  },
  {
    id: "SUB-CS302",
    code: "CS302",
    name: "Database Management Systems",
    departmentId: "DEP-CS",
    credits: 4
  },
  {
    id: "SUB-CS303",
    code: "CS303",
    name: "Web Technologies & Cloud",
    departmentId: "DEP-CS",
    credits: 3
  },
  {
    id: "SUB-CS304",
    code: "CS304",
    name: "Operating Systems",
    departmentId: "DEP-CS",
    credits: 4
  },
  {
    id: "SUB-IT201",
    code: "IT201",
    name: "Object Oriented Programming",
    departmentId: "DEP-IT",
    credits: 4
  },
  {
    id: "SUB-EC401",
    code: "EC401",
    name: "Embedded Systems & IoT",
    departmentId: "DEP-ECE",
    credits: 4
  }
];

export const initialFacultyAssignments = [
  {
    id: "ASN-1",
    facultyId: "usr-fac-1",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS301"
  },
  {
    id: "ASN-2",
    facultyId: "usr-fac-1",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS303"
  },
  {
    id: "ASN-3",
    facultyId: "usr-fac-2",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS302"
  },
  {
    id: "ASN-4",
    facultyId: "usr-fac-2",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS304"
  },
  {
    id: "ASN-5",
    facultyId: "usr-fac-3",
    classId: "CLS-ECE4",
    subjectId: "SUB-EC401"
  }
];

export const initialExams = [
  {
    id: "EXAM-1",
    name: "Midterm Assessment 1",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS301",
    date: "2026-09-15",
    maxScore: 50
  },
  {
    id: "EXAM-2",
    name: "Midterm Assessment 1",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS302",
    date: "2026-09-18",
    maxScore: 50
  },
  {
    id: "EXAM-3",
    name: "Midterm Assessment 1",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS303",
    date: "2026-09-22",
    maxScore: 50
  },
  {
    id: "EXAM-4",
    name: "Midterm Assessment 2",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS301",
    date: "2026-10-02",
    maxScore: 50
  },
  {
    id: "EXAM-5",
    name: "Midterm Assessment 1",
    classId: "CLS-IT2B",
    subjectId: "SUB-IT201",
    date: "2026-09-20",
    maxScore: 50
  }
];

export const initialAttendance = [
  {
    id: "ATT-1",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS301",
    date: "2026-10-01",
    records: {
      "usr-stu-1": "Present",
      "usr-stu-2": "Present",
      "usr-stu-3": "Present",
      "usr-stu-4": "Present",
      "usr-stu-5": "Late"
    }
  },
  {
    id: "ATT-2",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS301",
    date: "2026-10-03",
    records: {
      "usr-stu-1": "Present",
      "usr-stu-2": "Present",
      "usr-stu-3": "Absent",
      "usr-stu-4": "Present",
      "usr-stu-5": "Present"
    }
  },
  {
    id: "ATT-3",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS301",
    date: "2026-10-06",
    records: {
      "usr-stu-1": "Late",
      "usr-stu-2": "Present",
      "usr-stu-3": "Absent",
      "usr-stu-4": "Present",
      "usr-stu-5": "Present"
    }
  },
  {
    id: "ATT-4",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS302",
    date: "2026-10-02",
    records: {
      "usr-stu-1": "Present",
      "usr-stu-2": "Present",
      "usr-stu-3": "Present",
      "usr-stu-4": "Late",
      "usr-stu-5": "Present"
    }
  },
  {
    id: "ATT-5",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS302",
    date: "2026-10-05",
    records: {
      "usr-stu-1": "Present",
      "usr-stu-2": "Present",
      "usr-stu-3": "Absent",
      "usr-stu-4": "Present",
      "usr-stu-5": "Present"
    }
  },
  {
    id: "ATT-6",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS303",
    date: "2026-10-04",
    records: {
      "usr-stu-1": "Present",
      "usr-stu-2": "Present",
      "usr-stu-3": "Present",
      "usr-stu-4": "Present",
      "usr-stu-5": "Present"
    }
  },
  {
    id: "ATT-7",
    classId: "CLS-CS3A",
    subjectId: "SUB-CS303",
    date: "2026-10-08",
    records: {
      "usr-stu-1": "Present",
      "usr-stu-2": "Present",
      "usr-stu-3": "Late",
      "usr-stu-4": "Absent",
      "usr-stu-5": "Present"
    }
  }
];

export const initialMarks = [
  {
    id: "MRK-1",
    examId: "EXAM-1",
    records: {
      "usr-stu-1": 46,
      "usr-stu-2": 49,
      "usr-stu-3": 38,
      "usr-stu-4": 42,
      "usr-stu-5": 40
    }
  },
  {
    id: "MRK-2",
    examId: "EXAM-2",
    records: {
      "usr-stu-1": 44,
      "usr-stu-2": 48,
      "usr-stu-3": 34,
      "usr-stu-4": 41,
      "usr-stu-5": 39
    }
  },
  {
    id: "MRK-3",
    examId: "EXAM-3",
    records: {
      "usr-stu-1": 48,
      "usr-stu-2": 50,
      "usr-stu-3": 42,
      "usr-stu-4": 45,
      "usr-stu-5": 43
    }
  },
  {
    id: "MRK-4",
    examId: "EXAM-4",
    records: {
      "usr-stu-1": 45,
      "usr-stu-2": 47,
      "usr-stu-3": 36,
      "usr-stu-4": 44,
      "usr-stu-5": 41
    }
  }
];
