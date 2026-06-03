export interface School {
  id: string;
  name: string;
  location: string;
  level: string;
  students: number;
  principal: string;
  status: "Active" | "Inactive";
}

export interface SchoolAssignment {
  id: string;
  schoolId: string;
  curriculumId: string;
  curriculumName: string;
  curriculumCode: string;
  assignedDate: string;
  effectiveDate: string;
  notes?: string;
  status: "Active" | "Inactive";
}

export interface Student {
  id: string;
  schoolId: string;
  classId?: string;
  name: string;
  admissionNumber?: string;
  status: "Active" | "Inactive";
}

export type SupplementaryCurriculumType = "complementary" | "substitute";
export type SupplementaryCurriculumScope = "school" | "class" | "student";

export interface SupplementaryCurriculumCourse {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface SupplementaryCurriculum {
  id: string;
  schoolId: string;
  baseCurriculumId: string;
  type: SupplementaryCurriculumType;
  scope: SupplementaryCurriculumScope;
  termId: string;
  classId?: string;
  studentId?: string;
  replacesCourseId?: string;
  name: string;
  code: string;
  description?: string;
  courses: SupplementaryCurriculumCourse[];
  effectiveDate: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

const SCHOOLS_STORAGE_KEY = "digifunzii.schools";
const ASSIGNMENTS_STORAGE_KEY = "digifunzii.schoolAssignments";
const STUDENTS_STORAGE_KEY = "digifunzii.students";
const SUPPLEMENTARY_COURSES_STORAGE_KEY = "digifunzii.supplementaryCourses";
const SUPPLEMENTARY_CURRICULUMS_STORAGE_KEY = "digifunzii.supplementaryCurriculums";

export const defaultSchools: School[] = [
  {
    id: "s1",
    name: "Greenwood Academy",
    location: "Nairobi",
    level: "Junior Secondary",
    students: 640,
    principal: "Mary Wanjiku",
    status: "Active",
  },
  {
    id: "s2",
    name: "Riverside International School",
    location: "Mombasa",
    level: "Primary and Secondary",
    students: 920,
    principal: "Daniel Otieno",
    status: "Active",
  },
  {
    id: "s3",
    name: "Summit High School",
    location: "Kisumu",
    level: "Secondary",
    students: 780,
    principal: "Amina Hassan",
    status: "Active",
  },
  {
    id: "s4",
    name: "Valley View School",
    location: "Nakuru",
    level: "Primary",
    students: 430,
    principal: "Joseph Mwangi",
    status: "Active",
  },
  {
    id: "s5",
    name: "Lakewood Preparatory",
    location: "Eldoret",
    level: "Primary",
    students: 510,
    principal: "Grace Chebet",
    status: "Active",
  },
];

const defaultAssignments: SchoolAssignment[] = [
  {
    id: "a1",
    schoolId: "s1",
    curriculumId: "1",
    curriculumName: "CBC Junior Secondary",
    curriculumCode: "CBC-JS-2024",
    assignedDate: "2024-03-15",
    effectiveDate: "2024-03-15",
    status: "Active",
  },
  {
    id: "a2",
    schoolId: "s3",
    curriculumId: "1",
    curriculumName: "CBC Junior Secondary",
    curriculumCode: "CBC-JS-2024",
    assignedDate: "2024-02-20",
    effectiveDate: "2024-02-20",
    status: "Active",
  },
  {
    id: "a3",
    schoolId: "s4",
    curriculumId: "4",
    curriculumName: "National Curriculum 8-4-4",
    curriculumCode: "NC-844-2023",
    assignedDate: "2024-01-10",
    effectiveDate: "2024-01-10",
    status: "Inactive",
  },
];

const defaultStudents: Student[] = [
  {
    id: "stu-s1-1",
    schoolId: "s1",
    classId: "c1",
    name: "Amani Njoroge",
    admissionNumber: "GA-001",
    status: "Active",
  },
  {
    id: "stu-s1-2",
    schoolId: "s1",
    classId: "c1",
    name: "Brian Otieno",
    admissionNumber: "GA-002",
    status: "Active",
  },
  {
    id: "stu-s1-3",
    schoolId: "s1",
    classId: "c2",
    name: "Neema Wambui",
    admissionNumber: "GA-003",
    status: "Active",
  },
  {
    id: "stu-s1-4",
    schoolId: "s1",
    classId: "c1",
    name: "Chloe Mwangi",
    admissionNumber: "GA-004",
    status: "Active",
  },
  {
    id: "stu-s1-5",
    schoolId: "s1",
    classId: "c1",
    name: "Daniel Kirui",
    admissionNumber: "GA-005",
    status: "Active",
  },
  {
    id: "stu-s1-6",
    schoolId: "s1",
    classId: "c2",
    name: "Esther Kamau",
    admissionNumber: "GA-006",
    status: "Active",
  },
  {
    id: "stu-s1-7",
    schoolId: "s1",
    classId: "c4",
    name: "Fidelis Ouma",
    admissionNumber: "GA-007",
    status: "Active",
  },
  {
    id: "stu-s1-8",
    schoolId: "s1",
    classId: "c4",
    name: "Grace Odhiambo",
    admissionNumber: "GA-008",
    status: "Active",
  },
  {
    id: "stu-s2-1",
    schoolId: "s2",
    classId: "c1",
    name: "James Mworia",
    admissionNumber: "RIS-001",
    status: "Active",
  },
  {
    id: "stu-s2-2",
    schoolId: "s2",
    classId: "c2",
    name: "Khadija Omar",
    admissionNumber: "RIS-002",
    status: "Active",
  },
  {
    id: "stu-s2-3",
    schoolId: "s2",
    classId: "c1",
    name: "Liam Otieno",
    admissionNumber: "RIS-003",
    status: "Active",
  },
  {
    id: "stu-s3-1",
    schoolId: "s3",
    classId: "c1",
    name: "Zuri Achieng",
    admissionNumber: "SHS-001",
    status: "Active",
  },
  {
    id: "stu-s3-2",
    schoolId: "s3",
    classId: "c2",
    name: "David Mwangi",
    admissionNumber: "SHS-002",
    status: "Active",
  },
  {
    id: "stu-s3-3",
    schoolId: "s3",
    classId: "c1",
    name: "Hassan Ali",
    admissionNumber: "SHS-003",
    status: "Active",
  },
  {
    id: "stu-s3-4",
    schoolId: "s3",
    classId: "c2",
    name: "Irene Njeri",
    admissionNumber: "SHS-004",
    status: "Active",
  },
  {
    id: "stu-s4-1",
    schoolId: "s4",
    classId: "c1",
    name: "Martha Kambo",
    admissionNumber: "VV-001",
    status: "Active",
  },
  {
    id: "stu-s4-2",
    schoolId: "s4",
    classId: "c2",
    name: "Noah Wanyoike",
    admissionNumber: "VV-002",
    status: "Active",
  },
  {
    id: "stu-s5-1",
    schoolId: "s5",
    classId: "c1",
    name: "Olivia Ndegwa",
    admissionNumber: "LW-001",
    status: "Active",
  },
  {
    id: "stu-s5-2",
    schoolId: "s5",
    classId: "c2",
    name: "Peter Kiplagat",
    admissionNumber: "LW-002",
    status: "Active",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readFromStorage<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  const saved = window.localStorage.getItem(key);
  if (!saved) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

export function getSchools() {
  return readFromStorage<School[]>(SCHOOLS_STORAGE_KEY, defaultSchools);
}

export function getAssignments() {
  return readFromStorage<SchoolAssignment[]>(ASSIGNMENTS_STORAGE_KEY, defaultAssignments);
}

export function getAssignmentsForCurriculum(curriculumId: string | undefined) {
  return getAssignments().filter((assignment) => assignment.curriculumId === curriculumId);
}

export function getAssignmentsForSchool(schoolId: string) {
  return getAssignments().filter((assignment) => assignment.schoolId === schoolId);
}

export function getStudents() {
  const students = readFromStorage<Student[]>(STUDENTS_STORAGE_KEY, defaultStudents);
  if (Array.isArray(students) && students.length === 0) {
    if (canUseStorage()) {
      window.localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(defaultStudents));
    }
    return defaultStudents;
  }

  return students;
}

export function getStudentsForSchool(schoolId: string) {
  return getStudents().filter((student) => student.schoolId === schoolId && student.status === "Active");
}

export function seedDefaultStudents() {
  if (canUseStorage()) {
    window.localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(defaultStudents));
  }

  return defaultStudents;
}

function migrateSupplementaryCourses(): SupplementaryCurriculum[] {
  const legacyCourses = readFromStorage<
    Array<{
      id: string;
      schoolId: string;
      curriculumId: string;
      termId?: string;
      classId?: string;
      name: string;
      code: string;
      description?: string;
      createdAt: string;
    }>
  >(SUPPLEMENTARY_COURSES_STORAGE_KEY, []);

  return legacyCourses.map((course) => ({
    id: course.id,
    schoolId: course.schoolId,
    baseCurriculumId: course.curriculumId,
    type: "substitute" as const,
    scope: course.classId ? ("class" as const) : ("school" as const),
    termId: course.termId || "all",
    classId: course.classId,
    name: course.name,
    code: course.code,
    description: course.description,
    courses: [
      {
        id: `${course.id}-course`,
        name: course.name,
        code: course.code,
        description: course.description,
      },
    ],
    effectiveDate: course.createdAt,
    status: "Active" as const,
    createdAt: course.createdAt,
  }));
}

export function getSupplementaryCurriculums() {
  if (!canUseStorage()) {
    return [];
  }

  const saved = window.localStorage.getItem(SUPPLEMENTARY_CURRICULUMS_STORAGE_KEY);
  if (!saved) {
    const migrated = migrateSupplementaryCourses();
    window.localStorage.setItem(SUPPLEMENTARY_CURRICULUMS_STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  }

  try {
    const parsed = JSON.parse(saved) as SupplementaryCurriculum[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getSupplementaryCurriculumsForSchool(schoolId: string) {
  return getSupplementaryCurriculums().filter((curriculum) => curriculum.schoolId === schoolId);
}

export function saveSupplementaryCurriculum(curriculum: SupplementaryCurriculum) {
  const curriculums = getSupplementaryCurriculums();
  const nextCurriculums = [
    curriculum,
    ...curriculums.filter((item) => item.id !== curriculum.id),
  ];

  if (canUseStorage()) {
    window.localStorage.setItem(SUPPLEMENTARY_CURRICULUMS_STORAGE_KEY, JSON.stringify(nextCurriculums));
  }

  return nextCurriculums;
}

export function saveAssignment(assignment: SchoolAssignment) {
  const assignments = getAssignments();
  const nextAssignments = [
    assignment,
    ...assignments.filter(
      (item) =>
        !(item.schoolId === assignment.schoolId && item.curriculumId === assignment.curriculumId)
    ),
  ];

  if (canUseStorage()) {
    window.localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(nextAssignments));
  }

  return nextAssignments;
}

export function removeAssignmentFromSchool(schoolId: string, curriculumId: string) {
  const assignments = getAssignments();
  const nextAssignments = assignments.map((assignment) =>
    assignment.schoolId === schoolId &&
    assignment.curriculumId === curriculumId &&
    assignment.status === "Active"
      ? { ...assignment, status: "Inactive" as const }
      : assignment
  );

  if (canUseStorage()) {
    window.localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(nextAssignments));
  }

  return nextAssignments;
}

export function updateAssignmentStatus(assignmentId: string, status: SchoolAssignment["status"]) {
  const assignments = getAssignments();
  const nextAssignments = assignments.map((assignment) =>
    assignment.id === assignmentId ? { ...assignment, status } : assignment
  );

  if (canUseStorage()) {
    window.localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(nextAssignments));
  }

  return nextAssignments;
}
