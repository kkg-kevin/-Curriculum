export type MockDeploymentStatus = "Active" | "Draft" | "Pending" | "Archived";
export type MockApprovalTone = "teal" | "amber" | "purple";
export type MockVersionStatus = "Published" | "Draft";
export type MockVersionType = "Major" | "Minor";
export type SupplementAccent = "purple" | "orange" | "rose";
export type SupplementCourseType = "Additive" | "Cohort-Specific";

export interface CurriculumManagementStat {
  title: string;
  value: number | string;
  detail: string;
  action: string;
  icon: "book" | "building" | "puzzle" | "users" | "chart";
  color: string;
  bg: string;
  progress?: number;
}

export interface MockDeployment {
  id: string;
  school: string;
  location: string;
  curriculum: string;
  dates: string;
  status: MockDeploymentStatus;
  supplements: number;
  action: string;
}

export interface MockApproval {
  id: string;
  title: string;
  school: string;
  detail: string;
  tag: string;
  color: MockApprovalTone;
  requestedBy: string;
  age: string;
}

export interface LearnerJourneyItem {
  title: string;
  detail: string;
  meta: string;
  icon: "book" | "puzzle" | "users" | "chart" | "trophy";
}

export interface MockVersion {
  id: string;
  version: string;
  status: MockVersionStatus;
  type: MockVersionType;
  date: string;
  author: string;
  description: string;
  deployedTo: string;
  current?: boolean;
}

export interface CurriculumSettingsState {
  competencies: boolean;
  autoArchive: boolean;
  outcomeMapping: boolean;
  courseReuse: boolean;
  supplements: boolean;
  supplementApproval: boolean;
  auditLogging: boolean;
  exportOptions: boolean;
  complianceMode: boolean;
}

export interface SupplementaryCourseOption {
  id: string;
  name: string;
  term: string;
  subject: string;
  grades: string;
  description: string;
  tag: string;
  type: SupplementCourseType;
  icon: "bot" | "brain" | "heart";
  accent: SupplementAccent;
}

const VERSION_STORAGE_KEY = "digifunzii.mockVersions";
const SETTINGS_STORAGE_KEY = "digifunzii.mockSettings";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readStored<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

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

function writeStored<T>(key: string, value: T) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  return value;
}

export const defaultCurriculumManagementStats: CurriculumManagementStat[] = [
  {
    title: "Curriculum Versions",
    value: 12,
    detail: "Published",
    action: "View all",
    icon: "book",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Schools Deployed",
    value: 248,
    detail: "Across all curricula",
    action: "View all",
    icon: "building",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Active Supplements",
    value: 45,
    detail: "Across 32 schools",
    action: "View all",
    icon: "puzzle",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Learners on Journey",
    value: 128540,
    detail: "+8.4% this term",
    action: "View reports",
    icon: "users",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Completion Rate",
    value: "72%",
    detail: "Across all schools",
    action: "View analytics",
    icon: "chart",
    color: "text-blue-600",
    bg: "bg-blue-50",
    progress: 72,
  },
];

export const mockDeployments: MockDeployment[] = [
  {
    id: "deploy-greenfield",
    school: "Greenfield Academy",
    location: "Nairobi",
    curriculum: "CBC Junior Secondary v1.1",
    dates: "Jan 15, 2024 - Dec 20, 2024",
    status: "Active",
    supplements: 2,
    action: "Manage",
  },
  {
    id: "deploy-starlight",
    school: "Starlight International",
    location: "Mombasa",
    curriculum: "British Lower Secondary v2.0",
    dates: "Nov 1, 2023 - Oct 31, 2024",
    status: "Active",
    supplements: 1,
    action: "Manage",
  },
  {
    id: "deploy-riverside",
    school: "Riverside School",
    location: "Kisumu",
    curriculum: "CBC Junior Secondary v1.1",
    dates: "Jan 10, 2024 - Dec 15, 2024",
    status: "Draft",
    supplements: 0,
    action: "Continue",
  },
  {
    id: "deploy-bright-future",
    school: "Bright Future Academy",
    location: "Eldoret",
    curriculum: "IGCSE 9-1 v1.0",
    dates: "Feb 1, 2024 - Jan 31, 2025",
    status: "Pending",
    supplements: 1,
    action: "Review",
  },
];

export const mockApprovals: MockApproval[] = [
  {
    id: "approval-robotics",
    title: "Supplement Request",
    school: "Greenfield Academy",
    detail: "Robotics Enrichment Term 2",
    tag: "Additive",
    color: "teal",
    requestedBy: "Mary O.",
    age: "2 days ago",
  },
  {
    id: "approval-pacing",
    title: "Override Request",
    school: "Riverside School",
    detail: "Compressed Term 2 Schedule",
    tag: "Pacing",
    color: "amber",
    requestedBy: "John M.",
    age: "5 days ago",
  },
  {
    id: "approval-design",
    title: "Supplement Request",
    school: "Starlight International",
    detail: "Replace Art with Digital Design",
    tag: "Substitutive",
    color: "purple",
    requestedBy: "Sarah A.",
    age: "1 week ago",
  },
];

export const defaultLearnerJourney: LearnerJourneyItem[] = [
  { title: "Base Curriculum", detail: "CBC Junior Secondary v1.1", meta: "3 Terms - 8 Courses", icon: "book" },
  { title: "Supplements", detail: "2 Active Supplements", meta: "Added to this school", icon: "puzzle" },
  { title: "Active Learners", detail: "1,245 Learners", meta: "In 45 Classes", icon: "users" },
  { title: "Progress", detail: "72% Avg. Completion", meta: "On track", icon: "chart" },
  { title: "Outcomes", detail: "85% Mastery Rate", meta: "This Term", icon: "trophy" },
];

export const defaultVersions: MockVersion[] = [
  {
    id: "version-1-1",
    version: "v1.1",
    status: "Published",
    type: "Minor",
    date: "12 Jan 2024",
    author: "Super Admin",
    description: "Added Digital Literacy, updated outcomes, improved rubrics.",
    deployedTo: "248 schools",
    current: true,
  },
  {
    id: "version-1-0",
    version: "v1.0",
    status: "Published",
    type: "Major",
    date: "01 Sep 2023",
    author: "Super Admin",
    description: "Initial release of the curriculum.",
    deployedTo: "220 schools",
  },
  {
    id: "version-0-3",
    version: "v0.3",
    status: "Draft",
    type: "Minor",
    date: "15 Aug 2023",
    author: "Curriculum Admin",
    description: "Added Social Studies and resources.",
    deployedTo: "-",
  },
  {
    id: "version-0-2",
    version: "v0.2",
    status: "Draft",
    type: "Minor",
    date: "02 Aug 2023",
    author: "Curriculum Admin",
    description: "Updated Grade 9 course structure.",
    deployedTo: "-",
  },
  {
    id: "version-0-1",
    version: "v0.1",
    status: "Draft",
    type: "Major",
    date: "20 Jul 2023",
    author: "Curriculum Admin",
    description: "First draft of curriculum.",
    deployedTo: "-",
  },
];

export const defaultSettings: CurriculumSettingsState = {
  competencies: true,
  autoArchive: true,
  outcomeMapping: true,
  courseReuse: true,
  supplements: true,
  supplementApproval: true,
  auditLogging: true,
  exportOptions: true,
  complianceMode: true,
};

export const supplementaryCourseOptions: SupplementaryCourseOption[] = [
  {
    id: "robotics",
    name: "Robotics Enrichment",
    term: "Term 2",
    subject: "STEM",
    grades: "7 - 9",
    description: "Hands-on robotics and coding to build problem-solving skills.",
    tag: "Active",
    type: "Additive",
    icon: "bot",
    accent: "purple",
  },
  {
    id: "ai-literacy",
    name: "AI & Digital Literacy",
    term: "Term 3",
    subject: "ICT",
    grades: "7 - 9",
    description: "Build foundational AI and digital citizenship skills.",
    tag: "Additive",
    type: "Additive",
    icon: "brain",
    accent: "orange",
  },
  {
    id: "math-remedial",
    name: "Remedial Mathematics",
    term: "Term 1",
    subject: "Mathematics",
    grades: "7 - 9",
    description: "Targeted support to strengthen core math concepts.",
    tag: "Cohort-Specific",
    type: "Cohort-Specific",
    icon: "heart",
    accent: "rose",
  },
];

export function getMockVersions() {
  return readStored<MockVersion[]>(VERSION_STORAGE_KEY, defaultVersions);
}

export function saveMockVersions(versions: MockVersion[]) {
  return writeStored(VERSION_STORAGE_KEY, versions);
}

export function createMockDraftVersion() {
  const versions = getMockVersions();
  const draftCount = versions.filter((version) => version.status === "Draft").length + 1;
  const nextVersion: MockVersion = {
    id: `version-draft-${Date.now()}`,
    version: `v1.${draftCount + 1}`,
    status: "Draft",
    type: "Minor",
    date: new Date().toLocaleDateString("en", { day: "2-digit", month: "short", year: "numeric" }),
    author: "Curriculum Admin",
    description: "New draft version created for curriculum updates.",
    deployedTo: "-",
  };

  return saveMockVersions([nextVersion, ...versions]);
}

export function getMockSettings() {
  return readStored<CurriculumSettingsState>(SETTINGS_STORAGE_KEY, defaultSettings);
}

export function saveMockSettings(settings: CurriculumSettingsState) {
  return writeStored(SETTINGS_STORAGE_KEY, settings);
}
