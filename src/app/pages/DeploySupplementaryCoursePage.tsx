import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell,
  BookOpen,
  Bot,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Filter,
  HeartHandshake,
  Info,
  Search,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { getCurriculums } from "../lib/curriculumStorage";
import { getAssignments, getSchools, saveSupplementaryCurriculum } from "../lib/schoolStorage";

type CourseOption = {
  id: string;
  name: string;
  term: string;
  subject: string;
  grades: string;
  description: string;
  tag: string;
  type: "Additive" | "Cohort-Specific";
  icon: LucideIcon;
  accent: string;
};

const courseOptions: CourseOption[] = [
  {
    id: "robotics",
    name: "Robotics Enrichment",
    term: "Term 2",
    subject: "STEM",
    grades: "7 - 9",
    description: "Hands-on robotics and coding to build problem-solving skills.",
    tag: "Active",
    type: "Additive",
    icon: Bot,
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
    icon: Brain,
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
    icon: HeartHandshake,
    accent: "rose",
  },
];

export function DeploySupplementaryCoursePage() {
  const navigate = useNavigate();
  const [schools] = useState(() => getSchools());
  const [assignments] = useState(() => getAssignments());
  const [curriculums] = useState(() => getCurriculums());
  const [selectedSchoolId, setSelectedSchoolId] = useState(() => schools[0]?.id || "");
  const [selectedCourseId, setSelectedCourseId] = useState(courseOptions[0].id);
  const [selectedGrade, setSelectedGrade] = useState("Grade 8");
  const [cohort, setCohort] = useState("Cohort A");
  const [scope, setScope] = useState("Grade");
  const [supplementType, setSupplementType] = useState("Additive");
  const [integration, setIntegration] = useState("Stand-Alone");
  const [pacing, setPacing] = useState("default");

  const selectedSchool = schools.find((school) => school.id === selectedSchoolId) || schools[0];
  const activeAssignment = assignments.find((assignment) => assignment.schoolId === selectedSchool?.id && assignment.status === "Active") || assignments[0];
  const baseCurriculum = curriculums.find((curriculum) => curriculum.id === activeAssignment?.curriculumId) || curriculums[0];
  const selectedCourse = courseOptions.find((course) => course.id === selectedCourseId) || courseOptions[0];
  const selectedTerm = baseCurriculum?.structure[0];
  const selectedClass = selectedTerm?.classes.find((cls) => cls.name === selectedGrade) || selectedTerm?.classes[0];

  const schoolOptions = useMemo(
    () => schools.map((school) => ({ id: school.id, label: school.name })),
    [schools]
  );

  const handleSubmit = () => {
    if (!selectedSchool || !baseCurriculum) return;

    saveSupplementaryCurriculum({
      id: `supplementary-curriculum-${Date.now()}`,
      schoolId: selectedSchool.id,
      baseCurriculumId: baseCurriculum.id,
      type: supplementType === "Additive" ? "complementary" : "substitute",
      scope: "class",
      termId: selectedTerm?.id || "term-2",
      classId: selectedClass?.id,
      name: `${selectedCourse.name} ${selectedCourse.term}`,
      code: `SUP-${selectedCourse.id.toUpperCase()}`,
      description: selectedCourse.description,
      courses: [
        {
          id: `supplementary-course-${Date.now()}`,
          name: selectedCourse.name,
          code: `SUP-${selectedCourse.id.toUpperCase()}`,
          description: selectedCourse.description,
        },
      ],
      effectiveDate: "2024-04-15",
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    });

    navigate(selectedSchool ? `/schools/${selectedSchool.id}` : "/schools");
  };

  return (
    <div className="min-h-full bg-[#F7F9FC]">
      <div className="mx-auto max-w-[1540px] px-6 py-5 lg:px-8">
        <header className="mb-7">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <Link to="/curriculums" className="font-medium text-blue-600">Curriculum</Link>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <Link to="/assignments" className="font-medium text-blue-600">Deployments</Link>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-700">Supplementary Course</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-[0px] text-slate-900">Deploy Supplementary Course</h1>
              <p className="mt-3 text-base text-slate-600">
                Add enrichment, remediation, or specialized courses to a school's curriculum without altering the base curriculum.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative hidden h-11 min-w-[320px] lg:block">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search Digifunzi..."
                  className="h-full w-full rounded-xl border-0 bg-slate-100 pl-12 pr-4 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm">
                <CircleHelp className="h-5 w-5" />
              </button>
              <button className="relative grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[11px] font-semibold text-white">0</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">JK</div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">Jane K.</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button className="h-11 rounded-lg border border-slate-300 bg-white px-7 text-sm font-semibold text-blue-700 shadow-sm hover:bg-slate-50">
              Save as Draft
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Review & Submit
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        <StepProgress />

        <div className="mb-5 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          <Info className="h-4 w-4" />
          Supplementary courses are added on top of the base curriculum. They do not replace or modify existing courses unless specified.
          <X className="ml-auto h-4 w-4 text-blue-500" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_450px]">
          <main className="space-y-5">
            <Panel title="1. Select School" description="Choose the school and base curriculum this supplement will be added to.">
              <div className="grid gap-5 md:grid-cols-[0.9fr_1fr]">
                <div>
                  <Label required>School</Label>
                  <SelectBox
                    value={selectedSchool?.name || "Select school"}
                    onClick={() => {
                      const currentIndex = schoolOptions.findIndex((school) => school.id === selectedSchoolId);
                      const next = schoolOptions[(currentIndex + 1) % schoolOptions.length];
                      if (next) setSelectedSchoolId(next.id);
                    }}
                  />
                </div>
                <div>
                  <Label>Base Curriculum</Label>
                  <div className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">{baseCurriculum?.name || "CBC Junior Secondary"} v{baseCurriculum?.version || "1.1"}</p>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
                      </div>
                      <p className="text-sm text-slate-500">Deployed on 15 Jan 2024 • Grades 7 - 9 • 3 Terms</p>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="2. Choose Supplementary Course" description="Select an approved supplementary course to add.">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <Label>Course Library</Label>
                <div className="flex flex-wrap gap-2">
                  <div className="relative h-10 w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input placeholder="Search courses..." className="h-full w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:ring-4 focus:ring-blue-100" />
                  </div>
                  <SmallSelect label="All Types" />
                  <SmallSelect label="All Subjects" />
                  <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {courseOptions.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    selected={selectedCourseId === course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                  />
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-center text-sm text-slate-600">
                Can't find what you need? <button className="font-semibold text-blue-600">Request a new supplementary course ↗</button>
              </div>
            </Panel>

            <Panel title="3. Configure Supplement" description="Define how this course will be delivered.">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label>Supplement Type</Label>
                  <SelectBox value={supplementType} onClick={() => setSupplementType(supplementType === "Additive" ? "Substitutive" : "Additive")} icon={<ShieldCheck className="h-5 w-5 text-teal-600" />} />
                  <p className="mt-2 text-xs text-slate-500">Adds new content without changing the base curriculum</p>
                </div>
                <div>
                  <Label>Integration with Base Curriculum</Label>
                  <SelectBox value={integration} onClick={() => setIntegration(integration === "Stand-Alone" ? "Integrated" : "Stand-Alone")} />
                  <p className="mt-2 text-xs text-slate-500">Does not replace any existing courses</p>
                </div>
              </div>

              <div className="mt-5">
                <Label>Course Pacing</Label>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    ["default", "Use Course Default", "Follows the recommended 13-week plan"],
                    ["custom", "Customize Pacing", "Adjust weeks and milestones"],
                    ["condensed", "Condensed", "Deliver in fewer weeks"],
                  ].map(([value, title, detail]) => (
                    <button
                      key={value}
                      onClick={() => setPacing(value)}
                      className={`rounded-lg border p-4 text-left ${pacing === value ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                    >
                      <span className="flex items-start gap-3">
                        <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full border ${pacing === value ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>
                          {pacing === value && <Check className="h-3 w-3" />}
                        </span>
                        <span>
                          <span className="block font-semibold text-slate-900">{title}</span>
                          <span className="mt-1 block text-sm text-slate-500">{detail}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Panel>
          </main>

          <aside className="space-y-5">
            <SummaryCard
              school={selectedSchool?.name || "Greenfield Academy"}
              baseCurriculum={`${baseCurriculum?.name || "CBC Junior Secondary"} v${baseCurriculum?.version || "1.1"}`}
              course={`${selectedCourse.name} ${selectedCourse.term}`}
              type={supplementType}
              scope={`${selectedGrade} • ${cohort}`}
            />

            <Panel title="Scope & Schedule" description="4. Set Scope and Dates" secondaryDescription="Choose who will access this course and when.">
              <Label>Apply To</Label>
              <div className="mb-5 grid grid-cols-4 rounded-lg bg-blue-50 p-1 text-sm font-semibold text-slate-500">
                {["Grade", "Class", "Cohort", "Learners"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setScope(item)}
                    className={`rounded-md px-3 py-2 ${scope === item ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-500" : ""}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <Label required>Grade Level</Label>
              <div className="mb-5 flex flex-wrap gap-5 text-sm text-slate-700">
                {["Grade 7", "Grade 8", "Grade 9"].map((grade) => (
                  <label key={grade} className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={selectedGrade === grade} onChange={() => setSelectedGrade(grade)} className="h-4 w-4 accent-blue-600" />
                    {grade}
                  </label>
                ))}
              </div>

              <Label>Cohort (Optional)</Label>
              <SelectBox value={cohort} onClick={() => setCohort(cohort === "Cohort A" ? "Cohort B" : "Cohort A")} />

              <div className="mt-5">
                <Label>Effective Dates</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <DateBox label="Start Date" value="15 Apr 2024" />
                  <DateBox label="End Date" value="05 Jul 2024" />
                </div>
              </div>
            </Panel>

            <div className="flex gap-4 rounded-lg border border-emerald-100 bg-emerald-50 p-5">
              <ShieldCheck className="h-10 w-10 shrink-0 text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Approval Required</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This deployment will be reviewed by a Deployment Admin before it goes live.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StepProgress() {
  const steps = ["Select School", "Choose Course", "Configure", "Set Scope & Dates", "Review"];
  return (
    <div className="mb-7 px-8">
      <div className="flex items-start">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-1 items-start">
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <div className={`grid h-12 w-12 place-items-center rounded-full border-2 text-sm font-semibold shadow-sm ${index === 0 ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-900"}`}>
                {index + 1}
              </div>
              <span className={`mt-3 text-center text-sm font-semibold ${index === 0 ? "text-slate-900" : "text-slate-500"}`}>{step}</span>
            </div>
            {index < steps.length - 1 && <div className="mt-6 h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel({
  title,
  description,
  secondaryDescription,
  children,
}: {
  title: string;
  description: string;
  secondaryDescription?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        {secondaryDescription && <p className="mt-1 text-sm text-slate-500">{secondaryDescription}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Label({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-800">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function SelectBox({ value, onClick, icon }: { value: string; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-800">
      <span className="flex min-w-0 items-center gap-2">
        {icon}
        <span className="truncate">{value}</span>
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
  );
}

function SmallSelect({ label }: { label: string }) {
  return (
    <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600">
      {label}
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}

function CourseCard({ course, selected, onClick }: { course: CourseOption; selected: boolean; onClick: () => void }) {
  const Icon = course.icon;
  const tone =
    course.accent === "purple"
      ? "bg-purple-50 text-purple-600"
      : course.accent === "orange"
        ? "bg-orange-50 text-orange-600"
        : "bg-rose-50 text-rose-600";

  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg border p-5 text-left transition ${selected ? "border-blue-600 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-200"}`}
    >
      <span className={`mb-4 grid h-14 w-14 place-items-center rounded-full ${tone}`}>
        <Icon className="h-8 w-8" />
      </span>
      <span className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">{course.tag}</span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{course.type}</span>
      </span>
      <span className="block font-semibold text-slate-900">{course.name}</span>
      <span className="block text-sm text-slate-600">{course.term}</span>
      <span className="mt-4 block text-sm text-slate-600">Subject: {course.subject}</span>
      <span className="block text-sm text-slate-600">Grades: {course.grades}</span>
      <span className="mt-4 block text-sm leading-6 text-slate-500">{course.description}</span>
      <span className={`absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-md border ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>
        {selected && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

function SummaryCard({
  school,
  baseCurriculum,
  course,
  type,
  scope,
}: {
  school: string;
  baseCurriculum: string;
  course: string;
  type: string;
  scope: string;
}) {
  const rows = [
    ["School", school],
    ["Base Curriculum", baseCurriculum],
    ["Supplement Course", course],
    ["Type", type],
    ["Scope", scope],
    ["Dates", "15 Apr - 05 Jul 2024"],
    ["Status", "Pending Approval"],
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-slate-900">Deployment Summary</h2>
      <div className="space-y-4">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[150px_1fr] gap-4 text-sm">
            <span className="font-semibold text-slate-500">{label}</span>
            <span className="font-semibold text-slate-900">
              {label === "Type" ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">{value}</span>
              ) : label === "Status" ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">{value}</span>
              ) : (
                value
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DateBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <CalendarDays className="h-5 w-5 text-blue-600" />
        {value}
      </p>
    </div>
  );
}
