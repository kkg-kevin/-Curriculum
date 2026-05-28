import { useMemo, useState } from "react";
import { Building2, MapPin, Search, Users, BookOpen, UserRound } from "lucide-react";
import { getAssignments, getSchools } from "../lib/schoolStorage";

export function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [schools] = useState(() => getSchools());
  const [assignments] = useState(() => getAssignments());

  const schoolsWithAssignments = useMemo(
    () =>
      schools.map((school) => ({
        ...school,
        assignments: assignments.filter(
          (assignment) => assignment.schoolId === school.id && assignment.status === "Active"
        ),
      })),
    [assignments, schools]
  );

  const filteredSchools = schoolsWithAssignments.filter((school) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return [school.name, school.location, school.level, school.principal]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <div className="min-h-full">
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Schools</h1>
              <p className="text-sm text-slate-600 mt-1">View schools and assigned curriculum templates</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">{schools.length} sample schools</span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-semibold text-slate-900">{school.name}</h2>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                        {school.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {school.location}
                      </span>
                      <span>{school.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                    <Users className="w-4 h-4" />
                    Students
                  </div>
                  <p className="text-xl font-semibold text-slate-900">{school.students}</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                    <UserRound className="w-4 h-4" />
                    Principal
                  </div>
                  <p className="font-semibold text-slate-900 truncate">{school.principal}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <BookOpen className="w-4 h-4" />
                    Assigned Curriculums
                  </div>
                  <span className="text-sm text-slate-500">{school.assignments.length} active</span>
                </div>

                {school.assignments.length > 0 ? (
                  <div className="space-y-2">
                    {school.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{assignment.curriculumName}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{assignment.curriculumCode}</p>
                        </div>
                        <span className="text-xs text-slate-500">Effective {assignment.effectiveDate}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                    No curriculum assigned yet
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSchools.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No schools found</h3>
            <p className="text-slate-600">Try a different school name, location, level, or principal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
