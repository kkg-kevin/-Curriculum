import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { DatePicker } from "../components/DatePicker";
import { getCurriculums, saveCurriculum } from "../lib/curriculumStorage";
import { getAssignmentsForCurriculum, getSchools, saveAssignment } from "../lib/schoolStorage";

function parseStoredDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatStoredDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseStoredDate(value));
}

export function AssignCurriculumPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState(id || "");
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [curriculums, setCurriculums] = useState(() => getCurriculums());
  const [schools] = useState(() => getSchools());
  const [assignmentHistory, setAssignmentHistory] = useState(() => getAssignmentsForCurriculum(id));

  const curriculum = curriculums.find((item) => item.id === selectedCurriculum);
  const selectedSchools = schools.filter((item) => selectedSchoolIds.includes(item.id));
  const fromAssignments = location.pathname.startsWith("/assignments");
  const backTarget = fromAssignments ? "/assignments" : id ? `/curriculums/${id}` : "/curriculums";

  const activeAssignments = assignmentHistory.filter((assignment) => assignment.status === "Active");
  const selectedAlreadyAssigned = activeAssignments.filter((assignment) =>
    selectedSchoolIds.includes(assignment.schoolId)
  );

  const filteredSchools = useMemo(() => {
    const query = schoolSearch.trim().toLowerCase();

    return schools.filter((item) => {
      if (!query) {
        return true;
      }

      return [item.name, item.location, item.level, item.principal].join(" ").toLowerCase().includes(query);
    });
  }, [schoolSearch, schools]);

  const handleCurriculumChange = (value: string) => {
    setSelectedCurriculum(value);
    setSelectedSchoolIds([]);
    setAssignmentHistory(getAssignmentsForCurriculum(value));
  };

  const toggleSchoolSelection = (schoolId: string) => {
    setSelectedSchoolIds((items) =>
      items.includes(schoolId) ? items.filter((item) => item !== schoolId) : [...items, schoolId]
    );
  };

  const handleAssign = () => {
    if (!curriculum || selectedSchools.length === 0 || !effectiveDate) {
      return;
    }

    const activeSchoolIds = new Set(activeAssignments.map((assignment) => assignment.schoolId));
    const newAssignmentCount = selectedSchools.filter((item) => !activeSchoolIds.has(item.id)).length;
    const assignedDate = new Date().toISOString().split("T")[0];
    const storedEffectiveDate = formatStoredDate(effectiveDate);

    selectedSchools.forEach((item, index) => {
      saveAssignment({
        id: `assignment-${Date.now()}-${index}`,
        schoolId: item.id,
        curriculumId: curriculum.id,
        curriculumName: curriculum.name,
        curriculumCode: curriculum.code,
        assignedDate,
        effectiveDate: storedEffectiveDate,
        notes: notes.trim() || undefined,
        status: "Active",
      });
    });

    if (newAssignmentCount > 0) {
      const updatedCurriculum = {
        ...curriculum,
        schools: curriculum.schools + newAssignmentCount,
      };

      saveCurriculum(updatedCurriculum);
      setCurriculums((items) => items.map((item) => (item.id === updatedCurriculum.id ? updatedCurriculum : item)));
    }

    setAssignmentHistory(getAssignmentsForCurriculum(curriculum.id));
    navigate(fromAssignments ? "/assignments" : `/curriculums/${curriculum.id}`);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="px-8 py-6">
          <Link
            to={backTarget}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {fromAssignments ? "Assignments" : "Back to Curriculum"}
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Assign Curriculum to Schools</h1>
              <p className="mt-1 text-sm text-slate-600">
                Choose a curriculum, select one or more schools, and set when it should become active.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(backTarget)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={selectedSchoolIds.length === 0 || !selectedCurriculum || !effectiveDate}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                Assign {selectedSchoolIds.length > 1 ? `${selectedSchoolIds.length} Schools` : ""}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-8 xl:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-950">Curriculum</h2>
                <p className="mt-1 text-sm text-slate-500">The selected template will be deployed to each selected school.</p>
              </div>
              {curriculum && (
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    curriculum.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {curriculum.status}
                </span>
              )}
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-700">Select Curriculum</label>
            <select
              value={selectedCurriculum}
              onChange={(event) => handleCurriculumChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a curriculum...</option>
              {curriculums.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>

            {curriculum && (
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Code</p>
                  <p className="mt-1 font-mono text-sm text-slate-900">{curriculum.code}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Version</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{curriculum.version}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Schools</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{curriculum.schools} assigned</p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Select Schools</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search by name, location, level, or principal. Select multiple schools before assigning.
                </p>
              </div>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={schoolSearch}
                  onChange={(event) => setSchoolSearch(event.target.value)}
                  placeholder="Search schools..."
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {filteredSchools.map((item) => {
                const isSelected = selectedSchoolIds.includes(item.id);
                const isAssigned = activeAssignments.some((assignment) => assignment.schoolId === item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSchoolSelection(item.id)}
                    className={`rounded-lg border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-[#1B50B8] bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                          isSelected ? "bg-[#1B50B8] text-white" : "bg-blue-50 text-[#1B50B8]"
                        }`}
                      >
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-950">{item.name}</p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                              <MapPin className="h-3.5 w-3.5" />
                              {item.location}
                            </p>
                          </div>
                          {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1B50B8]" />}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                          <span className="rounded-md bg-white px-2 py-1">{item.level}</span>
                          <span className="rounded-md bg-white px-2 py-1">{item.students} students</span>
                          {isAssigned && <span className="rounded-md bg-green-100 px-2 py-1 text-green-700">Assigned</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredSchools.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                No schools match your search.
              </div>
            )}
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-950">Assignment Details</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Effective Date</label>
                <DatePicker
                  value={effectiveDate}
                  onChange={setEffectiveDate}
                  placeholder="Select effective date"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional deployment notes..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Ready to assign</p>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <BookOpen className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>{curriculum?.name || "Choose a curriculum"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>
                    {selectedSchools.length > 0
                      ? `${selectedSchools.length} school${selectedSchools.length === 1 ? "" : "s"} selected`
                      : "Choose one or more schools"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>
                    {effectiveDate ? `Effective ${formatDisplayDate(formatStoredDate(effectiveDate))}` : "Choose an effective date"}
                  </span>
                </div>
              </div>
            </div>

            {selectedSchools.length > 0 && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-medium text-slate-700">Selected schools</p>
                <div className="space-y-2">
                  {selectedSchools.map((item) => {
                    const isAssigned = activeAssignments.some((assignment) => assignment.schoolId === item.id);

                    return (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate text-slate-600">{item.name}</span>
                        {isAssigned && (
                          <span className="shrink-0 rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Update
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedAlreadyAssigned.length > 0 && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {selectedAlreadyAssigned.length} selected school{selectedAlreadyAssigned.length === 1 ? "" : "s"} already
                {selectedAlreadyAssigned.length === 1 ? " has" : " have"} this curriculum. Assigning again will update
                {selectedAlreadyAssigned.length === 1 ? " that record" : " those records"}.
              </div>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-950">Assignment History</h2>
                <p className="mt-1 text-sm text-slate-500">{activeAssignments.length} active assignment{activeAssignments.length === 1 ? "" : "s"}</p>
              </div>
              <Users className="h-5 w-5 text-slate-400" />
            </div>

            <div className="space-y-3">
              {assignmentHistory.map((assignment) => {
                const assignedSchool = schools.find((item) => item.id === assignment.schoolId);

                return (
                  <div key={assignment.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{assignedSchool?.name || "Unknown school"}</p>
                        <p className="mt-1 text-sm text-slate-500">{assignedSchool?.location || "Location unavailable"}</p>
                      </div>
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          assignment.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <p>Assigned {formatDisplayDate(assignment.assignedDate)}</p>
                      <p>Effective {formatDisplayDate(assignment.effectiveDate)}</p>
                    </div>
                    {assignment.notes && <p className="mt-3 text-sm text-slate-600">{assignment.notes}</p>}
                  </div>
                );
              })}
            </div>

            {assignmentHistory.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No assignment history yet.
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
