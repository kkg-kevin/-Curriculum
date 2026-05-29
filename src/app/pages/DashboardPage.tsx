import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Archive,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Plus,
} from "lucide-react";
import { getCurriculums, type Curriculum } from "../lib/curriculumStorage";

function countCurriculumCourses(curriculum: Curriculum) {
  return curriculum.structure.reduce(
    (total, term) => total + term.classes.reduce((classTotal, cls) => classTotal + cls.courses.length, 0),
    0
  );
}

function countCurriculumClasses(curriculum: Curriculum) {
  return curriculum.structure.reduce((total, term) => total + term.classes.length, 0);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function DashboardPage() {
  const [curriculums] = useState(() => getCurriculums());

  const dashboard = useMemo(() => {
    const active = curriculums.filter((curriculum) => curriculum.status === "Active").length;
    const archived = curriculums.filter((curriculum) => curriculum.status === "Archived").length;
    const terms = curriculums.reduce((total, curriculum) => total + curriculum.structure.length, 0);
    const classes = curriculums.reduce((total, curriculum) => total + countCurriculumClasses(curriculum), 0);
    const courses = curriculums.reduce((total, curriculum) => total + countCurriculumCourses(curriculum), 0);
    const complete = curriculums.filter((curriculum) => countCurriculumCourses(curriculum) > 0).length;
    const empty = curriculums.length - complete;
    const recent = [...curriculums]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      active,
      archived,
      terms,
      classes,
      courses,
      complete,
      empty,
      recent,
    };
  }, [curriculums]);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Curriculum Dashboard</h1>
              <p className="mt-1 text-sm text-slate-600">
                Overview of curriculum templates, structure, and course coverage.
              </p>
            </div>
            <Link
              to="/curriculums/create"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1B50B8] px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#2563EB]"
            >
              <Plus className="h-4 w-4" />
              Create Curriculum
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Curriculums", value: curriculums.length, icon: BookOpen, tone: "blue" },
            { label: "Active", value: dashboard.active, icon: CheckCircle2, tone: "green" },
            { label: "Archived", value: dashboard.archived, icon: Archive, tone: "amber" },
            { label: "Courses", value: dashboard.courses, icon: GraduationCap, tone: "slate" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-950">{stat.value}</p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                    stat.tone === "green"
                      ? "bg-green-50 text-green-700"
                      : stat.tone === "amber"
                        ? "bg-amber-50 text-amber-700"
                        : stat.tone === "slate"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-blue-50 text-[#1B50B8]"
                  }`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <main className="space-y-6">
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-950">Recent Curriculums</h2>
                  <p className="mt-1 text-sm text-slate-500">Latest templates created in the curriculum library.</p>
                </div>
                <Link to="/curriculums" className="text-sm font-medium text-[#1B50B8] hover:text-[#2563EB]">
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {dashboard.recent.map((curriculum) => (
                  <Link
                    key={curriculum.id}
                    to={`/curriculums/${curriculum.id}`}
                    className="block rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-950">{curriculum.name}</p>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                            {curriculum.code}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{curriculum.description}</p>
                      </div>
                      <span
                        className={`w-fit rounded-md px-2.5 py-1 text-xs font-medium ${
                          curriculum.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {curriculum.status}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-md bg-white px-2.5 py-1">
                        {curriculum.structure.length} terms
                      </span>
                      <span className="rounded-md bg-white px-2.5 py-1">
                        {countCurriculumClasses(curriculum)} classes
                      </span>
                      <span className="rounded-md bg-white px-2.5 py-1">
                        {countCurriculumCourses(curriculum)} courses
                      </span>
                      <span className="rounded-md bg-white px-2.5 py-1">
                        Created {formatDate(curriculum.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#1B50B8]">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">Structure Summary</h2>
                  <p className="text-sm text-slate-500">Across all curriculums.</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">Terms</span>
                  <span className="font-semibold text-slate-950">{dashboard.terms}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">Classes</span>
                  <span className="font-semibold text-slate-950">{dashboard.classes}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">With courses</span>
                  <span className="font-semibold text-slate-950">{dashboard.complete}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <span className="text-slate-600">Need structure</span>
                  <span className="font-semibold text-slate-950">{dashboard.empty}</span>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-400" />
                <h2 className="font-semibold text-slate-950">Curriculum Actions</h2>
              </div>
              <div className="space-y-3">
                <Link
                  to="/curriculums"
                  className="block rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Manage curriculum library
                </Link>
                <Link
                  to="/curriculums/create"
                  className="block rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Add curriculum template
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
