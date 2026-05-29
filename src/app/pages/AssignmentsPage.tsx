import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Eye,
  Link2,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { getCurriculumById, saveCurriculum } from "../lib/curriculumStorage";
import {
  getAssignments,
  getSchools,
  updateAssignmentStatus,
  type SchoolAssignment,
} from "../lib/schoolStorage";

type StatusFilter = "All" | SchoolAssignment["status"];

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseDate(value));
}

function adjustCurriculumSchoolCount(curriculumId: string, delta: number) {
  const curriculum = getCurriculumById(curriculumId);
  if (!curriculum) {
    return;
  }

  saveCurriculum({
    ...curriculum,
    schools: Math.max(0, curriculum.schools + delta),
  });
}

export function AssignmentsPage() {
  const [assignments, setAssignments] = useState(() => getAssignments());
  const [schools] = useState(() => getSchools());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [schoolFilter, setSchoolFilter] = useState("All");
  const [curriculumFilter, setCurriculumFilter] = useState("All");

  const enrichedAssignments = useMemo(
    () =>
      assignments.map((assignment) => ({
        ...assignment,
        school: schools.find((school) => school.id === assignment.schoolId),
      })),
    [assignments, schools]
  );

  const curriculumOptions = useMemo(
    () =>
      Array.from(
        new Map(
          assignments.map((assignment) => [
            assignment.curriculumId,
            {
              id: assignment.curriculumId,
              name: assignment.curriculumName,
            },
          ])
        ).values()
      ),
    [assignments]
  );

  const filteredAssignments = useMemo(() => {
    const search = query.trim().toLowerCase();

    return enrichedAssignments.filter((assignment) => {
      const matchesStatus = statusFilter === "All" || assignment.status === statusFilter;
      const matchesSchool = schoolFilter === "All" || assignment.schoolId === schoolFilter;
      const matchesCurriculum = curriculumFilter === "All" || assignment.curriculumId === curriculumFilter;
      const matchesSearch =
        !search ||
        [
          assignment.curriculumName,
          assignment.curriculumCode,
          assignment.school?.name,
          assignment.school?.location,
          assignment.notes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search);

      return matchesStatus && matchesSchool && matchesCurriculum && matchesSearch;
    });
  }, [curriculumFilter, enrichedAssignments, query, schoolFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = assignments.filter((assignment) => assignment.status === "Active").length;
    const inactive = assignments.filter((assignment) => assignment.status === "Inactive").length;
    const assignedSchoolIds = new Set(
      assignments
        .filter((assignment) => assignment.status === "Active")
        .map((assignment) => assignment.schoolId)
    );

    return {
      total: assignments.length,
      active,
      inactive,
      schoolsWithoutCurriculum: schools.filter((school) => !assignedSchoolIds.has(school.id)).length,
    };
  }, [assignments, schools]);

  const handleStatusChange = (assignment: SchoolAssignment, status: SchoolAssignment["status"]) => {
    if (assignment.status === status) {
      return;
    }

    const nextAssignments = updateAssignmentStatus(assignment.id, status);
    adjustCurriculumSchoolCount(assignment.curriculumId, status === "Active" ? 1 : -1);
    setAssignments(nextAssignments);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Assignments</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage curriculum deployments across schools.
              </p>
            </div>
            <Link
              to="/assignments/create"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1B50B8] px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-[#2563EB]"
            >
              <Plus className="h-4 w-4" />
              Create Assignment
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Assignments", value: stats.total, icon: Link2, tone: "blue" },
            { label: "Active", value: stats.active, icon: CheckCircle2, tone: "green" },
            { label: "Inactive", value: stats.inactive, icon: XCircle, tone: "amber" },
            { label: "Schools Without Curriculum", value: stats.schoolsWithoutCurriculum, icon: Building2, tone: "slate" },
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

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold text-slate-950">Assignment Registry</h2>
              <p className="mt-1 text-sm text-slate-500">
                Search, filter, activate, or deactivate curriculum assignments.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[280px_160px_220px_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search assignments..."
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                value={schoolFilter}
                onChange={(event) => setSchoolFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All schools</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <select
                value={curriculumFilter}
                onChange={(event) => setCurriculumFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All curriculums</option>
                {curriculumOptions.map((curriculum) => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <div className="min-w-[1080px]">
              <div className="grid grid-cols-[1.2fr_1.2fr_150px_150px_120px_170px] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>School</span>
                <span>Curriculum</span>
                <span>Assigned</span>
                <span>Effective</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="grid grid-cols-[1.2fr_1.2fr_150px_150px_120px_170px] gap-4 border-t border-slate-200 px-4 py-4 text-sm"
                >
                <div className="min-w-0">
                  <p className="font-medium text-slate-950">{assignment.school?.name || "Unknown school"}</p>
                  <p className="mt-1 text-xs text-slate-500">{assignment.school?.location || "Location unavailable"}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-950">{assignment.curriculumName}</p>
                  <p className="mt-1 font-mono text-xs text-slate-500">{assignment.curriculumCode}</p>
                  {assignment.notes && <p className="mt-2 line-clamp-2 text-xs text-slate-500">{assignment.notes}</p>}
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>{formatDate(assignment.assignedDate)}</span>
                </div>
                <div className="text-slate-600">{formatDate(assignment.effectiveDate)}</div>
                <div>
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                      assignment.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/schools/${assignment.schoolId}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
                    title="Open school"
                  >
                    <Building2 className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/curriculums/${assignment.curriculumId}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
                    title="Open curriculum"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Link>
                  {assignment.status === "Active" ? (
                    <button
                      onClick={() => handleStatusChange(assignment, "Inactive")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(assignment, "Active")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 px-2.5 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Activate
                    </button>
                  )}
                </div>
                </div>
              ))}

              {filteredAssignments.length === 0 && (
                <div className="border-t border-slate-200 p-10 text-center">
                  <Eye className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                  <p className="font-medium text-slate-700">No assignments found</p>
                  <p className="mt-1 text-sm text-slate-500">Adjust your search or create a new assignment.</p>
                </div>
              )}
              </div>
          </div>
        </section>
      </div>
    </div>
  );
}
