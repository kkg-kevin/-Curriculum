import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit,
  GraduationCap,
  Layers3,
  School,
  Users,
} from "lucide-react";
import { getCurriculumById, type CurriculumTerm } from "../lib/curriculumStorage";

function formatDateRange(startDate?: string, endDate?: string) {
  const format = (value: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));

  if (startDate && endDate) {
    return `${format(startDate)} - ${format(endDate)}`;
  }

  if (startDate) {
    return `Starts ${format(startDate)}`;
  }

  if (endDate) {
    return `Ends ${format(endDate)}`;
  }

  return "Dates not set";
}

function countCourses(term: CurriculumTerm) {
  return term.classes.reduce((total, cls) => total + cls.courses.length, 0);
}

export function CurriculumDetailPage() {
  const { id } = useParams();
  const curriculum = getCurriculumById(id);
  const [selectedTermId, setSelectedTermId] = useState<string | undefined>(
    () => curriculum?.structure[0]?.id
  );
  const totals = useMemo(() => {
    if (!curriculum) {
      return {
        terms: 0,
        classes: 0,
        courses: 0,
      };
    }

    const classes = curriculum.structure.reduce((total, term) => total + term.classes.length, 0);
    const courses = curriculum.structure.reduce((total, term) => total + countCourses(term), 0);

    return {
      terms: curriculum.structure.length,
      classes,
      courses,
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
            className="inline-flex items-center gap-2 rounded-lg bg-[#1B50B8] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2563EB]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Curriculums
          </Link>
        </div>
      </div>
    );
  }

  const selectedTerm = curriculum.structure.find((term) => term.id === selectedTermId) ?? curriculum.structure[0];

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="px-8 py-6">
          <Link
            to="/curriculums"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Curriculums
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700">
                  {curriculum.code}
                </span>
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    curriculum.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {curriculum.status}
                </span>
                <span className="text-sm text-slate-500">Version {curriculum.version}</span>
              </div>
              <h1 className="text-3xl font-semibold text-slate-950">{curriculum.name}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{curriculum.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/curriculums/${curriculum.id}/assign`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Users className="h-4 w-4" />
                Assign
              </Link>
              <Link
                to={`/curriculums/${curriculum.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1B50B8] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2563EB]"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Terms", value: totals.terms, icon: Layers3 },
            { label: "Classes", value: totals.classes, icon: GraduationCap },
            { label: "Courses", value: totals.courses, icon: BookOpen },
            { label: "Schools Using", value: curriculum.schools, icon: School },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-950">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-[#1B50B8]">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {(curriculum.startDate || curriculum.endDate || curriculum.year) && (
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
            <Calendar className="h-5 w-5 text-slate-400" />
            {curriculum.year && <span className="font-medium text-slate-900">{curriculum.year}</span>}
            {(curriculum.startDate || curriculum.endDate) && (
              <span>{formatDateRange(curriculum.startDate, curriculum.endDate)}</span>
            )}
          </div>
        )}

        {curriculum.structure.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">No structure added yet</h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-slate-600">
              Add terms, classes, and courses to turn this curriculum into a visual learning plan.
            </p>
            <Link
              to={`/curriculums/${curriculum.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1B50B8] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2563EB]"
            >
              <Edit className="h-4 w-4" />
              Build Structure
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
            <aside className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-4 px-1">
                <h2 className="font-semibold text-slate-900">Curriculum Flow</h2>
                <p className="mt-1 text-sm text-slate-500">Select a term to inspect its classes and subjects.</p>
              </div>

              <div className="space-y-3">
                {curriculum.structure.map((term, index) => {
                  const isSelected = term.id === selectedTerm?.id;

                  return (
                    <button
                      key={term.id}
                      onClick={() => setSelectedTermId(term.id)}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        isSelected
                          ? "border-[#1B50B8] bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            isSelected ? "bg-[#1B50B8] text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900">{term.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatDateRange(term.startDate, term.endDate)}</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-md bg-white px-2 py-1 text-slate-600">
                              {term.classes.length} classes
                            </span>
                            <span className="rounded-md bg-white px-2 py-1 text-slate-600">
                              {countCourses(term)} courses
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <main className="rounded-lg border border-slate-200 bg-white p-6">
              {selectedTerm && (
                <>
                  <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{selectedTerm.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{formatDateRange(selectedTerm.startDate, selectedTerm.endDate)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="rounded-md bg-slate-100 px-3 py-1.5 text-slate-700">
                        {selectedTerm.classes.length} classes
                      </span>
                      <span className="rounded-md bg-slate-100 px-3 py-1.5 text-slate-700">
                        {countCourses(selectedTerm)} courses
                      </span>
                    </div>
                  </div>

                  {selectedTerm.classes.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                      <p className="font-medium text-slate-700">No classes in this term yet</p>
                      <p className="mt-1 text-sm text-slate-500">Edit the curriculum to add classes and courses.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {selectedTerm.classes.map((cls) => (
                        <section key={cls.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-slate-950">{cls.name}</h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {cls.courses.length} course{cls.courses.length === 1 ? "" : "s"}
                              </p>
                            </div>
                            <GraduationCap className="h-5 w-5 text-slate-400" />
                          </div>

                          {cls.courses.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                              No courses added
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {cls.courses.map((course) => (
                                <div key={course.id} className="rounded-lg border border-slate-200 bg-white p-4">
                                  <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-slate-900">{course.name}</p>
                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                                          {course.code}
                                        </span>
                                      </div>
                                      {course.description && (
                                        <p className="mt-2 text-sm leading-5 text-slate-600">{course.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      ))}
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
