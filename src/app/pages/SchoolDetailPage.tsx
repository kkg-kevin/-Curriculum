import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Layers3,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { getCurriculums, getCurriculumById, saveCurriculum, type CurriculumCourse } from "../lib/curriculumStorage";
import {
  getAssignmentsForSchool,
  getSchools,
  getStudentsForSchool,
  getSupplementaryCurriculumsForSchool,
  removeAssignmentFromSchool,
  saveSupplementaryCurriculum,
  type SupplementaryCurriculum,
} from "../lib/schoolStorage";

type SupplementaryScope = "class" | "student";
type SupplementaryType = "complementary" | "substitute";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateRange(startDate?: string, endDate?: string) {
  if (startDate && endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  if (startDate) {
    return `Starts ${formatDate(startDate)}`;
  }

  if (endDate) {
    return `Ends ${formatDate(endDate)}`;
  }

  return "Dates not set";
}

function formatSupplementaryType(type: SupplementaryType) {
  return type === "complementary" ? "Complementary" : "Substitute";
}

export function SchoolDetailPage() {
  const { id } = useParams();
  const school = getSchools().find((item) => item.id === id);
  const [assignments, setAssignments] = useState(() =>
    id ? getAssignmentsForSchool(id).filter((assignment) => assignment.status === "Active") : []
  );
  const [selectedCurriculumId, setSelectedCurriculumId] = useState(() => assignments[0]?.curriculumId || "");
  const [supplementaryCurriculums, setSupplementaryCurriculums] = useState(() =>
    id ? getSupplementaryCurriculumsForSchool(id) : []
  );
  const [students] = useState(() => (id ? getStudentsForSchool(id) : []));
  const [supplementaryType, setSupplementaryType] = useState<SupplementaryType>("substitute");
  const [scope, setScope] = useState<SupplementaryScope>("class");
  const [selectedTermId, setSelectedTermId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Array<{ id: string; name: string; code: string; description?: string }>>(() => []);
  const [supplementaryName, setSupplementaryName] = useState("");
  const [replaceCourseId, setReplaceCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  if (!id) {
    return <Navigate to="/schools" replace />;
  }

  if (!school) {
    return (
      <div className="min-h-full bg-slate-50 p-8">
        <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-8">
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">School not found</h1>
          <p className="mb-6 text-slate-600">This school may have been removed or was not saved correctly.</p>
          <Link
            to="/schools"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1B50B8] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#2563EB]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Schools
          </Link>
        </div>
      </div>
    );
  }

  const selectedAssignment =
    assignments.find((assignment) => assignment.curriculumId === selectedCurriculumId) ?? assignments[0];
  const selectedCurriculum = getCurriculumById(selectedAssignment?.curriculumId);
  const curriculumsForSelectedAssignment = supplementaryCurriculums.filter(
    (curriculum) => curriculum.baseCurriculumId === selectedAssignment?.curriculumId
  );
  const activeSupplementaryCurriculums = curriculumsForSelectedAssignment.filter(
    (curriculum) => curriculum.status === "Active"
  );
  const supplementaryCount = activeSupplementaryCurriculums.length;
  const schoolWideCurriculums = activeSupplementaryCurriculums.filter((curriculum) => curriculum.scope === "school");
  const selectedTerm = selectedCurriculum?.structure.find((term) => term.id === selectedTermId);
  const classesForSelectedTerm = selectedTerm?.classes ?? [];
  const selectedClass = classesForSelectedTerm.find((cls) => cls.id === selectedClassId);
  const studentsForSelectedClass = students.filter(
    (student) => !selectedClassId || student.classId === selectedClassId
  );

  const classOptions =
    selectedCurriculum?.structure.flatMap((term) =>
      term.classes.map((cls) => ({
        termId: term.id,
        termName: term.name,
        classId: cls.id,
        className: cls.name,
      }))
    ) ?? [];

  const termOptions = selectedCurriculum?.structure ?? [];

  const systemCourseOptions = getCurriculums().reduce<Array<CurriculumCourse & { sourceCurriculumName: string }>>(
    (courses, curriculum) => {
      curriculum.structure.forEach((term) => {
        term.classes.forEach((cls) => {
          cls.courses.forEach((course) => {
            const exists = courses.some(
              (item) =>
                item.code.toLocaleLowerCase() === course.code.toLocaleLowerCase() &&
                item.name.toLocaleLowerCase() === course.name.toLocaleLowerCase()
            );

            if (!exists) {
              courses.push({
                ...course,
                sourceCurriculumName: curriculum.name,
              });
            }
          });
        });
      });

      return courses;
    },
    []
  );

  const getTargetLabel = (curriculum: SupplementaryCurriculum) => {
    if (curriculum.scope === "school") {
      return "School-wide";
    }

    if (curriculum.scope === "student") {
      const student = students.find((item) => item.id === curriculum.studentId);
      return student ? student.name : "Specific student";
    }

    const option = classOptions.find((item) => item.classId === curriculum.classId);
    return option ? option.className : "Specific class";
  };

  const getCurriculumsForClass = (termId: string, classId: string) =>
    activeSupplementaryCurriculums.filter((curriculum) => {
      if (curriculum.termId !== "all" && curriculum.termId !== termId) {
        return false;
      }

      if (curriculum.scope === "school") {
        return true;
      }

      if (curriculum.scope === "class") {
        return curriculum.classId === classId;
      }

      const student = students.find((item) => item.id === curriculum.studentId);
      return student?.classId === classId;
    });

  const resetCourseFields = () => {
    setSelectedCourseId("");
    setCourseName("");
    setCourseCode("");
    setDescription("");
    setReplaceCourseId("");
  };

  const resetTargetFields = () => {
    setSelectedClassId("");
    setSelectedStudentId("");
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);

    const course = systemCourseOptions.find((item) => item.id === courseId);
    setCourseName(course?.name || "");
    setCourseCode(course?.code || "");
  };

  const handleAddCourseToList = () => {
    if (!selectedCourseId || !courseName.trim() || !courseCode.trim()) return;

    const next = [
      ...selectedCourses,
      { id: `supp-course-${Date.now()}`, name: courseName.trim(), code: courseCode.trim(), description: description.trim() || undefined },
    ];

    setSelectedCourses(next);
    if (!supplementaryName) {
      const prefix = supplementaryType === "complementary" ? "Complementary" : "Substitute";
      setSupplementaryName(`${prefix} - ${courseName.trim()}`);
    }

    setSelectedCourseId("");
    setCourseName("");
    setCourseCode("");
  };

  const handleRemoveSelectedCourse = (id: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== id));
  };

  const handleRemoveCurriculum = () => {
    if (!selectedAssignment) {
      return;
    }

    const nextAssignments = removeAssignmentFromSchool(school.id, selectedAssignment.curriculumId).filter(
      (assignment) => assignment.schoolId === school.id && assignment.status === "Active"
    );

    const removedCurriculum = getCurriculumById(selectedAssignment.curriculumId);
    if (removedCurriculum) {
      saveCurriculum({
        ...removedCurriculum,
        schools: Math.max(0, removedCurriculum.schools - 1),
      });
    }

    setAssignments(nextAssignments);
    const nextSelectedCurriculumId = nextAssignments[0]?.curriculumId || "";
    setSelectedCurriculumId(nextSelectedCurriculumId);
    setSelectedTermId("");
    resetTargetFields();
    resetCourseFields();
  };

  const handleAddSupplementaryCurriculum = () => {
    setSaveError(null);
    setSaveSuccess(null);

    const termId = selectedTermId;

    if (!selectedAssignment || !termId) {
      setSaveError("Select an assigned curriculum and term.");
      return;
    }

    if (scope === "class" && !selectedClassId) {
      setSaveError("Please choose a class.");
      return;
    }

    if (scope === "student" && !selectedStudentId) {
      setSaveError("Please choose a student.");
      return;
    }

    // Build the list of courses to save: use selectedCourses if provided, otherwise use current selectedCourseId
    let coursesToSave = selectedCourses;
    if (coursesToSave.length === 0 && selectedCourseId) {
      const sysCourse = systemCourseOptions.find((c) => c.id === selectedCourseId);
      if (sysCourse) {
        coursesToSave = [
          { id: `supp-course-${Date.now()}`, name: sysCourse.name, code: sysCourse.code, description: description.trim() || undefined },
        ];
      }
    }

    if (coursesToSave.length === 0) {
      setSaveError("Please select at least one course or add it to the Selected Courses list.");
      return;
    }

    // For substitute at class scope we expect the user to select which default course is being replaced
    if (supplementaryType === "substitute" && scope === "class") {
      if (coursesToSave.length !== 1) {
        setSaveError("Substitute curricula must include exactly one supplementary course.");
        return;
      }
      if (!replaceCourseId) {
        setSaveError("Choose which default class course this substitute replaces.");
        return;
      }
    }

    const prefix = supplementaryType === "complementary" ? "Complementary" : "Substitute";
    const nameToUse = supplementaryName.trim() || `${prefix} - ${coursesToSave.map((c) => c.name).join(", ")}`;

    const nextCurriculums = saveSupplementaryCurriculum({
      id: `supplementary-curriculum-${Date.now()}`,
      schoolId: school.id,
      baseCurriculumId: selectedAssignment.curriculumId,
      type: supplementaryType,
      scope,
      termId,
      classId: scope === "class" || scope === "student" ? selectedClass?.id : undefined,
      studentId: scope === "student" ? selectedStudentId : undefined,
      replacesCourseId: supplementaryType === "substitute" ? replaceCourseId || undefined : undefined,
      name: nameToUse,
      code: coursesToSave[0]?.code || "",
      description: description.trim() || undefined,
      courses: coursesToSave.map((c) => ({ id: c.id, name: c.name, code: c.code, description: c.description })),
      effectiveDate: new Date().toISOString().split("T")[0],
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    });

    setSupplementaryCurriculums(nextCurriculums.filter((curriculum) => curriculum.schoolId === school.id));
    setSelectedCourses([]);
    setSupplementaryName("");
    setSelectedCourseId("");
    setCourseName("");
    setCourseCode("");
    setDescription("");
    setReplaceCourseId("");
    setSaveSuccess("Supplementary curriculum added.");
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="px-8 py-6">
          <Link
            to="/schools"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Schools
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  {school.status}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {school.location}
                </span>
              </div>
              <h1 className="text-3xl font-semibold text-slate-950">{school.name}</h1>
              <p className="mt-2 text-sm text-slate-600">{school.level}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-medium text-slate-500">Students</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{school.students}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-medium text-slate-500">Curriculums</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{assignments.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-medium text-slate-500">Supplementary</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{supplementaryCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-8 xl:grid-cols-[1fr_380px]">
        <main className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Assigned Curriculum</h2>
                <p className="mt-1 text-sm text-slate-500">View the shared curriculum plus this school’s additions.</p>
              </div>
              {assignments.length > 0 && (
                <select
                  value={selectedAssignment?.curriculumId || ""}
                  onChange={(event) => {
                    setSelectedCurriculumId(event.target.value);
                    setSelectedTermId("");
                    resetTargetFields();
                    resetCourseFields();
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-80"
                >
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.curriculumId}>
                      {assignment.curriculumName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {!selectedAssignment || !selectedCurriculum ? (
              <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <Building2 className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <p className="font-medium text-slate-700">No active curriculum assigned</p>
                <p className="mt-1 text-sm text-slate-500">Assign a curriculum before adding supplementary curriculums.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{selectedAssignment.curriculumName}</p>
                      <p className="mt-1 font-mono text-xs text-slate-500">{selectedAssignment.curriculumCode}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="rounded-md bg-white px-2.5 py-1">
                        Effective {formatDate(selectedAssignment.effectiveDate)}
                      </span>
                      <span className="rounded-md bg-white px-2.5 py-1">
                        {selectedCurriculum.structure.length} terms
                      </span>
                      <button
                        onClick={handleRemoveCurriculum}
                        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-1 font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {schoolWideCurriculums.length > 0 && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                      <Sparkles className="h-4 w-4" />
                      School-wide supplementary curriculums
                    </div>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {schoolWideCurriculums.map((curriculum) => (
                        <div key={curriculum.id} className="rounded-lg border border-emerald-200 bg-white p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-slate-900">{curriculum.name}</p>
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-xs text-emerald-700">
                              {curriculum.code}
                            </span>
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                              {formatSupplementaryType(curriculum.type)}
                            </span>
                          </div>
                          {curriculum.description && (
                            <p className="mt-2 text-sm text-slate-600">{curriculum.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCurriculum.structure.map((term) => (
                  <section key={term.id} className="rounded-lg border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Layers3 className="h-5 w-5 text-[#1B50B8]" />
                      <h3 className="font-semibold text-slate-950">{term.name}</h3>
                      {(term.midTermStartDate || term.midTermEndDate || term.midTermDate) && (
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          Mid-term: {formatDateRange(term.midTermStartDate || term.midTermDate, term.midTermEndDate)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {term.classes.map((cls) => {
                        const classSupplementaryCurriculums = getCurriculumsForClass(term.id, cls.id);
                        return (
                          <div key={cls.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-950">{cls.name}</p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {cls.courses.length} default, {classSupplementaryCurriculums.length} supplementary
                                </p>
                              </div>
                              <GraduationCap className="h-5 w-5 text-slate-400" />
                            </div>

                            <div className="space-y-2">
                              {
                                (() => {
                                  // Separate class-level and student-level supplementary curricula
                                  const classLevelSubs = classSupplementaryCurriculums.filter((c) => c.scope === "class");
                                  const studentLevelSupps = classSupplementaryCurriculums.filter((c) => c.scope === "student");

                                  const classSubstitutes = classLevelSubs.filter((c) => c.type === "substitute");
                                  const classComplements = classLevelSubs.filter((c) => c.type === "complementary");

                                  const replacements: Record<string, any> = {};
                                  classSubstitutes.forEach((s) => {
                                    const replacedId = (s as any).replacesCourseId;
                                    if (replacedId && s.courses && s.courses[0]) {
                                      replacements[replacedId] = s.courses[0];
                                    }
                                  });

                                  // Group student-level supplements by studentId
                                  const studentGroups = new Map<string, SupplementaryCurriculum[]>();
                                  studentLevelSupps.forEach((s) => {
                                    if (!s.studentId) return;
                                    const arr = studentGroups.get(s.studentId) || [];
                                    arr.push(s);
                                    studentGroups.set(s.studentId, arr);
                                  });

                                  return (
                                    <>
                                      {cls.courses.map((course) => {
                                        const replacement = replacements[course.id];
                                        if (replacement) {
                                          return (
                                            <div key={`repl-${course.id}`} className="rounded-lg border border-emerald-200 bg-white px-3 py-2">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-emerald-600" />
                                                <p className="text-sm font-medium text-slate-900">{replacement.name}</p>
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
                                                  {replacement.code}
                                                </span>
                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                  Substitute (class)
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        }

                                        return (
                                          <div key={course.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                              <CheckCircle2 className="h-4 w-4 text-slate-400" />
                                              <p className="text-sm font-medium text-slate-800">{course.name}</p>
                                              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
                                                {course.code}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}

                                      {classComplements.map((curriculum) => (
                                        <div key={curriculum.id} className="rounded-lg border bg-white px-3 py-2 border-blue-200">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-blue-600" />
                                            <p className="text-sm font-medium text-slate-900">{curriculum.name}</p>
                                            <span className="rounded-md px-2 py-0.5 font-mono text-xs bg-blue-100 text-blue-700">{curriculum.code}</span>
                                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{getTargetLabel(curriculum)}</span>
                                          </div>
                                          {curriculum.courses.map((course) => (
                                            <p key={course.id} className="mt-1 pl-6 text-sm text-slate-700">{course.name} ({course.code})</p>
                                          ))}
                                        </div>
                                      ))}

                                      {Array.from(studentGroups.entries()).map(([studentId, currs]) => {
                                        const student = students.find((s) => s.id === studentId);
                                        return (
                                          <div key={`stu-${studentId}`} className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                                            <div className="mb-2 flex items-center justify-between">
                                              <p className="text-sm font-semibold text-slate-900">Student: {student ? student.name : studentId}</p>
                                              <p className="text-xs text-slate-500">{currs.length} supplementary</p>
                                            </div>
                                            <div className="space-y-2">
                                              {currs.map((curriculum) => (
                                                <div key={curriculum.id} className={`rounded-md border px-3 py-2 ${curriculum.type === "complementary" ? "border-blue-200" : "border-emerald-200"}`}>
                                                  <div className="flex items-center gap-2">
                                                    <Sparkles className={`h-4 w-4 ${curriculum.type === "complementary" ? "text-blue-600" : "text-emerald-600"}`} />
                                                    <p className="text-sm font-medium text-slate-900">{curriculum.name}</p>
                                                    <span className="rounded-md px-2 py-0.5 font-mono text-xs bg-slate-100 text-slate-700">{curriculum.code}</span>
                                                    <span className="ml-auto text-xs text-slate-500">{formatSupplementaryType(curriculum.type)}</span>
                                                  </div>
                                                  {curriculum.type === "substitute" && curriculum.replacesCourseId && (
                                                    <p className="mt-1 pl-6 text-sm text-slate-700">Replaces: {cls.courses.find((c) => c.id === curriculum.replacesCourseId)?.name || curriculum.replacesCourseId}</p>
                                                  )}
                                                  {curriculum.courses.map((course) => (
                                                    <p key={course.id} className="mt-1 pl-6 text-sm text-slate-700">{course.name} ({course.code})</p>
                                                  ))}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </>
                                  );
                                })()
                              }
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950">Supplementary Curriculum</h2>
                <p className="text-sm text-slate-500">Default curriculum stays unchanged.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "complementary", label: "Complementary" },
                    { value: "substitute", label: "Substitute" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSupplementaryType(option.value as SupplementaryType);
                        resetCourseFields();
                        if (option.value === "substitute") {
                          const cls = classesForSelectedTerm.find((c) => c.id === selectedClassId);
                          setReplaceCourseId(cls?.courses?.[0]?.id || "");
                        } else {
                          setReplaceCourseId("");
                        }
                      }}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        supplementaryType === option.value
                          ? "border-[#1B50B8] bg-blue-50 text-[#1B50B8]"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Apply To</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "class", label: "Class" },
                    { value: "student", label: "Student" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setScope(option.value as SupplementaryScope);
                        resetTargetFields();
                        resetCourseFields();
                      }}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        scope === option.value
                          ? "border-[#1B50B8] bg-blue-50 text-[#1B50B8]"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Curriculum Name</label>
                <input
                  type="text"
                  value={supplementaryName}
                  onChange={(e) => setSupplementaryName(e.target.value)}
                  placeholder="Name this supplementary curriculum"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Term</label>
                <select
                  value={selectedTermId}
                  onChange={(event) => {
                    setSelectedTermId(event.target.value);
                    resetTargetFields();
                    resetCourseFields();
                  }}
                  disabled={!selectedAssignment}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">Choose a term...</option>
                  {termOptions.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </div>

              {(scope === "class" || scope === "student") && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Class</label>
                  <select
                    value={selectedClassId}
                    onChange={(event) => {
                      const newClassId = event.target.value;
                      setSelectedClassId(newClassId);
                      setSelectedStudentId("");
                      resetCourseFields();
                      if (supplementaryType === "substitute") {
                        const cls = classesForSelectedTerm.find((c) => c.id === newClassId);
                        setReplaceCourseId(cls?.courses?.[0]?.id || "");
                      } else {
                        setReplaceCourseId("");
                      }
                    }}
                    disabled={!selectedTermId}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{selectedTermId ? "Choose a class..." : "Choose a term first..."}</option>
                    {classesForSelectedTerm.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {scope === "student" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={(event) => setSelectedStudentId(event.target.value)}
                    disabled={!selectedClassId}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="">{selectedClassId ? "Choose a student..." : "Choose a class first..."}</option>
                    {studentsForSelectedClass.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                        {student.admissionNumber ? ` (${student.admissionNumber})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Course</label>
                <div className="flex gap-2">
                  <select
                    value={selectedCourseId}
                    onChange={(event) => handleCourseSelect(event.target.value)}
                    disabled={!selectedAssignment || systemCourseOptions.length === 0}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="">Choose a system course...</option>
                    {systemCourseOptions.map((course) => (
                      <option key={`${course.id}-${course.code}`} value={course.id}>
                        {course.name} ({course.code}) - {course.sourceCurriculumName}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddCourseToList}
                    disabled={!selectedCourseId || !courseName.trim() || !courseCode.trim()}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Course Name</label>
                <input
                  type="text"
                  value={courseName}
                  readOnly
                  placeholder="Selected course name"
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Course Code</label>
                <input
                  type="text"
                  value={courseCode}
                  readOnly
                  placeholder="Selected course code"
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Course Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Optional notes or objectives for this course..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedCourses.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Selected Courses</label>
                  <div className="space-y-2">
                    {selectedCourses.map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.code}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveSelectedCourse(c.id)}
                          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {supplementaryType === "substitute" && (scope === "class" || scope === "student") && selectedClass && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Replace default course</label>
                  <select
                    value={replaceCourseId}
                    onChange={(e) => setReplaceCourseId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a class course to replace...</option>
                    {selectedClass.courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {saveError && (
                <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</div>
              )}
              {saveSuccess && (
                <div className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{saveSuccess}</div>
              )}

              <button
                onClick={handleAddSupplementaryCurriculum}
                disabled={
                  !selectedAssignment ||
                  !selectedTermId ||
                  (!selectedCourseId && selectedCourses.length === 0) ||
                  ((scope === "class" || scope === "student") && !selectedClassId) ||
                  (scope === "student" && !selectedStudentId) ||
                  (supplementaryType === "substitute" && scope === "class" && !replaceCourseId) ||
                  (supplementaryType === "substitute" && (selectedCourses.length + (selectedCourseId ? 1 : 0)) !== 1)
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Supplementary Curriculum
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-slate-950">School Profile</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">{school.name}</p>
                  <p className="text-slate-500">{school.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">{school.students} students</p>
                  <p className="text-slate-500">Principal: {school.principal}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">{school.level}</p>
                  <p className="text-slate-500">School level</p>
                </div>
              </div>
              {selectedAssignment && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Assigned {formatDate(selectedAssignment.assignedDate)}
                    </p>
                    <p className="text-slate-500">Current curriculum assignment</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
