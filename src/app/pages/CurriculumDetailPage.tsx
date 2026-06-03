import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Edit3,
  Eye,
  FileText,
  Folder,
  GraduationCap,
  Grid2X2,
  History,
  Layers3,
  ListTodo,
  MoreVertical,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { getCurriculumById, saveCurriculum, type Curriculum, type CurriculumTerm } from "../lib/curriculumStorage";

function formatDateRange(startDate?: string, endDate?: string) {
  const format = (value: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));

  if (startDate && endDate) return `${format(startDate)} - ${format(endDate)}`;
  if (startDate) return `Starts ${format(startDate)}`;
  if (endDate) return `Ends ${format(endDate)}`;
  return "Jan 15 - Apr 15, 2024 (13 weeks)";
}

function countCourses(term: CurriculumTerm) {
  return term.classes.reduce((total, cls) => total + cls.courses.length, 0);
}

function countAssessments(term: CurriculumTerm) {
  return Math.max(0, term.classes.length * 2 + Math.ceil(countCourses(term) / 5));
}

function countLessons(term: CurriculumTerm) {
  const courses = countCourses(term);
  return courses > 0 ? courses * 12 : 0;
}

export function CurriculumDetailPage() {
  const { id } = useParams();
  const [curriculum, setCurriculum] = useState<Curriculum | undefined>(() => getCurriculumById(id));
  const [selectedTermId, setSelectedTermId] = useState<string | undefined>(() => curriculum?.structure[0]?.id);

  const persistCurriculum = (nextCurriculum: Curriculum) => {
    saveCurriculum(nextCurriculum);
    setCurriculum(nextCurriculum);
  };

  const addTerm = (name: string) => {
    if (!curriculum) return;
    const trimmedName = name.trim();
    if (trimmedName && curriculum.structure.some((term) => term.name.toLowerCase() === trimmedName.toLowerCase())) return;
    const nextTerm = {
      id: `term-${Date.now()}`,
      name: trimmedName || `Term ${curriculum.structure.length + 1}`,
      classes: [],
    };
    persistCurriculum({ ...curriculum, structure: [...curriculum.structure, nextTerm] });
    setSelectedTermId(nextTerm.id);
  };

  const addClassToTerm = (termId: string, name: string) => {
    if (!curriculum) return;
    const targetTerm = curriculum.structure.find((term) => term.id === termId);
    const trimmedName = name.trim();
    if (!targetTerm) return;
    if (trimmedName && targetTerm.classes.some((cls) => cls.name.toLowerCase() === trimmedName.toLowerCase())) return;

    const nextCurriculum = {
      ...curriculum,
      structure: curriculum.structure.map((term) =>
        term.id === termId
          ? {
              ...term,
              classes: [
                ...term.classes,
                {
                  id: `class-${Date.now()}`,
                  name: trimmedName || `Class ${term.classes.length + 1}`,
                  courses: [],
                },
              ],
            }
          : term
      ),
    };
    persistCurriculum(nextCurriculum);
  };

  const addDefaultGradesToTerm = (termId: string) => {
    ["Grade 7", "Grade 8", "Grade 9"].forEach((grade) => addClassToTerm(termId, grade));
  };

  const addCourseToClass = (termId: string, classId: string, course: { name: string; code: string; description: string }) => {
    if (!curriculum) return;
    const trimmedName = course.name.trim();
    const trimmedCode = course.code.trim();
    if (!trimmedName || !trimmedCode) return;
    const targetClass = curriculum.structure.find((term) => term.id === termId)?.classes.find((cls) => cls.id === classId);
    if (!targetClass) return;
    if (targetClass.courses.some((item) => item.name.toLowerCase() === trimmedName.toLowerCase() || item.code.toLowerCase() === trimmedCode.toLowerCase())) return;

    const nextCurriculum = {
      ...curriculum,
      structure: curriculum.structure.map((term) =>
        term.id === termId
          ? {
              ...term,
              classes: term.classes.map((cls) =>
                cls.id === classId
                  ? {
                      ...cls,
                      courses: [
                        ...cls.courses,
                        {
                          id: `course-${Date.now()}`,
                          name: trimmedName,
                          code: trimmedCode,
                          description: course.description.trim() || undefined,
                        },
                      ],
                    }
                  : cls
              ),
            }
          : term
      ),
    };
    persistCurriculum(nextCurriculum);
  };

  const totals = useMemo(() => {
    if (!curriculum) return { terms: 0, classes: 0, courses: 0 };

    return {
      terms: curriculum.structure.length,
      classes: curriculum.structure.reduce((total, term) => total + term.classes.length, 0),
      courses: curriculum.structure.reduce((total, term) => total + countCourses(term), 0),
    };
  }, [curriculum]);

  if (!id) {
    return <Navigate to="/curriculums" replace />;
  }

  if (!curriculum) {
    return (
      <div className="min-h-full bg-slate-50 p-8">
        <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-8">
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">Curriculum not found</h1>
          <p className="mb-6 text-slate-600">This curriculum may have been removed or was not saved correctly.</p>
          <Link
            to="/curriculums"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Back to Curriculums
          </Link>
        </div>
      </div>
    );
  }

  const selectedTerm = curriculum.structure.find((term) => term.id === selectedTermId) ?? curriculum.structure[0];
  const structureValid = totals.terms > 0 && totals.classes > 0 && totals.courses > 0;
  const termBreakdown = curriculum.structure.map((term, index) => ({
    label: term.name || `Term ${index + 1}`,
    value: countCourses(term),
    color: ["#2F6FEF", "#2DBB7F", "#FBBF24"][index] || "#A855F7",
  }));

  return (
    <div className="min-h-full bg-[#F7F9FC]">
      <div className="mx-auto max-w-[1540px] px-6 py-5 lg:px-8">
        <header className="mb-6">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <Link to="/curriculums" className="font-medium text-blue-600 hover:text-blue-700">
                  Curriculum
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <Link to="/curriculums" className="font-medium text-blue-600 hover:text-blue-700">
                  Curriculum Library
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  {curriculum.name} v{curriculum.version}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-700">Structure</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-[0px] text-slate-900">Curriculum Structure</h1>
              <p className="mt-2 text-base text-slate-600">
                Design and organize the academic structure, terms, classes, courses, and learning content.
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
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[11px] font-semibold text-white">3</span>
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
            <Link
              to={`/curriculums/${curriculum.id}`}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              Preview Curriculum
            </Link>
            <Link
              to={`/curriculums/${curriculum.id}/edit`}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
              Curriculum Settings
            </Link>
            <button
              type="button"
              onClick={() => addTerm("")}
              className="inline-flex h-11 overflow-hidden rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <span className="inline-flex items-center gap-2 px-5">
                <Plus className="h-4 w-4" />
                Add New Item
              </span>
              <span className="grid w-11 place-items-center border-l border-white/20">
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
          </div>
        </header>

        <section className="mb-5 rounded-lg border border-slate-200 bg-blue-50/40 p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-blue-700 shadow-sm">
                <BookOpen className="h-9 w-9" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {curriculum.name} v{curriculum.version}
                  </h2>
                  <span className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {curriculum.status === "Active" ? "Published" : curriculum.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {curriculum.framework || "Competency-Based Curriculum (CBC)"} <span className="mx-2">•</span>
                  {totals.terms} Terms <span className="mx-2">•</span>
                  {curriculum.educationLevel === "Junior Secondary" || !curriculum.educationLevel ? "Grades 7 - 9" : curriculum.educationLevel}
                  <span className="mx-2">•</span>
                  Published on 12 Jan 2024
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[500px]">
              <SummaryStat icon={CalendarDays} value={totals.terms} label="Terms" />
              <SummaryStat icon={GraduationCap} value={totals.classes} label="Classes" />
              <SummaryStat icon={FileText} value={totals.courses} label="Courses" />
            </div>
          </div>
        </section>

        <nav className="mb-5 flex overflow-x-auto rounded-lg border border-slate-200 bg-white">
          {[
            { label: "Structure", icon: Grid2X2, active: true },
            { label: "Competencies", icon: ShieldCheck },
            { label: "Courses", icon: BookOpen },
            { label: "Assessments", icon: ClipboardCheck },
            { label: "Resources", icon: Folder },
            { label: "Mapping", icon: Workflow },
            { label: "History", icon: History },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`inline-flex h-14 min-w-max items-center gap-2 border-b-2 px-7 text-sm font-semibold ${
                tab.active
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        {curriculum.structure.length === 0 ? (
          <EmptyStructure onAddTerm={addTerm} />
        ) : (
          <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_330px]">
            <StructureTree
              curriculumName={`${curriculum.name} v${curriculum.version}`}
              terms={curriculum.structure}
              selectedTermId={selectedTerm?.id}
              onSelectTerm={setSelectedTermId}
              onAddTerm={addTerm}
            />

            <main className="rounded-lg border border-slate-200 bg-white">
              {selectedTerm && (
                <TermPanel
                  term={selectedTerm}
                  onAddClass={addClassToTerm}
                  onAddDefaultGrades={addDefaultGradesToTerm}
                  onAddCourse={addCourseToClass}
                />
              )}
            </main>

            <aside className="space-y-5">
              <StructureOverview totalCourses={totals.courses} terms={termBreakdown} />
              <QuickActions
                curriculumId={curriculum.id}
                onAddTerm={() => addTerm("")}
                onAddClass={() => selectedTerm && addClassToTerm(selectedTerm.id, "")}
                onAddDefaultGrades={() => selectedTerm && addDefaultGradesToTerm(selectedTerm.id)}
                canAssign={structureValid}
              />
              <ValidCard curriculumId={curriculum.id} isValid={structureValid} />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryStat({ icon: Icon, value, label }: { icon: typeof CalendarDays; value: number; label: string }) {
  return (
    <div className="flex items-center gap-4 border-slate-200 xl:border-l xl:pl-6">
      <div className="grid h-12 w-12 place-items-center rounded-lg border border-slate-200 bg-white text-blue-600">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function StructureTree({
  curriculumName,
  terms,
  selectedTermId,
  onSelectTerm,
  onAddTerm,
}: {
  curriculumName: string;
  terms: CurriculumTerm[];
  selectedTermId?: string;
  onSelectTerm: (id: string) => void;
  onAddTerm: (name: string) => void;
}) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Curriculum Structure</h2>
        <button className="text-sm font-semibold text-blue-600">Collapse All</button>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <ChevronDown className="h-4 w-4" />
        <BookOpen className="h-5 w-5 text-blue-600" />
        <span className="truncate">{curriculumName}</span>
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      </div>

      <div className="space-y-2 border-l border-dashed border-slate-200 pl-4">
        {terms.map((term, index) => {
          const isSelected = term.id === selectedTermId;
          return (
            <div key={term.id}>
              <button
                onClick={() => onSelectTerm(term.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold ${
                  isSelected ? "bg-blue-100 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isSelected ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <CalendarDays className="h-5 w-5 text-blue-600" />
                {term.name || `Term ${index + 1}`}
              </button>
              {isSelected && (
                <div className="ml-7 space-y-1 border-l border-dashed border-slate-200 py-2 pl-5">
                  {term.classes.map((cls) => (
                    <button key={cls.id} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <span className="flex items-center gap-3">
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        {cls.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <InlineNameForm buttonLabel="Add Term" placeholder="Term or semester name" onSubmit={onAddTerm} />
    </aside>
  );
}

function TermPanel({
  term,
  onAddClass,
  onAddDefaultGrades,
  onAddCourse,
}: {
  term: CurriculumTerm;
  onAddClass: (termId: string, name: string) => void;
  onAddDefaultGrades: (termId: string) => void;
  onAddCourse: (termId: string, classId: string, course: { name: string; code: string; description: string }) => void;
}) {
  const courses = countCourses(term);
  const lessons = countLessons(term);
  const assessments = countAssessments(term);

  return (
    <div>
      <section className="border-b border-slate-200 p-5">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-900">{term.name}</h2>
                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">Active</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{formatDateRange(term.startDate, term.endDate)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-blue-600 hover:bg-slate-50">
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => onAddDefaultGrades(term.id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-blue-600 hover:bg-slate-50"
            >
              Add Grades 7-9
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 text-blue-600 hover:bg-slate-50">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Metric icon={GraduationCap} value={term.classes.length} label="Classes" />
          <Metric icon={BookOpen} value={courses} label="Courses" />
          <Metric icon={FileText} value={lessons} label="Lessons" />
          <Metric icon={ClipboardCheck} value={assessments} label="Assessments" />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700">
          <CircleHelp className="h-4 w-4 shrink-0 text-blue-600" />
          This term contains {term.classes.length} classes with {courses} courses. Courses are organized by class.
        </div>
      </section>

      <section className="p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Courses by Class</h3>
            <p className="mt-1 text-sm text-slate-500">Manage courses for each class in this term.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-blue-600">Expand All</button>
            <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
              Add courses inside each class
            </span>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-800">Add class or grade to {term.name}</p>
          <InlineNameForm buttonLabel="Add Class / Grade" placeholder="Grade 7, Year 8, Form 1..." onSubmit={(name) => onAddClass(term.id, name)} compact />
        </div>

        <div className="space-y-4">
          {term.classes.map((cls) => (
            <div key={cls.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <p className="font-semibold text-slate-900">{cls.name}</p>
                  </div>
                  <p className="ml-4 mt-1 text-sm text-slate-500">
                    {cls.courses.length} Course{cls.courses.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                  {cls.courses.length === 0 ? (
                    <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">No courses added</span>
                  ) : (
                    cls.courses.map((course) => (
                      <span key={course.id} className="rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-slate-600">
                        {course.name}
                      </span>
                    ))
                  )}
                </div>

                <ChevronRight className="hidden h-5 w-5 shrink-0 text-slate-400 lg:block" />
              </div>

              <CourseInlineForm onSubmit={(course) => onAddCourse(term.id, cls.id, course)} />
            </div>
          ))}
        </div>

        {term.classes.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="font-semibold text-slate-800">No classes in this term yet</p>
            <p className="mt-1 text-sm text-slate-500">Add the first class above, then attach courses inside it.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function InlineNameForm({
  buttonLabel,
  placeholder,
  onSubmit,
  compact = false,
}: {
  buttonLabel: string;
  placeholder: string;
  onSubmit: (name: string) => void;
  compact?: boolean;
}) {
  const [name, setName] = useState("");

  const submit = () => {
    onSubmit(name);
    setName("");
  };

  return (
    <div className={`mt-5 flex flex-col gap-2 ${compact ? "mt-0 sm:flex-row" : ""}`}>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
      <button
        type="button"
        onClick={submit}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-dashed border-blue-500 px-4 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        <Plus className="h-4 w-4" />
        {buttonLabel}
      </button>
    </div>
  );
}

function CourseInlineForm({
  onSubmit,
}: {
  onSubmit: (course: { name: string; code: string; description: string }) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!name.trim() || !code.trim()) return;
    onSubmit({ name, code, description });
    setName("");
    setCode("");
    setDescription("");
  };

  return (
    <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0px] text-slate-500">Add course to this class</p>
      <div className="grid gap-2 lg:grid-cols-[1fr_0.45fr_1.2fr_auto]">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Course name"
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Code"
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional notes"
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={submit}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof GraduationCap; value: number; label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function StructureOverview({ totalCourses, terms }: { totalCourses: number; terms: Array<{ label: string; value: number; color: string }> }) {
  const displayTotal = totalCourses || terms.reduce((sum, term) => sum + term.value, 0);
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Structure Overview</h2>
      <div className="flex items-center gap-5">
        <div
          className="grid h-32 w-32 shrink-0 place-items-center rounded-full"
          style={{
            background: "conic-gradient(#2F6FEF 0 34%, #2DBB7F 34% 70%, #FBBF24 70% 92%, #A855F7 92% 100%)",
          }}
        >
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center">
            <div>
              <p className="text-2xl font-semibold text-slate-900">{displayTotal}</p>
              <p className="text-xs text-slate-500">Courses</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          {terms.map((term) => (
            <div key={term.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-slate-700">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: term.color }} />
                <span className="truncate">{term.label}</span>
              </span>
              <span className="font-medium text-slate-600">{term.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-purple-500" />
              Electives
            </span>
            <span className="font-medium text-slate-600">0</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickActions({
  curriculumId,
  onAddTerm,
  onAddClass,
  onAddDefaultGrades,
  canAssign,
}: {
  curriculumId: string;
  onAddTerm: () => void;
  onAddClass: () => void;
  onAddDefaultGrades: () => void;
  canAssign: boolean;
}) {
  const actions = [
    { title: "Add Term / Semester", description: "Define academic periods", icon: CalendarDays, onClick: onAddTerm },
    { title: "Add Class / Grade", description: "Create one class in selected term", icon: GraduationCap, onClick: onAddClass },
    { title: "Add Grades 7-9", description: "Create the standard grade set", icon: BookOpen, onClick: onAddDefaultGrades },
    { title: "Reorder Structure", description: "Drag and drop to organize", icon: ListTodo, onClick: undefined },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            type="button"
            key={action.title}
            onClick={action.onClick}
            disabled={!action.onClick}
            className="flex w-full items-center gap-4 rounded-lg bg-slate-50 p-4 text-left hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-cyan-50 text-teal-600">
              <action.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{action.title}</p>
              <p className="mt-1 text-sm text-slate-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
      <Link
        to={`/curriculums/${curriculumId}/assign`}
        className={`mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold ${
          canAssign
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "pointer-events-none bg-slate-100 text-slate-400"
        }`}
      >
        <Send className="h-4 w-4" />
        Assign Curriculum to Schools
      </Link>
    </section>
  );
}

function ValidCard({ curriculumId, isValid }: { curriculumId: string; isValid: boolean }) {
  return (
    <section className={`rounded-lg border p-5 ${isValid ? "border-emerald-100 bg-emerald-50" : "border-amber-100 bg-amber-50"}`}>
      <div className="flex gap-4">
        <ShieldCheck className={`h-9 w-9 shrink-0 ${isValid ? "text-emerald-600" : "text-amber-600"}`} />
        <div>
          <h2 className="font-semibold text-slate-900">{isValid ? "Structure is valid" : "Structure needs courses"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isValid
              ? "All required components are in place. This curriculum can now be assigned to schools."
              : "Add at least one term, class, and course before assigning this curriculum."}
          </p>
          <Link
            to={`/curriculums/${curriculumId}/assign`}
            className={`mt-3 inline-flex items-center gap-2 text-sm font-semibold ${isValid ? "text-blue-600" : "pointer-events-none text-slate-400"}`}
          >
            Continue to assignment
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyStructure({ onAddTerm }: { onAddTerm: (name: string) => void }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-blue-600">
        <Layers3 className="h-8 w-8" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">No structure added yet</h2>
      <p className="mx-auto mb-6 max-w-md text-sm text-slate-600">
        Add terms, classes, and courses to turn this curriculum into a visual learning plan.
      </p>
      <div className="mx-auto max-w-xl">
        <InlineNameForm buttonLabel="Build Structure" placeholder="Start with Term 1, Semester 1..." onSubmit={onAddTerm} compact />
      </div>
    </div>
  );
}
