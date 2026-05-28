import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ChevronLeft, ChevronDown, ChevronRight, Plus, Edit, Trash2, Users } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { getCurriculumById } from "../lib/curriculumStorage";

export function CurriculumDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculum] = useState(() => getCurriculumById(id));
  const [openTerms, setOpenTerms] = useState<string[]>(() => curriculum?.structure[0]?.id ? [curriculum.structure[0].id] : []);
  const [openClasses, setOpenClasses] = useState<string[]>(() => curriculum?.structure[0]?.classes[0]?.id ? [curriculum.structure[0].classes[0].id] : []);

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

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-slate-900">{curriculum.name}</h1>
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                  {curriculum.status}
                </span>
              </div>
              <p className="text-slate-600 mb-4">{curriculum.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="font-mono bg-slate-100 px-2 py-1 rounded">{curriculum.code}</span>
                <span>Version {curriculum.version}</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {curriculum.schools} schools
                </span>
                <span>Created {curriculum.createdAt}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/curriculums/${id}/assign`}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                <Users className="w-5 h-5" />
                Assign to School
              </Link>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors">
                <Edit className="w-5 h-5" />
                Edit Curriculum
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Curriculum Structure</h2>
            <p className="text-sm text-slate-600">Hierarchical view of terms, classes, and courses</p>
          </div>

          <div className="space-y-3">
            {curriculum.structure.map((term) => (
              <div key={term.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenTerms(openTerms.includes(term.id)
                    ? openTerms.filter(t => t !== term.id)
                    : [...openTerms, term.id]
                  )}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {openTerms.includes(term.id) ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                    <h3 className="text-lg font-semibold text-slate-900">{term.name}</h3>
                    <span className="text-sm text-slate-500">({term.classes.length} classes)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </button>

                {openTerms.includes(term.id) && (
                  <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-2">
                    {term.classes.map((cls) => (
                      <div key={cls.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenClasses(openClasses.includes(cls.id)
                            ? openClasses.filter(c => c !== cls.id)
                            : [...openClasses, cls.id]
                          )}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {openClasses.includes(cls.id) ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                            <h4 className="font-semibold text-slate-900">{cls.name}</h4>
                            <span className="text-sm text-slate-500">({cls.courses.length} courses)</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </button>

                        {openClasses.includes(cls.id) && (
                          <div className="border-t border-slate-200 bg-slate-50 p-4">
                            <div className="space-y-2">
                              {cls.courses.map((course) => (
                                <div
                                  key={course.id}
                                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span className="font-medium text-slate-900">{course.name}</span>
                                    <span className="text-sm text-slate-500 font-mono">{course.code}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {curriculum.structure.length === 0 && (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No modules added yet</h3>
              <p className="text-slate-600">This curriculum has been saved without terms, classes, or courses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
