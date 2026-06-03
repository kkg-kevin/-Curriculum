import { Link } from "react-router";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Eye,
  FilePenLine,
  Filter,
  GraduationCap,
  History,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { getCurriculums, type Curriculum } from "../lib/curriculumStorage";

const versions = [
  {
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
    version: "v1.0",
    status: "Published",
    type: "Major",
    date: "01 Sep 2023",
    author: "Super Admin",
    description: "Initial release of the curriculum.",
    deployedTo: "220 schools",
  },
  {
    version: "v0.3",
    status: "Draft",
    type: "Minor",
    date: "15 Aug 2023",
    author: "Curriculum Admin",
    description: "Added Social Studies and resources.",
    deployedTo: "-",
  },
  {
    version: "v0.2",
    status: "Draft",
    type: "Minor",
    date: "02 Aug 2023",
    author: "Curriculum Admin",
    description: "Updated Grade 9 course structure.",
    deployedTo: "-",
  },
  {
    version: "v0.1",
    status: "Draft",
    type: "Major",
    date: "20 Jul 2023",
    author: "Curriculum Admin",
    description: "First draft of curriculum.",
    deployedTo: "-",
  },
];

function countClasses(curriculum: Curriculum) {
  return curriculum.structure.reduce((total, term) => total + term.classes.length, 0);
}

function countCourses(curriculum: Curriculum) {
  return curriculum.structure.reduce(
    (total, term) => total + term.classes.reduce((sum, cls) => sum + cls.courses.length, 0),
    0
  );
}

export function VersionControlPage() {
  const curriculum = getCurriculums()[0];
  const courses = curriculum ? Math.max(countCourses(curriculum), 32) : 32;
  const classes = curriculum ? Math.max(countClasses(curriculum), 9) : 9;

  return (
    <div className="min-h-full bg-[#F7F9FC]">
      <div className="mx-auto max-w-[1540px] px-6 py-5 lg:px-8">
        <header className="mb-6">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm">
                <Link to="/curriculums" className="font-medium text-blue-600">Curriculum</Link>
                <ChevronDown className="-rotate-90 h-4 w-4 text-slate-400" />
                <Link to="/settings" className="font-medium text-blue-600">Settings</Link>
                <ChevronDown className="-rotate-90 h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-700">Version Control</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-[0px] text-slate-900">Version Control</h1>
              <p className="mt-3 text-base text-slate-600">
                Manage curriculum versions, track changes, and publish updates with confidence.
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
            <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 text-sm font-semibold text-blue-700 shadow-sm hover:bg-slate-50">
              <RefreshCw className="h-4 w-4" />
              Version History
            </button>
            <Link
              to={curriculum ? `/curriculums/${curriculum.id}/edit` : "/curriculums/create"}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create New Version
            </Link>
          </div>
        </header>

        <section className="mb-5 rounded-lg border border-slate-200 bg-blue-50/40 p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-blue-900 text-white">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">{curriculum?.name || "CBC Junior Secondary"}</h2>
                  <span className="rounded-md bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Published v1.1</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {curriculum?.framework || "Competency-Based Curriculum (CBC)"} <span className="mx-2">•</span> 3 Terms <span className="mx-2">•</span> Grades 7 - 9
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[560px]">
              <HeaderStat icon={FilePenLine} value="3" label="Major Versions" />
              <HeaderStat icon={GraduationCap} value="5" label="Minor Versions" />
              <HeaderStat icon={CalendarDays} value="12 Jan 2024" label="Last Published" />
            </div>
          </div>
        </section>

        <nav className="mb-5 flex overflow-x-auto rounded-lg border border-slate-200 bg-white">
          {[
            { label: "Version Overview", icon: ShieldCheck, active: true },
            { label: "Change History", icon: History },
            { label: "Compare Versions", icon: Workflow },
            { label: "Drafts", icon: FilePenLine },
            { label: "Publishing Rules", icon: ClipboardCheck },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`inline-flex h-14 min-w-max items-center gap-2 border-b-2 px-8 text-sm font-semibold ${
                tab.active ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mb-5 grid gap-5 xl:grid-cols-[0.84fr_1.08fr]">
          <TimelineCard />
          <CurrentVersionCard courses={courses} classes={classes} />
        </div>

        <AllVersionsTable />
      </div>
    </div>
  );
}

function HeaderStat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 border-slate-200 xl:border-l xl:pl-6">
      <div className="grid h-12 w-12 place-items-center rounded-lg border border-slate-200 bg-white text-blue-600">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function TimelineCard() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
          Version Timeline
          <CircleHelp className="h-4 w-4 text-blue-600" />
        </h2>
        <p className="mt-1 text-sm text-slate-500">Track the evolution of your curriculum over time.</p>
      </div>
      <div className="px-5 py-4">
        <div className="relative space-y-0 pl-10 before:absolute before:bottom-10 before:left-[13px] before:top-4 before:w-px before:bg-slate-200">
          {versions.map((item, index) => (
            <div key={item.version} className="relative border-b border-slate-100 pb-5 pt-1 last:border-b-0">
              <span
                className={`absolute -left-[34px] top-2 h-4 w-4 rounded-full border-2 border-white ${
                  item.current ? "bg-emerald-500" : index === 1 ? "bg-blue-600" : "bg-slate-400"
                }`}
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-slate-900">{item.version}</p>
                    {item.current && <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">CURRENT</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.status === "Published" ? `Published on ${item.date}` : `Draft • ${item.date}`} <span className="mx-1">•</span> {item.author}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-5 text-slate-600">{item.description}</p>
                  <button className="mt-2 text-sm font-semibold text-blue-600">View details →</button>
                </div>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CurrentVersionCard({ courses, classes }: { courses: number; classes: number }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Current Version: v1.1 (Published)</h2>
            <p className="mt-2 text-sm text-slate-600">This is the active version deployed to 248 schools.</p>
          </div>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={BookOpen} value={courses} label="Courses" />
        <Metric icon={GraduationCap} value={classes} label="Classes" />
        <Metric icon={ClipboardCheck} value={120} label="Assessments" />
        <Metric icon={Target} value={86} label="Outcomes" />
      </div>

      <div className="rounded-lg border border-slate-200 p-5">
        <h3 className="mb-4 font-semibold text-slate-900">What's new in v1.1?</h3>
        <div className="space-y-3">
          {[
            "Added Digital Literacy to Grade 8, Term 2",
            "Updated Mathematics learning outcomes for better alignment",
            "Improved assessment rubrics and added teacher guidance notes",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg bg-blue-50/60 px-4 py-4 text-sm text-slate-700">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function AllVersionsTable() {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All Versions</h2>
          <p className="mt-1 text-sm text-slate-500">View, manage, and control all curriculum versions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative h-10 w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="h-full w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:ring-4 focus:ring-blue-100" placeholder="Search versions..." />
          </div>
          <FilterSelect label="All Authors" />
          <FilterSelect label="All Authors" />
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Version</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Published On</th>
              <th className="px-5 py-3">Published By</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Deployed To</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {versions.map((item) => (
              <tr key={item.version}>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    {item.version}
                    {item.current && <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Current</span>}
                  </div>
                </td>
                <td className="px-5 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-5 py-3">
                  <span className={item.type === "Major" ? "rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700" : "text-slate-700"}>{item.type}</span>
                </td>
                <td className="px-5 py-3 text-slate-700">{item.date}</td>
                <td className="px-5 py-3 text-slate-700">{item.author}</td>
                <td className="px-5 py-3 text-slate-700">{item.description}</td>
                <td className="px-5 py-3 text-slate-700">{item.deployedTo}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                      {item.status === "Draft" ? <FilePenLine className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {item.status === "Draft" ? "Continue" : "View"}
                    </button>
                    <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
        <span>Showing 1 to 5 of 5 versions</span>
        <div className="flex items-center gap-3">
          <ChevronDown className="h-4 w-4 rotate-90" />
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-blue-500 font-semibold text-blue-600">1</span>
          <ChevronDown className="h-4 w-4 -rotate-90" />
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "Published";
  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${isPublished ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button className="inline-flex h-10 min-w-36 items-center justify-between rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700">
      {label}
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}
