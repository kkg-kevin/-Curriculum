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

export interface SupplementaryCourse {
  id: string;
  schoolId: string;
  curriculumId: string;
  termId?: string;
  classId?: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

const SCHOOLS_STORAGE_KEY = "digifunzii.schools";
const ASSIGNMENTS_STORAGE_KEY = "digifunzii.schoolAssignments";
const SUPPLEMENTARY_COURSES_STORAGE_KEY = "digifunzii.supplementaryCourses";

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

export function getSupplementaryCourses() {
  return readFromStorage<SupplementaryCourse[]>(SUPPLEMENTARY_COURSES_STORAGE_KEY, []);
}

export function getSupplementaryCoursesForSchool(schoolId: string) {
  return getSupplementaryCourses().filter((course) => course.schoolId === schoolId);
}

export function saveSupplementaryCourse(course: SupplementaryCourse) {
  const courses = getSupplementaryCourses();
  const nextCourses = [
    course,
    ...courses.filter((item) => item.id !== course.id),
  ];

  if (canUseStorage()) {
    window.localStorage.setItem(SUPPLEMENTARY_COURSES_STORAGE_KEY, JSON.stringify(nextCourses));
  }

  return nextCourses;
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
