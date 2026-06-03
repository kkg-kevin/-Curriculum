import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Eye,
  GraduationCap,
  LineChart,
  Plus,
  Puzzle,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { getCurriculums, type Curriculum } from "../lib/curriculumStorage";
import { getAssignments, getSchools, getStudents } from "../lib/schoolStorage";

function countCourses(curriculum: Curriculum) {
  return curriculum.structure.reduce(
    (total, term) => total + term.classes.reduce((classTotal, cls) => classTotal + cls.courses.length, 0),
    0
  );
}

function countClasses(curriculum: Curriculum) {
  return curriculum.structure.reduce((total, term) => total + term.classes.length, 0);
}

export function CurriculumListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [curriculums] = useState(() => getCurriculums());
  const [schools] = useState(() => getSchools());
  const [assignments] = useState(() => getAssignments());
  const [students] = useState(() => getStudents());

  const publishedCurriculums = curriculums.filter((curriculum) => curriculum.status === "Active");
  const primaryCurriculum = publishedCurriculums[0] || curriculums[0];
  const activeAssignments = assignments.filter((assignment) => assignment.status === "Active");
  const filteredCurriculums = curriculums.filter((curriculum) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return [curriculum.name, curriculum.code, curriculum.description].join(" ").toLowerCase().includes(query);
  });

  const stats = useMemo(
    () => [
      {
        title: "Curriculum Versions",
        value: publishedCurriculums.length || curriculums.length,
        detail: "Published",
        action: "View all",
        icon: BookOpen,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        title: "Schools Deployed",
        value: Math.max(activeAssignments.length, schools.length * 4 + curriculums.length * 12),
        detail: "Across all curricula",
        action: "View all",
        icon: Building2,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        title: "Active Supplements",
        value: 45,
        detail: "Across 32 schools",
        action: "View all",
        icon: Puzzle,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      {
        title: "Learners on Journey",
        value: Math.max(128540, students.length),
        detail: "+8.4% this term",
        action: "View reports",
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        title: "Completion Rate",
        value: "72%",
        detail: "Across all schools",
        action: "View analytics",
        icon: LineChart,
        color: "text-blue-600",
        bg: "bg-blue-50",
        progress: 72,
      },
    ],
    [activeAssignments.length, curriculums.length, publishedCurriculums.length, schools.length, students.length]
  );

  return (
    <div className="min-h-full bg-[#F7F9FC]">
      <div className="mx-auto max-w-[1540px] px-6 py-6 lg:px-8">
        <header className="mb-7">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-[0px] text-slate-900">Curriculum Management</h1>
              <p className="mt-2 text-base text-slate-600">Design, deploy, and track learning journeys across all schools</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative hidden h-11 min-w-[300px] lg:block">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
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

          <div className="flex flex-wrap justify-end gap-3">
            <Link
              to="/curriculums"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-blue-700 shadow-sm hover:bg-slate-50"
            >
              <Building2 className="h-4 w-4" />
              Curriculum Library
            </Link>
            <Link
              to="/curriculums/create"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Curriculum
            </Link>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
          <main className="space-y-6">
            {primaryCurriculum ? (
              <CurriculumPreview curriculum={primaryCurriculum} />
            ) : (
              <EmptyCard />
            )}

            <RecentDeployments curriculums={filteredCurriculums} schools={schools} assignments={assignments} />
          </main>

          <aside className="space-y-6">
            <DeploymentOverview activeCount={Math.max(activeAssignments.length, 186)} />
            <PendingApprovals />
          </aside>
        </div>

        <LearnerJourney curriculum={primaryCurriculum} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  detail,
  action,
  icon: Icon,
  color,
  bg,
  progress,
}: {
  title: string;
  value: number | string;
  detail: string;
  action: string;
  icon: typeof BookOpen;
  color: string;
  bg: string;
  progress?: number;
}) {
  return (
    <article className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className={`grid h-12 w-12 place-items-center rounded-lg ${bg} ${color}`}>
          <Icon className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <div className="flex items-center gap-4">
        {progress ? <ProgressRing value={progress} /> : null}
        <div>
          <p className="text-3xl font-semibold text-slate-900">{typeof value === "number" ? value.toLocaleString() : value}</p>
          <p className={`mt-1 text-sm ${detail.startsWith("+") ? "font-semibold text-emerald-600" : "text-slate-500"}`}>{detail}</p>
        </div>
      </div>
      <button className="mt-4 text-sm font-semibold text-blue-600">{action} →</button>
    </article>
  );
}

function ProgressRing({ value }: { value: number }) {
  return (
    <div
      className="grid h-16 w-16 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(#2563EB ${value * 3.6}deg, #E8EEF8 0deg)` }}
    >
      <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-semibold text-slate-900">{value}%</div>
    </div>
  );
}

function CurriculumPreview({ curriculum }: { curriculum: Curriculum }) {
  const term = curriculum.structure[0];
  const courses = term?.classes.flatMap((cls) => cls.courses) || [];
  const visibleCourses = courses.slice(0, 5);

  return (
    <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Curriculum Structure Preview</h2>
        <Link to={`/curriculums/${curriculum.id}`} className="text-sm font-semibold text-blue-600">
          View full curriculum →
        </Link>
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-white text-blue-700 shadow-sm">
            <BookOpen className="h-9 w-9" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">
                {curriculum.name} v{curriculum.version}
              </h3>
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Published</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {curriculum.structure.length} Terms • Grades 7 - 9 • Published on 12 Jan 2024
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto h-5 w-px bg-blue-200" />
      <div className="mx-auto mb-5 flex max-w-sm rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-500">
        {["Term 1", "Term 2", "Term 3"].map((label, index) => (
          <span key={label} className={`flex-1 rounded-full px-4 py-2 text-center ${index === 0 ? "bg-blue-600 text-white shadow-sm" : ""}`}>
            {label}
          </span>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {visibleCourses.map((course, index) => (
          <div key={course.id} className="rounded-lg bg-blue-50 p-4">
            <p className="truncate font-semibold text-slate-900">{course.name}</p>
            <p className="mt-3 text-sm text-slate-600">{index % 2 === 0 ? 5 : 6} Units</p>
            <p className="mt-1 text-sm text-slate-500">{index % 2 === 0 ? 4 : 3} Assessments</p>
          </div>
        ))}
        <Link to={`/curriculums/${curriculum.id}`} className="grid min-h-[94px] place-items-center rounded-lg bg-blue-50 p-4 text-center text-sm font-semibold text-blue-600">
          +<br />4 more<br />courses
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 rounded-lg bg-blue-50 p-4 text-center">
        <ShieldCheck className="h-7 w-7 text-blue-600" />
        <div>
          <p className="font-semibold text-slate-900">Competencies & Outcomes</p>
          <p className="text-sm text-slate-500">24 Key Competencies • 86 Learning Outcomes</p>
        </div>
      </div>
    </section>
  );
}

function RecentDeployments({
  curriculums,
  schools,
  assignments,
}: {
  curriculums: Curriculum[];
  schools: ReturnType<typeof getSchools>;
  assignments: ReturnType<typeof getAssignments>;
}) {
  const rows = [
    { school: "Greenfield Academy", location: "Nairobi", curriculum: "CBC Junior Secondary v1.1", dates: "Jan 15, 2024 - Dec 20, 2024", status: "Active", supplements: 2, action: "Manage" },
    { school: "Starlight International", location: "Mombasa", curriculum: "British Lower Secondary v2.0", dates: "Nov 1, 2023 - Oct 31, 2024", status: "Active", supplements: 1, action: "Manage" },
    { school: "Riverside School", location: "Kisumu", curriculum: "CBC Junior Secondary v1.1", dates: "Jan 10, 2024 - Dec 15, 2024", status: "Draft", supplements: 0, action: "Continue" },
    { school: "Bright Future Academy", location: "Eldoret", curriculum: "IGCSE 9-1 v1.0", dates: "Feb 1, 2024 - Jan 31, 2025", status: "Pending", supplements: 1, action: "Review" },
  ];

  assignments.slice(0, 2).forEach((assignment, index) => {
    const school = schools.find((item) => item.id === assignment.schoolId);
    const curriculum = curriculums.find((item) => item.id === assignment.curriculumId);
    if (school && curriculum) {
      rows[index] = {
        school: school.name,
        location: school.location,
        curriculum: `${curriculum.name} v${curriculum.version}`,
        dates: `${assignment.assignedDate} - ${assignment.effectiveDate}`,
        status: assignment.status,
        supplements: index + 1,
        action: "Manage",
      };
    }
  });

  return (
    <section className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent School Deployments</h2>
        <Link to="/assignments" className="text-sm font-semibold text-blue-600">
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">School</th>
              <th className="px-5 py-3">Curriculum Version</th>
              <th className="px-5 py-3">Effective Dates</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Supplements</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.school}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{row.school}</p>
                      <p className="text-xs text-slate-500">{row.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-700">{row.curriculum}</td>
                <td className="px-5 py-4 text-slate-700">{row.dates}</td>
                <td className="px-5 py-4">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-5 py-4 text-slate-700">{row.supplements}</td>
                <td className="px-5 py-4 text-right">
                  <button className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">{row.action}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = status === "Active" ? "bg-emerald-500" : status === "Draft" ? "bg-blue-500" : "bg-amber-500";
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-700">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {status}
    </span>
  );
}

function DeploymentOverview({ activeCount }: { activeCount: number }) {
  return (
    <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Deployment Overview</h2>
        <Link to="/assignments" className="text-sm font-semibold text-blue-600">
          View all →
        </Link>
      </div>
      <div className="flex items-center justify-center gap-8">
        <div
          className="grid h-40 w-40 place-items-center rounded-full"
          style={{ background: "conic-gradient(#22C55E 0 38%, #FBBF24 38% 50%, #2563EB 50% 88%, #A855F7 88% 100%)" }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
            <div>
              <p className="text-3xl font-semibold text-slate-900">248</p>
              <p className="text-sm text-slate-500">Schools</p>
            </div>
          </div>
        </div>
        <div className="min-w-[150px] space-y-3">
          {[
            ["Active", activeCount, "bg-emerald-500"],
            ["Draft", 32, "bg-blue-500"],
            ["Pending", 18, "bg-amber-500"],
            ["Archived", 12, "bg-purple-500"],
          ].map(([label, value, color]) => (
            <div key={label as string} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                {label}
              </span>
              <span className="font-medium text-slate-700">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4 rounded-lg bg-emerald-50 p-4">
        <ShieldCheck className="h-8 w-8 text-emerald-600" />
        <div>
          <p className="font-semibold text-slate-900">All active schools are up to date</p>
          <p className="text-sm text-slate-500">Great job! No expired deployments.</p>
        </div>
      </div>
    </section>
  );
}

function PendingApprovals() {
  const approvals = [
    { title: "Supplement Request", school: "Greenfield Academy", detail: "Robotics Enrichment Term 2", tag: "Additive", color: "teal" },
    { title: "Override Request", school: "Riverside School", detail: "Compressed Term 2 Schedule", tag: "Pacing", color: "amber" },
    { title: "Supplement Request", school: "Starlight International", detail: "Replace Art with Digital Design", tag: "Substitutive", color: "purple" },
  ];

  return (
    <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Pending Approvals</h2>
        <button className="text-sm font-semibold text-blue-600">View all →</button>
      </div>
      <div className="space-y-3">
        {approvals.map((item) => (
          <Link key={`${item.title}-${item.school}`} to="/deployments/supplementary-course" className="flex w-full items-center gap-4 rounded-lg border border-slate-100 bg-white p-4 text-left hover:bg-slate-50">
            <div
              className={`grid h-12 w-12 place-items-center rounded-lg ${
                item.color === "teal" ? "bg-teal-50 text-teal-600" : item.color === "amber" ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"
              }`}
            >
              <Puzzle className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">{item.tag}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.school}</p>
              <p className="truncate text-sm text-slate-500">{item.detail}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function LearnerJourney({ curriculum }: { curriculum?: Curriculum }) {
  const items = [
    { title: "Base Curriculum", detail: `${curriculum?.name || "CBC Junior Secondary"} v${curriculum?.version || "1.1"}`, meta: "3 Terms • 8 Courses", icon: BookOpen },
    { title: "Supplements", detail: "2 Active Supplements", meta: "Added to this school", icon: Puzzle },
    { title: "Active Learners", detail: "1,245 Learners", meta: "In 45 Classes", icon: Users },
    { title: "Progress", detail: "72% Avg. Completion", meta: "On track", icon: LineChart },
    { title: "Outcomes", detail: "85% Mastery Rate", meta: "This Term", icon: Trophy },
  ];

  return (
    <section className="mt-6 rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Learner Journey at a Glance</h2>
        <button className="text-sm font-semibold text-blue-600">View analytics →</button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
        {items.map((item, index) => (
          <FragmentJourney key={item.title} item={item} showArrow={index < items.length - 1} />
        ))}
      </div>
    </section>
  );
}

function FragmentJourney({
  item,
  showArrow,
}: {
  item: { title: string; detail: string; meta: string; icon: typeof BookOpen };
  showArrow: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-blue-600">
          <item.icon className="h-7 w-7" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{item.title}</p>
          <p className="text-sm text-slate-600">{item.detail}</p>
          <p className="text-xs text-slate-500">{item.meta}</p>
        </div>
      </div>
      {showArrow && <div className="hidden items-center justify-center text-2xl font-semibold text-slate-500 xl:flex">→</div>}
    </>
  );
}

function EmptyCard() {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
      <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-400" />
      <h2 className="text-lg font-semibold text-slate-900">No curriculums yet</h2>
      <p className="mt-2 text-sm text-slate-500">Create your first curriculum to populate this management dashboard.</p>
      <Link to="/curriculums/create" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white">
        <Plus className="h-4 w-4" />
        New Curriculum
      </Link>
    </section>
  );
}
