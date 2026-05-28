import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Check, Building2, Calendar } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { getCurriculums, saveCurriculum } from "../lib/curriculumStorage";
import { getAssignmentsForCurriculum, getSchools, saveAssignment } from "../lib/schoolStorage";

export function AssignCurriculumPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState(id || "");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [curriculums] = useState(() => getCurriculums());
  const [schools] = useState(() => getSchools());
  const [assignmentHistory, setAssignmentHistory] = useState(() => getAssignmentsForCurriculum(id));

  const handleAssign = () => {
    const curriculum = curriculums.find((item) => item.id === selectedCurriculum);
    const school = schools.find((item) => item.id === selectedSchool);

    if (!curriculum || !school) {
      return;
    }

    const previousAssignments = getAssignmentsForCurriculum(selectedCurriculum);
    const wasAlreadyAssigned = previousAssignments.some(
      (assignment) => assignment.schoolId === selectedSchool && assignment.status === "Active"
    );

    saveAssignment({
      id: `assignment-${Date.now()}`,
      schoolId: school.id,
      curriculumId: curriculum.id,
      curriculumName: curriculum.name,
      curriculumCode: curriculum.code,
      assignedDate: new Date().toISOString().split("T")[0],
      effectiveDate,
      notes: notes.trim() || undefined,
      status: "Active",
    });

    if (!wasAlreadyAssigned) {
      saveCurriculum({
        ...curriculum,
        schools: curriculum.schools + 1,
      });
    }

    setAssignmentHistory(getAssignmentsForCurriculum(selectedCurriculum));
    navigate(`/curriculums/${selectedCurriculum}/edit`);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate(id ? `/curriculums/${id}/edit` : "/curriculums")}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Curriculum
          </button>

          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Assign Curriculum to School</h1>
          <p className="text-sm text-slate-600">Deploy a curriculum template to a school</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Assignment Details</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Curriculum</label>
              <select
                value={selectedCurriculum}
                onChange={(e) => {
                  setSelectedCurriculum(e.target.value);
                  setAssignmentHistory(getAssignmentsForCurriculum(e.target.value));
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Choose a curriculum...</option>
                {curriculums.map((curriculum) => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.name} ({curriculum.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select School</label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Choose a school...</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name} - {school.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Effective Date</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(event) => setEffectiveDate(event.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add any notes about this assignment..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => navigate(id ? `/curriculums/${id}/edit` : "/curriculums")}
              className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedSchool || !selectedCurriculum}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              Assign Curriculum
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Assignment History</h2>
          <p className="text-sm text-slate-600 mb-6">Recent curriculum assignments for this template</p>

          <div className="space-y-3">
            {assignmentHistory.map((assignment) => {
              const school = schools.find((item) => item.id === assignment.schoolId);

              return (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{school?.name || "Unknown school"}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Assigned {assignment.assignedDate}
                    </div>
                  </div>
                </div>
                <span className={`
                  px-3 py-1 rounded-lg text-xs font-medium
                  ${assignment.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                  }
                `}>
                  {assignment.status}
                </span>
              </div>
              );
            })}
          </div>

          {assignmentHistory.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>No assignment history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
