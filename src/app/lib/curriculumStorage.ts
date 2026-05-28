export interface CurriculumCourse {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface CurriculumClass {
  id: string;
  name: string;
  courses: CurriculumCourse[];
}

export interface CurriculumTerm {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  classes: CurriculumClass[];
}

export interface Curriculum {
  id: string;
  name: string;
  code: string;
  version: string;
  status: "Active" | "Archived";
  schools: number;
  createdAt: string;
  description: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  structure: CurriculumTerm[];
}

const STORAGE_KEY = "digifunzii.curriculums";

export const defaultCurriculums: Curriculum[] = [
  {
    id: "1",
    name: "CBC Junior Secondary",
    code: "CBC-JS-2024",
    version: "1.0",
    status: "Active",
    schools: 12,
    createdAt: "2024-01-15",
    description: "Competency-Based Curriculum for Junior Secondary",
    structure: [
      {
        id: "t1",
        name: "Term 1",
        classes: [
          {
            id: "c1",
            name: "Grade 7",
            courses: [
              { id: "co1", name: "Mathematics", code: "MATH-7-1" },
              { id: "co2", name: "English Language", code: "ENG-7-1" },
              { id: "co3", name: "Science", code: "SCI-7-1" },
              { id: "co4", name: "Social Studies", code: "SOC-7-1" },
            ],
          },
          {
            id: "c2",
            name: "Grade 8",
            courses: [
              { id: "co5", name: "Mathematics", code: "MATH-8-1" },
              { id: "co6", name: "English Language", code: "ENG-8-1" },
              { id: "co7", name: "Biology", code: "BIO-8-1" },
              { id: "co8", name: "Chemistry", code: "CHEM-8-1" },
            ],
          },
        ],
      },
      {
        id: "t2",
        name: "Term 2",
        classes: [
          {
            id: "c4",
            name: "Grade 7",
            courses: [
              { id: "co13", name: "Mathematics", code: "MATH-7-2" },
              { id: "co14", name: "English Language", code: "ENG-7-2" },
              { id: "co15", name: "Science", code: "SCI-7-2" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Cambridge Primary Programme",
    code: "CAM-PRI-2024",
    version: "2.1",
    status: "Active",
    schools: 8,
    createdAt: "2024-02-20",
    description: "Cambridge International Primary Programme",
    structure: [],
  },
  {
    id: "3",
    name: "IB Middle Years Programme",
    code: "IB-MYP-2024",
    version: "1.5",
    status: "Active",
    schools: 5,
    createdAt: "2024-03-10",
    description: "International Baccalaureate Middle Years",
    structure: [],
  },
  {
    id: "4",
    name: "National Curriculum 8-4-4",
    code: "NC-844-2023",
    version: "3.2",
    status: "Archived",
    schools: 3,
    createdAt: "2023-09-05",
    description: "Legacy 8-4-4 System Curriculum",
    structure: [],
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getCurriculums(): Curriculum[] {
  if (!canUseStorage()) {
    return defaultCurriculums;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCurriculums));
    return defaultCurriculums;
  }

  try {
    const parsed = JSON.parse(saved) as Curriculum[];
    return Array.isArray(parsed) ? parsed : defaultCurriculums;
  } catch {
    return defaultCurriculums;
  }
}

export function getCurriculumById(id: string | undefined): Curriculum | undefined {
  return getCurriculums().find((curriculum) => curriculum.id === id);
}

export function saveCurriculum(curriculum: Curriculum) {
  const curriculums = getCurriculums();
  const existingIndex = curriculums.findIndex((item) => item.id === curriculum.id);
  const nextCurriculums =
    existingIndex >= 0
      ? curriculums.map((item) => (item.id === curriculum.id ? curriculum : item))
      : [curriculum, ...curriculums];

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCurriculums));
  }

  return nextCurriculums;
}
