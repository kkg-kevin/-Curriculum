import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Users,
  Save,
  X,
} from "lucide-react";
import {
  Curriculum,
  CurriculumClass,
  CurriculumCourse,
  CurriculumTerm,
  getCurriculumById,
  saveCurriculum,
} from "../lib/curriculumStorage";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CurriculumDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [savedCurriculum, setSavedCurriculum] = useState(() => getCurriculumById(id));
  const [draftCurriculum, setDraftCurriculum] = useState<Curriculum | undefined>(savedCurriculum);
  const [isEditing, setIsEditing] = useState(false);
  const [openTerms, setOpenTerms] = useState<string[]>(() =>
    savedCurriculum?.structure[0]?.id ? [savedCurriculum.structure[0].id] : []
  );
  const [openClasses, setOpenClasses] = useState<string[]>(() =>
    savedCurriculum?.structure[0]?.classes[0]?.id ? [savedCurriculum.structure[0].classes[0].id] : []
  );

  const curriculum = draftCurriculum;

  const updateCurriculum = (updates: Partial<Curriculum>) => {
    setDraftCurriculum((current) => (current ? { ...current, ...updates } : current));
  };

  const addTerm = () => {
    const term: CurriculumTerm = {
      id: newId("term"),
      name: `Term ${(curriculum?.structure.length || 0) + 1}`,
      classes: [],
    };

    setDraftCurriculum((current) =>
      current ? { ...current, structure: [...current.structure, term] } : current
    );
    setOpenTerms((current) => [...current, term.id]);
  };

  const updateTerm = (termId: string, updates: Partial<CurriculumTerm>) => {
    setDraftCurriculum((current) =>
      current
        ? {
            ...current,
            structure: current.structure.map((term) =>
              term.id === termId ? { ...term, ...updates } : term
            ),
          }
        : current
    );
  };

  const removeTerm = (termId: string) => {
    setDraftCurriculum((current) =>
      current
        ? { ...current, structure: current.structure.filter((term) => term.id !== termId) }
        : current
    );
    setOpenTerms((current) => current.filter((item) => item !== termId));
  };

  const addClass = (termId: string) => {
    const nextClass: CurriculumClass = {
      id: newId("class"),
      name: "New Class",
      courses: [],
    };

    setDraftCurriculum((current) =>
      current
        ? {
            ...current,
            structure: current.structure.map((term) =>
              term.id === termId ? { ...term, classes: [...term.classes, nextClass] } : term
            ),
          }
        : current
    );
    setOpenTerms((current) => (current.includes(termId) ? current : [...current, termId]));
    setOpenClasses((current) => [...current, nextClass.id]);
  };

  const updateClass = (termId: string, classId: string, updates: Partial<CurriculumClass>) => {
    setDraftCurriculum((current) =>
      current
        ? {
            ...current,
            structure: current.structure.map((term) =>
              term.id === termId
                ? {
                    ...term,
                    classes: term.classes.map((cls) =>
                      cls.id === classId ? { ...cls, ...updates } : cls
                    ),
                  }
                : term
            ),
          }
        : current
    );
  };

  const removeClass = (termId: string, classId: string) => {
    setDraftCurriculum((current) =>
      current
        ? {
            ...current,
            structure: current.structure.map((term) =>
              term.id === termId
                ? { ...term, classes: term.classes.filter((cls) => cls.id !== classId) }
                : term
            ),
          }
        : current
    );
    setOpenClasses((current) => current.filter((item) => item !== classId));
  };

  const addCourse = (termId: string, classId: string) => {
    const course: CurriculumCourse = {
      id: newId("course"),
      name: "New Course",
      code: "COURSE",
    };

    setDraftCurriculum((current) =>
      current
        ? {
            ...current,
            structure: current.structure.map((term) =>
              term.id === termId
                ? {
                    ...term,
                    classes: term.classes.map((cls) =>
                      cls.id === classId ? { ...cls, courses: [...cls.courses, course] } : cls
                    ),
                  }
                : term
            ),
          }
        : current
    );
    setOpenClasses((current) => (current.includes(classId) ? current : [...current, classId]));
  };

  const updateCourse = (
    termId: string,
    classId: string,
    courseId: string,
    updates: Partial<CurriculumCourse>
  ) => {
    setDraftCurriculum((current) =>
      current
        ? {
            ...current,
            structure: current.structure.map((term) =>
              term.id === termId
                ? {
                    ...term,
                    classes: term.classes.map((cls) =>
                      cls.id === classId
                        ? {
                            ...cls,
                            courses: cls.courses.map((course) =>
                              course.id === courseId ? { ...course, ...updates } : course
                            ),
                          }
                        : cls
                    ),
                  }
                : term
            ),
          }
        : current
    );
  };

  const removeCourse = (termId: string, classId: string, courseId: string) => {
    setDraftCurriculum((current) =>
      current
        ? {
            ...current,
            structure: current.structure.map((term) =>
              term.id === termId
                ? {
                    ...term,
                    classes: term.classes.map((cls) =>
                      cls.id === classId
                        ? { ...cls, courses: cls.courses.filter((course) => course.id !== courseId) }
                        : cls
                    ),
                  }
                : term
            ),
          }
        : current
    );
  };

  const handleSave = () => {
    if (!draftCurriculum) {
      return;
    }

    saveCurriculum(draftCurriculum);
    setSavedCurriculum(draftCurriculum);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftCurriculum(savedCurriculum);
    setIsEditing(false);
  };

  if (!curriculum) {
    return (
      <div className="min-h-full bg-slate-50 p-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Curriculum not found</h1>
          <p className="text-slate-600 mb-6">This curriculum may have been removed or was not saved correctly.</p>
          <button
            onClick={() => navigate("/curriculums")}
            className="px-4 py-2.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors"
          >
            Back to Curriculums
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate("/curriculums")}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Curriculums
          </button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditing ? (
                  <input
                    value={curriculum.name}
                    onChange={(event) => updateCurriculum({ name: event.target.value })}
                    className="w-full max-w-xl px-3 py-2 border border-slate-300 rounded-xl text-2xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <h1 className="text-2xl font-semibold text-slate-900">{curriculum.name}</h1>
                )}
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                  {curriculum.status}
                </span>
              </div>

              {isEditing ? (
                <textarea
                  value={curriculum.description}
                  onChange={(event) => updateCurriculum({ description: event.target.value })}
                  rows={2}
                  className="w-full max-w-3xl px-3 py-2 border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                />
              ) : (
                <p className="text-slate-600 mb-4">{curriculum.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                {isEditing ? (
                  <>
                    <input
                      value={curriculum.code}
                      onChange={(event) => updateCurriculum({ code: event.target.value })}
                      className="w-40 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      value={curriculum.version}
                      onChange={(event) => updateCurriculum({ version: event.target.value })}
                      className="w-28 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                ) : (
                  <>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded">{curriculum.code}</span>
                    <span>Version {curriculum.version}</span>
                  </>
                )}
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {curriculum.schools} schools
                </span>
                <span>Created {curriculum.createdAt}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing && (
                <Link
                  to={`/curriculums/${id}/assign`}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Assign to School
                </Link>
              )}

              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  Edit Curriculum
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Curriculum Structure</h2>
              <p className="text-sm text-slate-600">Hierarchical view of terms, classes, and courses</p>
            </div>
            {isEditing && (
              <button
                onClick={addTerm}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Term
              </button>
            )}
          </div>

          <div className="space-y-3">
            {curriculum.structure.map((term) => (
              <div key={term.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="w-full flex items-center justify-between gap-3 p-5 hover:bg-slate-50 transition-colors">
                  <button
                    onClick={() =>
                      setOpenTerms(
                        openTerms.includes(term.id)
                          ? openTerms.filter((item) => item !== term.id)
                          : [...openTerms, term.id]
                      )
                    }
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    {openTerms.includes(term.id) ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                    {isEditing ? (
                      <input
                        value={term.name}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => updateTerm(term.id, { name: event.target.value })}
                        className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-slate-900">{term.name}</h3>
                    )}
                    <span className="text-sm text-slate-500">({term.classes.length} classes)</span>
                  </button>

                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          addClass(term.id);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Add class"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          removeTerm(term.id);
                        }}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Remove term"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {openTerms.includes(term.id) && (
                  <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-2">
                    {term.classes.map((cls) => (
                      <div key={cls.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div className="w-full flex items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors">
                          <button
                            onClick={() =>
                              setOpenClasses(
                                openClasses.includes(cls.id)
                                  ? openClasses.filter((item) => item !== cls.id)
                                  : [...openClasses, cls.id]
                              )
                            }
                            className="flex items-center gap-3 flex-1 text-left"
                          >
                            {openClasses.includes(cls.id) ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                            {isEditing ? (
                              <input
                                value={cls.name}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) =>
                                  updateClass(term.id, cls.id, { name: event.target.value })
                                }
                                className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <h4 className="font-semibold text-slate-900">{cls.name}</h4>
                            )}
                            <span className="text-sm text-slate-500">({cls.courses.length} courses)</span>
                          </button>

                          {isEditing && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  addCourse(term.id, cls.id);
                                }}
                                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                title="Add course"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeClass(term.id, cls.id);
                                }}
                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                title="Remove class"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {openClasses.includes(cls.id) && (
                          <div className="border-t border-slate-200 bg-slate-50 p-4">
                            <div className="space-y-2">
                              {cls.courses.map((course) => (
                                <div
                                  key={course.id}
                                  className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    {isEditing ? (
                                      <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-3 flex-1">
                                        <input
                                          value={course.name}
                                          onChange={(event) =>
                                            updateCourse(term.id, cls.id, course.id, {
                                              name: event.target.value,
                                            })
                                          }
                                          className="px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                          value={course.code}
                                          onChange={(event) =>
                                            updateCourse(term.id, cls.id, course.id, {
                                              code: event.target.value,
                                            })
                                          }
                                          className="px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <span className="font-medium text-slate-900">{course.name}</span>
                                        <span className="text-sm text-slate-500 font-mono">{course.code}</span>
                                      </>
                                    )}
                                  </div>

                                  {isEditing && (
                                    <button
                                      onClick={() => removeCourse(term.id, cls.id, course.id)}
                                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                      title="Remove course"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            {cls.courses.length === 0 && (
                              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
                                No courses added yet
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {term.classes.length === 0 && (
                      <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">
                        No classes added yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {curriculum.structure.length === 0 && (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No modules added yet</h3>
              <p className="text-slate-600 mb-6">This curriculum has been saved without terms, classes, or courses.</p>
              {isEditing && (
                <button
                  onClick={addTerm}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add First Term
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
