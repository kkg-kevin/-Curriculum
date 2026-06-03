import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  GripVertical,
  Info,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { DatePicker } from "../components/DatePicker";
import { getCurriculumById, saveCurriculum } from "../lib/curriculumStorage";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type CycleModel = "terms" | "semesters" | "custom";

interface Term {
  id: string;
  name: string;
  order: number;
  startDate?: Date;
  midTermStartDate?: Date;
  midTermEndDate?: Date;
  endDate?: Date;
}

interface Class {
  id: string;
  termId: string;
  name: string;
  order: number;
}

interface Course {
  id: string;
  classId: string;
  name: string;
  code: string;
  description: string;
}

const AVAILABLE_COURSES = [
  { name: "Mathematics", code: "MATH" },
  { name: "English Language", code: "ENG" },
  { name: "Science", code: "SCI" },
  { name: "Biology", code: "BIO" },
  { name: "Chemistry", code: "CHEM" },
  { name: "Physics", code: "PHY" },
  { name: "Computer Science", code: "CS" },
  { name: "Social Studies", code: "SOC" },
  { name: "History", code: "HIST" },
  { name: "Geography", code: "GEO" },
  { name: "Literature", code: "LIT" },
  { name: "Art & Design", code: "ART" },
  { name: "Music", code: "MUS" },
  { name: "Physical Education", code: "PE" },
  { name: "Business Studies", code: "BUS" },
  { name: "L1.1 Coding, AI and Robotics", code: "L1.1" },
  { name: "L2.1 Coding, AI and Robotics", code: "L2.1" },
  { name: "L3.1 Coding, AI and Robotics", code: "L3.1" },
];

const FRAMEWORK_OPTIONS = [
  "Competency-Based Curriculum (CBC)",
  "Cambridge International",
  "International Baccalaureate",
  "National Curriculum",
];

const EDUCATION_LEVEL_OPTIONS = [
  "Junior Secondary",
  "Primary",
  "Senior Secondary",
  "Middle Years",
  "Custom Level",
];

const CYCLE_MODELS: Array<{
  id: CycleModel;
  title: string;
  subtitle: string;
  icon: typeof CalendarDays;
}> = [
  { id: "terms", title: "3 Terms", subtitle: "(Term 1, Term 2, Term 3)", icon: CalendarDays },
  { id: "semesters", title: "2 Semesters", subtitle: "(Sem 1, Sem 2)", icon: CalendarDays },
  { id: "custom", title: "Custom", subtitle: "Define your own", icon: Settings },
];

const cycleTermNames: Record<CycleModel, string[]> = {
  terms: ["Term 1", "Term 2", "Term 3"],
  semesters: ["Semester 1", "Semester 2"],
  custom: ["Period 1"],
};

function parseSavedDate(value: string | undefined) {
  return value ? new Date(value) : undefined;
}

function makeDefaultTerms(model: CycleModel): Term[] {
  return cycleTermNames[model].map((name, index) => ({
    id: `term-${index + 1}-${Date.now()}`,
    name,
    order: index,
  }));
}

function formatLocalDateRange(startDate?: Date, endDate?: Date) {
  if (startDate && endDate) {
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  if (startDate) return `Starts ${startDate.toLocaleDateString()}`;
  if (endDate) return `Ends ${endDate.toLocaleDateString()}`;
  return "Dates not set";
}

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function Pill({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-blue-50 px-3 text-xs font-medium text-slate-700">
      {label}
      {onRemove && (
        <button type="button" onClick={onRemove} className="text-slate-500 hover:text-slate-900">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}

export function CreateCurriculumWizard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const existingCurriculum = id ? getCurriculumById(id) : undefined;
  const isEditing = Boolean(existingCurriculum);
  const initialCycle = (existingCurriculum?.academicCycleModel as CycleModel) || "terms";
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [basicInfo, setBasicInfo] = useState({
    name: existingCurriculum?.name || "CBC Junior Secondary",
    code: existingCurriculum?.code || "CBC-JS-2024",
    version: existingCurriculum?.version || "1.0",
    description:
      existingCurriculum?.description ||
      "Competency-Based Curriculum for Junior Secondary (Grades 7-9) aligned with the latest CBC framework.",
    year: existingCurriculum?.year || "",
    startDate: parseSavedDate(existingCurriculum?.startDate),
    endDate: parseSavedDate(existingCurriculum?.endDate),
    framework: existingCurriculum?.framework || "Competency-Based Curriculum (CBC)",
    educationLevel: existingCurriculum?.educationLevel || "Junior Secondary",
    cycleModel: initialCycle,
  });
  const [countries, setCountries] = useState<string[]>(existingCurriculum?.countries || ["Kenya"]);
  const [tags, setTags] = useState<string[]>(existingCurriculum?.tags || ["CBC", "Junior Secondary", "Core Curriculum"]);

  const [terms, setTerms] = useState<Term[]>(
    () =>
      existingCurriculum?.structure.map((term, index) => ({
        id: term.id,
        name: term.name,
        order: index,
        startDate: parseSavedDate(term.startDate),
        midTermStartDate: parseSavedDate(term.midTermStartDate || term.midTermDate),
        midTermEndDate: parseSavedDate(term.midTermEndDate),
        endDate: parseSavedDate(term.endDate),
      })) || makeDefaultTerms(initialCycle)
  );
  const [classes, setClasses] = useState<Class[]>(
    () =>
      existingCurriculum?.structure.flatMap((term) =>
        term.classes.map((cls, index) => ({
          id: cls.id,
          termId: term.id,
          name: cls.name,
          order: index,
        }))
      ) || []
  );
  const [courses, setCourses] = useState<Course[]>(
    () =>
      existingCurriculum?.structure.flatMap((term) =>
        term.classes.flatMap((cls) =>
          cls.courses.map((course) => ({
            id: course.id,
            classId: cls.id,
            name: course.name,
            code: course.code,
            description: course.description || "",
          }))
        )
      ) || []
  );

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Structure" },
    { number: 3, title: "Classes & Courses" },
    { number: 4, title: "Competencies" },
    { number: 5, title: "Settings" },
    { number: 6, title: "Review" },
  ];

  const previewSubtitle = useMemo(() => {
    const grades = basicInfo.educationLevel === "Junior Secondary" ? "Grades 7 - 9" : basicInfo.educationLevel;
    return `${terms.length} ${terms.length === 1 ? "Period" : basicInfo.cycleModel === "semesters" ? "Semesters" : "Terms"} - ${grades}`;
  }, [basicInfo.cycleModel, basicInfo.educationLevel, terms.length]);

  const updateCycleModel = (cycleModel: CycleModel) => {
    setBasicInfo({ ...basicInfo, cycleModel });
    const currentNames = new Set(cycleTermNames[basicInfo.cycleModel]);
    const canReplaceTerms = terms.length === 0 || terms.every((term) => currentNames.has(term.name));
    if (canReplaceTerms) {
      setTerms(makeDefaultTerms(cycleModel));
      setClasses([]);
      setCourses([]);
    }
  };

  const addTerm = () => {
    setTerms([
      ...terms,
      {
        id: `term-${Date.now()}`,
        name: "",
        order: terms.length,
      },
    ]);
  };

  const updateTerm = (id: string, field: keyof Term, value: Term[keyof Term]) => {
    setTerms(terms.map((term) => (term.id === id ? { ...term, [field]: value } : term)));
  };

  const removeTerm = (id: string) => {
    setTerms(terms.filter((term) => term.id !== id));
    const removedClassIds = classes.filter((cls) => cls.termId === id).map((cls) => cls.id);
    setClasses(classes.filter((cls) => cls.termId !== id));
    setCourses(courses.filter((course) => !removedClassIds.includes(course.classId)));
  };

  const addClass = (termId: string) => {
    setClasses([
      ...classes,
      {
        id: `class-${Date.now()}`,
        termId,
        name: "",
        order: classes.filter((cls) => cls.termId === termId).length,
      },
    ]);
  };

  const addClassWithName = (termId: string, name: string) => {
    const existingClassNames = new Set(classes.filter((cls) => cls.termId === termId).map((cls) => cls.name.toLowerCase()));
    if (existingClassNames.has(name.toLowerCase())) return;
    setClasses((current) => [
      ...current,
      {
        id: `class-${Date.now()}-${name.replace(/\s+/g, "-").toLowerCase()}`,
        termId,
        name,
        order: current.filter((cls) => cls.termId === termId).length,
      },
    ]);
  };

  const addDefaultGradesToTerm = (termId: string) => {
    ["Grade 7", "Grade 8", "Grade 9"].forEach((grade) => addClassWithName(termId, grade));
  };

  const updateClassName = (id: string, name: string) => {
    setClasses(classes.map((item) => (item.id === id ? { ...item, name } : item)));
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter((cls) => cls.id !== id));
    setCourses(courses.filter((course) => course.classId !== id));
  };

  const addCourseToClass = (classId: string, name: string, code: string, description = "") => {
    const trimmedName = name.trim();
    const trimmedCode = code.trim();
    if (!trimmedName || !trimmedCode) return;
    const classCourses = courses.filter((course) => course.classId === classId);
    if (classCourses.some((course) => course.name.toLowerCase() === trimmedName.toLowerCase())) return;
    setCourses([
      ...courses,
      {
        id: `course-${Date.now()}-${trimmedCode.toLowerCase()}`,
        classId,
        name: trimmedName,
        code: trimmedCode,
        description,
      },
    ]);
  };

  const addCourseFromDropdown = (classId: string, courseName: string) => {
    const courseTemplate = AVAILABLE_COURSES.find((course) => course.name === courseName);
    if (!courseTemplate) return;
    addCourseToClass(classId, courseTemplate.name, courseTemplate.code);
  };

  const addCustomCourse = (classId: string, course: { name: string; code: string; description: string }) => {
    addCourseToClass(classId, course.name, course.code, course.description);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const updateCourseDescription = (id: string, description: string) => {
    setCourses(courses.map((course) => (course.id === id ? { ...course, description } : course)));
  };

  const buildCurriculumDraft = () => {
    const curriculumId = existingCurriculum?.id || `curriculum-${Date.now()}`;

    return {
      id: curriculumId,
      name: basicInfo.name.trim() || "Untitled Curriculum",
      code: basicInfo.code.trim() || "NO-CODE",
      version: basicInfo.version.trim() || "1.0",
      status: existingCurriculum?.status || "Active",
      schools: existingCurriculum?.schools || 0,
      createdAt: existingCurriculum?.createdAt || new Date().toISOString().split("T")[0],
      description: basicInfo.description.trim() || "No description provided",
      framework: basicInfo.framework,
      educationLevel: basicInfo.educationLevel,
      academicCycleModel: basicInfo.cycleModel,
      countries,
      tags,
      year: basicInfo.year.trim() || undefined,
      startDate: basicInfo.startDate?.toISOString(),
      endDate: basicInfo.endDate?.toISOString(),
      structure: terms.map((term, termIndex) => ({
        id: term.id,
        name: term.name.trim() || `Term ${termIndex + 1}`,
        startDate: term.startDate?.toISOString(),
        midTermStartDate: term.midTermStartDate?.toISOString(),
        midTermEndDate: term.midTermEndDate?.toISOString(),
        endDate: term.endDate?.toISOString(),
        classes: classes
          .filter((cls) => cls.termId === term.id)
          .map((cls, classIndex) => ({
            id: cls.id,
            name: cls.name.trim() || `Class ${classIndex + 1}`,
            courses: courses
              .filter((course) => course.classId === cls.id)
              .map((course) => ({
                id: course.id,
                name: course.name,
                code: course.code,
                description: course.description,
              })),
          })),
      })),
    };
  };

  const handleSave = () => {
    saveCurriculum(buildCurriculumDraft());
    navigate("/curriculums");
  };

  const handleOpenStructure = () => {
    const curriculumDraft = buildCurriculumDraft();
    saveCurriculum(curriculumDraft);
    navigate(`/curriculums/${curriculumDraft.id}`);
  };

  if (id && !existingCurriculum) {
    return (
      <div className="min-h-full bg-slate-50 p-8">
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">Curriculum not found</h1>
          <p className="mb-6 text-slate-600">This curriculum may have been removed or was not saved correctly.</p>
          <button
            onClick={() => navigate("/curriculums")}
            className="rounded-xl bg-[#1B50B8] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2563EB]"
          >
            Back to Curriculums
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F9FC]">
      <div className="mx-auto max-w-[1320px] px-6 py-6 lg:px-8">
        <header className="mb-7">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm">
                <button onClick={() => navigate("/curriculums")} className="font-medium text-blue-600 hover:text-blue-700">
                  Curriculum
                </button>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{isEditing ? "Edit Curriculum" : "Create New Curriculum"}</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-[0px] text-slate-900">
                {isEditing ? "Edit Curriculum" : "Create New Curriculum"}
              </h1>
              <p className="mt-2 text-base text-slate-600">
                Build a structured learning journey that can be deployed to one or more schools.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative hidden h-11 min-w-[300px] lg:block">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search Digifunzi..."
                  className="h-full w-full rounded-xl border-0 bg-slate-100 pl-12 pr-4 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm">
                <CircleHelp className="h-5 w-5" />
              </button>
              <button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm">
                <Bell className="h-5 w-5" />
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

          <div className="flex flex-col-reverse gap-5 xl:flex-row xl:items-center xl:justify-between">
            <StepProgress currentStep={currentStep} steps={steps} />
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                onClick={() => navigate("/curriculums")}
                className="h-11 rounded-lg border border-slate-300 bg-white px-7 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="h-11 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Save as Draft
              </button>
              <button
                onClick={() => (currentStep === 1 ? handleOpenStructure() : currentStep < 6 ? setCurrentStep((currentStep + 1) as Step) : handleSave())}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                {currentStep < 6 ? "Next: Add Structure" : isEditing ? "Save Changes" : "Save Curriculum"}
                {currentStep < 6 ? <ChevronRight className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </header>

        {currentStep === 1 && (
          <>
            <div className="grid gap-5 xl:grid-cols-[1fr_0.88fr]">
              <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-7">
                  <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
                  <p className="mt-1 text-sm text-slate-500">Provide the essential details about this curriculum.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <FieldLabel required>Curriculum Name</FieldLabel>
                    <input
                      value={basicInfo.name}
                      onChange={(event) => setBasicInfo({ ...basicInfo, name: event.target.value })}
                      className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <FieldLabel required>Curriculum Code</FieldLabel>
                    <input
                      value={basicInfo.code}
                      onChange={(event) => setBasicInfo({ ...basicInfo, code: event.target.value })}
                      className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <p className="mt-2 text-sm text-slate-500">A unique code to identify this curriculum.</p>
                  </div>

                  <div>
                    <FieldLabel required>Description</FieldLabel>
                    <div className="relative">
                      <textarea
                        value={basicInfo.description}
                        maxLength={300}
                        onChange={(event) => setBasicInfo({ ...basicInfo, description: event.target.value })}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 pr-9 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                      <span className="absolute bottom-2 right-3 text-xs text-slate-400">{basicInfo.description.length}/300</span>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel required>Curriculum Framework</FieldLabel>
                      <SelectField
                        value={basicInfo.framework}
                        options={FRAMEWORK_OPTIONS}
                        onChange={(framework) => setBasicInfo({ ...basicInfo, framework })}
                      />
                    </div>
                    <div>
                      <FieldLabel required>Education Level</FieldLabel>
                      <SelectField
                        value={basicInfo.educationLevel}
                        options={EDUCATION_LEVEL_OPTIONS}
                        onChange={(educationLevel) => setBasicInfo({ ...basicInfo, educationLevel })}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel required>Academic Cycle Model</FieldLabel>
                    <div className="grid gap-3 md:grid-cols-3">
                      {CYCLE_MODELS.map((model) => {
                        const Icon = model.icon;
                        const selected = basicInfo.cycleModel === model.id;
                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => updateCycleModel(model.id)}
                            className={`min-h-[92px] rounded-lg border p-4 text-center transition ${
                              selected
                                ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                            }`}
                          >
                            <Icon className="mx-auto mb-2 h-5 w-5" />
                            <span className="block text-sm font-semibold text-slate-900">{model.title}</span>
                            <span className="mt-1 block text-xs text-slate-500">{model.subtitle}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <TagInput
                    label="Intended Countries / Regions"
                    values={countries}
                    placeholder="Add region..."
                    onAdd={(value) => setCountries([...countries, value])}
                    onRemove={(value) => setCountries(countries.filter((country) => country !== value))}
                  />

                  <TagInput
                    label="Tags"
                    values={tags}
                    placeholder="Add tags..."
                    onAdd={(value) => setTags([...tags, value])}
                    onRemove={(value) => setTags(tags.filter((tag) => tag !== value))}
                  />

                  <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-3 text-xs font-medium text-blue-700">
                    <Info className="h-4 w-4 shrink-0" />
                    You can always edit these details later. Once published, a new version will be created for major changes.
                  </div>
                </div>
              </section>

              <aside className="space-y-5">
                <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Curriculum Preview</h2>
                  <p className="mt-1 text-sm text-slate-500">This is how your curriculum structure will look.</p>
                  <div className="mt-8 rounded-lg bg-blue-50/60 p-6">
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-blue-600 shadow-sm">
                        <BookOpen className="h-7 w-7" />
                      </div>
                      <div>
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Draft</span>
                        <h3 className="mt-2 font-semibold text-slate-900">{basicInfo.name || "Untitled Curriculum"}</h3>
                        <p className="mt-1 text-sm text-slate-600">{previewSubtitle}</p>
                      </div>
                    </div>
                    <div className="mx-auto mt-7 h-5 w-px bg-slate-200" />
                    <div className="grid gap-4 md:grid-cols-3">
                      {terms.slice(0, 3).map((term) => (
                        <div key={term.id} className="rounded-lg bg-blue-100/50 p-5 text-center">
                          <CalendarDays className="mx-auto mb-3 h-5 w-5 text-blue-600" />
                          <p className="font-semibold text-slate-900">{term.name || "New Period"}</p>
                          <p className="mt-1 text-xs text-slate-500">Coming up</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">What's next?</h2>
                  <p className="mt-2 text-sm text-slate-500">You'll define the academic structure, classes, and courses.</p>
                  <div className="mt-6 space-y-5">
                    <NextItem
                      icon={CalendarDays}
                      title="Add Terms & Periods"
                      description="Define the academic periods in this curriculum."
                      onClick={() => setCurrentStep(2)}
                    />
                    <NextItem
                      icon={Users}
                      title="Add Classes / Grades"
                      description="Set up the grade levels for this curriculum."
                      onClick={() => setCurrentStep(3)}
                    />
                    <NextItem
                      icon={ClipboardList}
                      title="Add Courses"
                      description="Attach subjects to each class and term."
                      onClick={() => setCurrentStep(3)}
                    />
                  </div>
                </section>
              </aside>
            </div>

            <FeatureStrip />
          </>
        )}

        {currentStep === 2 && (
          <WizardPanel title="Academic Structure" description="Add and schedule the periods for this curriculum.">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">{terms.length}</span> period{terms.length !== 1 ? "s" : ""} configured
              </p>
              <button onClick={addTerm} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" />
                Add Term
              </button>
            </div>
            <div className="space-y-3">
              {terms.map((term, index) => (
                <div key={term.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-slate-400" />
                    <span className="w-8 text-sm font-semibold text-slate-500">#{index + 1}</span>
                    <input
                      value={term.name}
                      onChange={(event) => updateTerm(term.id, "name", event.target.value)}
                      placeholder="Term name"
                      className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <button onClick={() => removeTerm(term.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <DateField label="Start Date" value={term.startDate} onChange={(date) => updateTerm(term.id, "startDate", date)} />
                    <DateField label="Mid-Term Start" value={term.midTermStartDate} onChange={(date) => updateTerm(term.id, "midTermStartDate", date)} />
                    <DateField label="Mid-Term End" value={term.midTermEndDate} onChange={(date) => updateTerm(term.id, "midTermEndDate", date)} />
                    <DateField label="End Date" value={term.endDate} onChange={(date) => updateTerm(term.id, "endDate", date)} />
                  </div>
                </div>
              ))}
            </div>
          </WizardPanel>
        )}

        {currentStep === 3 && (
          <WizardPanel title="Classes & Courses" description="Add grades/classes under each period, then attach the subjects they will study.">
            <div className="space-y-5">
              <div className="grid gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 md:grid-cols-3">
                <SetupStat label="Terms / Periods" value={terms.length} />
                <SetupStat label="Classes / Grades" value={classes.length} />
                <SetupStat label="Courses" value={courses.length} />
              </div>

              {terms.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <CalendarDays className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                  <p className="font-semibold text-slate-900">Add a term or period first</p>
                  <p className="mt-1 text-sm text-slate-500">Classes and courses are organized under each academic period.</p>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add Terms & Periods
                  </button>
                </div>
              )}

              {terms.map((term) => {
                const termClasses = classes.filter((cls) => cls.termId === term.id);
                return (
                  <section key={term.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{term.name || "Unnamed Term"}</h3>
                        <p className="text-xs text-slate-500">
                          {termClasses.length} class{termClasses.length !== 1 ? "es" : ""} added - {termClasses.reduce(
                            (total, cls) => total + courses.filter((course) => course.classId === cls.id).length,
                            0
                          )} courses
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => addDefaultGradesToTerm(term.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700"
                        >
                          <Users className="h-4 w-4" />
                          Add Grades 7-9
                        </button>
                        <button onClick={() => addClass(term.id)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                          <Plus className="h-4 w-4" />
                          Add Class
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {termClasses.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center">
                          <p className="font-semibold text-slate-900">No classes or grades yet</p>
                          <p className="mt-1 text-sm text-slate-500">Add one class manually or start with Grades 7-9.</p>
                        </div>
                      )}

                      {termClasses.map((cls, index) => {
                        const classCourses = courses.filter((course) => course.classId === cls.id);
                        const availableCourses = AVAILABLE_COURSES.filter((course) => !classCourses.some((added) => added.name === course.name));
                        return (
                          <div key={cls.id} className="rounded-lg border border-slate-200 bg-white p-4">
                            <div className="mb-4 flex items-center gap-3">
                              <GripVertical className="h-4 w-4 text-slate-400" />
                              <span className="w-6 text-sm font-semibold text-slate-500">#{index + 1}</span>
                              <input
                                value={cls.name}
                                onChange={(event) => updateClassName(cls.id, event.target.value)}
                                placeholder="Class name (e.g., Grade 7)"
                                className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                              />
                              <button onClick={() => removeClass(cls.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mb-3 grid gap-3 lg:grid-cols-[1fr_1.25fr]">
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600">Add preset course</label>
                                <select
                                  value=""
                                  onChange={(event) => {
                                    if (event.target.value) addCourseFromDropdown(cls.id, event.target.value);
                                  }}
                                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                >
                                  <option value="">Choose a course...</option>
                                  {availableCourses.map((course) => (
                                    <option key={course.code} value={course.name}>
                                      {course.name} ({course.code})
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <CourseCreator onAdd={(course) => addCustomCourse(cls.id, course)} />
                            </div>

                            <div className="space-y-2">
                              {classCourses.length === 0 && (
                                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                                  No courses added yet.
                                </div>
                              )}
                              {classCourses.map((course) => (
                                <div key={course.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                  <div className="mb-2 flex items-center justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-semibold text-slate-900">{course.name}</p>
                                      <p className="font-mono text-xs text-slate-500">{course.code}</p>
                                    </div>
                                    <button onClick={() => removeCourse(course.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <textarea
                                    value={course.description}
                                    onChange={(event) => updateCourseDescription(course.id, event.target.value)}
                                    placeholder="Optional course notes or learning objectives..."
                                    rows={2}
                                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </WizardPanel>
        )}

        {currentStep === 4 && (
          <PlaceholderPanel
            title="Competencies"
            description="Competency mapping will live here. The step is included now so the workflow matches the target curriculum setup."
            icon={Award}
          />
        )}

        {currentStep === 5 && (
          <PlaceholderPanel
            title="Settings"
            description="Publishing, visibility, and deployment settings will be configured here."
            icon={Settings}
          />
        )}

        {currentStep === 6 && (
          <WizardPanel title="Review Curriculum" description="Review your curriculum before saving.">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
              <h3 className="font-semibold text-slate-900">{basicInfo.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{basicInfo.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill label={basicInfo.code} />
                <Pill label={basicInfo.framework} />
                <Pill label={basicInfo.educationLevel} />
                {tags.map((tag) => (
                  <Pill key={tag} label={tag} />
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {terms.map((term) => (
                <div key={term.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <h4 className="font-semibold text-slate-900">{term.name}</h4>
                  {(term.startDate || term.endDate) && <p className="mt-1 text-xs text-slate-500">{formatLocalDateRange(term.startDate, term.endDate)}</p>}
                  {classes
                    .filter((cls) => cls.termId === term.id)
                    .map((cls) => (
                      <div key={cls.id} className="mt-4 border-l-2 border-blue-100 pl-4">
                        <p className="font-medium text-slate-800">{cls.name}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {courses
                            .filter((course) => course.classId === cls.id)
                            .map((course) => (
                              <Pill key={course.id} label={`${course.name} (${course.code})`} />
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </WizardPanel>
        )}

        {currentStep > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((currentStep - 1) as Step)}
              className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              onClick={() => (currentStep < 6 ? setCurrentStep((currentStep + 1) as Step) : handleSave())}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {currentStep < 6 ? "Next" : isEditing ? "Save Changes" : "Save Curriculum"}
              {currentStep < 6 ? <ChevronRight className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepProgress({ currentStep, steps }: { currentStep: Step; steps: Array<{ number: number; title: string }> }) {
  return (
    <div className="w-full max-w-5xl">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const active = currentStep === step.number;
          const completed = currentStep > step.number;
          return (
            <div key={step.number} className="flex flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-full border-2 text-sm font-semibold shadow-sm ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : completed
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {completed ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <span className={`mt-3 text-center text-xs font-semibold ${active ? "text-slate-800" : "text-slate-500"}`}>{step.title}</span>
              </div>
              {index < steps.length - 1 && <div className={`mt-6 h-px flex-1 ${completed ? "bg-blue-300" : "bg-slate-200"}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TagInput({
  label,
  values,
  placeholder,
  onAdd,
  onRemove,
}: {
  label: string;
  values: string[];
  placeholder: string;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [draft, setDraft] = useState("");

  const addValue = () => {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onAdd(trimmed);
    setDraft("");
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        {values.map((value) => (
          <Pill key={value} label={value} onRemove={() => onRemove(value)} />
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addValue();
            }
          }}
          onBlur={addValue}
          placeholder={placeholder}
          className="h-7 min-w-[120px] flex-1 border-0 bg-transparent text-sm outline-none"
        />
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
    </div>
  );
}

function NextItem({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof CalendarDays;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full gap-4 rounded-lg p-2 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </button>
  );
}

function SetupStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0px] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function CourseCreator({
  onAdd,
}: {
  onAdd: (course: { name: string; code: string; description: string }) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!name.trim() || !code.trim()) return;
    onAdd({ name, code, description });
    setName("");
    setCode("");
    setDescription("");
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">Add custom course</label>
      <div className="grid gap-2 md:grid-cols-[1fr_0.65fr_auto]">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Course name"
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Code"
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={submit}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Optional notes or learning objectives"
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function FeatureStrip() {
  const features = [
    { icon: ShieldCheck, title: "Version Controlled", description: "Every update creates a new version for easy tracking." },
    { icon: Award, title: "Standards-Aligned", description: "Map competencies and outcomes to learning standards." },
    { icon: Send, title: "Flexible Deployment", description: "Deploy to one or multiple schools with custom settings." },
    { icon: BarChart3, title: "Full Visibility", description: "Track progress and performance across all schools." },
  ];

  return (
    <div className="mt-5 grid gap-4 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4">
      {features.map((feature) => (
        <div key={feature.title} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
            <feature.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{feature.title}</p>
            <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WizardPanel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-7">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function PlaceholderPanel({ title, description, icon: Icon }: { title: string; description: string; icon: typeof Award }) {
  return (
    <WizardPanel title={title} description={description}>
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-blue-600">
          <Icon className="h-7 w-7" />
        </div>
        <p className="font-semibold text-slate-900">{title} coming up</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">This placeholder keeps the workflow aligned while the full feature is being built.</p>
      </div>
    </WizardPanel>
  );
}

function DateField({ label, value, onChange }: { label: string; value?: Date; onChange: (date?: Date) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
      <DatePicker value={value} onChange={onChange} placeholder="Select date" />
    </div>
  );
}
