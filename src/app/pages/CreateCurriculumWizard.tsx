import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronRight, Plus, GripVertical, X, Check, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { DatePicker } from "../components/DatePicker";
import { getCurriculumById, saveCurriculum } from "../lib/curriculumStorage";

type Step = 1 | 2 | 3 | 4 | 5;

interface Term {
  id: string;
  name: string;
  order: number;
  startDate?: Date;
  midTermStartDate?: Date;
  midTermEndDate?: Date;
  endDate?: Date;
}

interface Class {
  id: string;
  termId: string;
  name: string;
  order: number;
}

interface Course {
  id: string;
  classId: string;
  name: string;
  code: string;
  description: string;
}

// Predefined course catalog
const AVAILABLE_COURSES = [
  { name: "Mathematics", code: "MATH" },
  { name: "English Language", code: "ENG" },
  { name: "Science", code: "SCI" },
  { name: "Biology", code: "BIO" },
  { name: "Chemistry", code: "CHEM" },
  { name: "Physics", code: "PHY" },
  { name: "Computer Science", code: "CS" },
  { name: "Social Studies", code: "SOC" },
  { name: "History", code: "HIST" },
  { name: "Geography", code: "GEO" },
  { name: "Literature", code: "LIT" },
  { name: "Art & Design", code: "ART" },
  { name: "Music", code: "MUS" },
  { name: "Physical Education", code: "PE" },
  { name: "Foreign Language", code: "LANG" },
  { name: "Business Studies", code: "BUS" },
  { name: "Economics", code: "ECON" },
  { name: "Religious Education", code: "RE" },
  {name: "L1.1 Coding, AI and Robotics", code: "L1.1"},
  {name: "L2.1 Coding, AI and Robotics", code: "L2.1"},
  {name: "L3.1 Coding, AI and Robotics", code: "L3.1"},

  {name: "L1.2 Coding, AI and Robotics", code: "L1.2"},
  {name: "L2.2 Coding, AI and Robotics", code: "L2.2"},
  {name: "L3.2 Coding, AI and Robotics", code: "L3.2"}, 

  {name: "L1.3 Coding, AI and Robotics", code: "1.3"},
  {name: "L2.3 Coding, AI and Robotics", code: "L2.3"},       
  {name: "L3.3 Coding, AI and Robotics", code: "L3.3"},
];

function parseSavedDate(value: string | undefined) {
  return value ? new Date(value) : undefined;
}

function formatLocalDateRange(startDate?: Date, endDate?: Date) {
  if (startDate && endDate) {
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }

  if (startDate) {
    return `Starts ${startDate.toLocaleDateString()}`;
  }

  if (endDate) {
    return `Ends ${endDate.toLocaleDateString()}`;
  }

  return "Dates not set";
}

export function CreateCurriculumWizard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const existingCurriculum = id ? getCurriculumById(id) : undefined;
  const isEditing = Boolean(existingCurriculum);
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [basicInfo, setBasicInfo] = useState({
    name: existingCurriculum?.name || "",
    code: existingCurriculum?.code || "",
    version: existingCurriculum?.version || "",
    description: existingCurriculum?.description || "",
    year: existingCurriculum?.year || "",
    startDate: parseSavedDate(existingCurriculum?.startDate),
    endDate: parseSavedDate(existingCurriculum?.endDate),
  });

  const [terms, setTerms] = useState<Term[]>(
    () =>
      existingCurriculum?.structure.map((term, index) => ({
        id: term.id,
        name: term.name,
        order: index,
        startDate: parseSavedDate(term.startDate),
        midTermStartDate: parseSavedDate(term.midTermStartDate || term.midTermDate),
        midTermEndDate: parseSavedDate(term.midTermEndDate),
        endDate: parseSavedDate(term.endDate),
      })) || []
  );
  const [classes, setClasses] = useState<Class[]>(
    () =>
      existingCurriculum?.structure.flatMap((term) =>
        term.classes.map((cls, index) => ({
          id: cls.id,
          termId: term.id,
          name: cls.name,
          order: index,
        }))
      ) || []
  );
  const [courses, setCourses] = useState<Course[]>(
    () =>
      existingCurriculum?.structure.flatMap((term) =>
        term.classes.flatMap((cls) =>
          cls.courses.map((course) => ({
            id: course.id,
            classId: cls.id,
            name: course.name,
            code: course.code,
            description: course.description || "",
          }))
        )
      ) || []
  );
  const [selectedClassForCourse, setSelectedClassForCourse] = useState<string>("");
  const [selectedCourseName, setSelectedCourseName] = useState<string>("");

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Add Terms" },
    { number: 3, title: "Add Classes" },
    { number: 4, title: "Add Courses" },
    { number: 5, title: "Review & Save" },
  ];

  const addTerm = () => {
    setTerms([...terms, {
      id: Date.now().toString(),
      name: "",
      order: terms.length,
      startDate: undefined,
      midTermStartDate: undefined,
      midTermEndDate: undefined,
      endDate: undefined
    }]);
  };

  const updateTerm = (id: string, field: keyof Term, value: any) => {
    setTerms(terms.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTerm = (id: string) => {
    setTerms(terms.filter(t => t.id !== id));
    setClasses(classes.filter(c => c.termId !== id));
  };

  const addClass = (termId: string) => {
    setClasses([...classes, { id: Date.now().toString(), termId, name: "", order: classes.filter(c => c.termId === termId).length }]);
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    setCourses(courses.filter(co => co.classId !== id));
  };

  const addCourseFromDropdown = (classId: string, courseName: string) => {
    const courseTemplate = AVAILABLE_COURSES.find(c => c.name === courseName);
    if (courseTemplate) {
      setCourses([...courses, {
        id: Date.now().toString(),
        classId,
        name: courseTemplate.name,
        code: courseTemplate.code,
        description: ""
      }]);
    }
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourseDescription = (id: string, description: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, description } : c));
  };

  const handleSave = () => {
    const savedCurriculum = {
      id: existingCurriculum?.id || `curriculum-${Date.now()}`,
      name: basicInfo.name.trim() || "Untitled Curriculum",
      code: basicInfo.code.trim() || "NO-CODE",
      version: basicInfo.version.trim() || "1.0",
      status: existingCurriculum?.status || "Active" as const,
      schools: existingCurriculum?.schools || 0,
      createdAt: existingCurriculum?.createdAt || new Date().toISOString().split("T")[0],
      description: basicInfo.description.trim() || "No description provided",
      year: basicInfo.year.trim() || undefined,
      startDate: basicInfo.startDate?.toISOString(),
      endDate: basicInfo.endDate?.toISOString(),
      structure: terms.map((term, termIndex) => ({
        id: term.id,
        name: term.name.trim() || `Term ${termIndex + 1}`,
        startDate: term.startDate?.toISOString(),
        midTermStartDate: term.midTermStartDate?.toISOString(),
        midTermEndDate: term.midTermEndDate?.toISOString(),
        endDate: term.endDate?.toISOString(),
        classes: classes
          .filter((cls) => cls.termId === term.id)
          .map((cls, classIndex) => ({
            id: cls.id,
            name: cls.name.trim() || `Class ${classIndex + 1}`,
            courses: courses
              .filter((course) => course.classId === cls.id)
              .map((course) => ({
                id: course.id,
                name: course.name,
                code: course.code,
                description: course.description,
              })),
          })),
      })),
    };

    saveCurriculum(savedCurriculum);
    navigate("/curriculums");
  };

  if (id && !existingCurriculum) {
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
    <div className="min-h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            {isEditing ? "Edit Curriculum" : "Create New Curriculum"}
          </h1>
          <p className="text-sm text-slate-600">
            {isEditing ? "Update this curriculum template" : "Build a reusable curriculum template"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    ${currentStep === step.number
                      ? "bg-[#1B50B8] text-white shadow-lg shadow-blue-500/30"
                      : currentStep > step.number
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 text-slate-600"
                    }
                  `}>
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= step.number ? "text-slate-900" : "text-slate-500"}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? "bg-green-500" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 min-h-96">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Curriculum Name</label>
                <input
                  type="text"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  placeholder="e.g., CBC Junior Secondary"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Curriculum Code</label>
                  <input
                    type="text"
                    value={basicInfo.code}
                    onChange={(e) => setBasicInfo({ ...basicInfo, code: e.target.value })}
                    placeholder="e.g., CBC-JS-2024"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Version</label>
                  <input
                    type="text"
                    value={basicInfo.version}
                    onChange={(e) => setBasicInfo({ ...basicInfo, version: e.target.value })}
                    placeholder="e.g., 1.0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Academic Year</label>
                  <input
                    type="text"
                    value={basicInfo.year}
                    onChange={(e) => setBasicInfo({ ...basicInfo, year: e.target.value })}
                    placeholder="e.g., 2024-2025"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <DatePicker
                    value={basicInfo.startDate}
                    onChange={(date) => setBasicInfo({ ...basicInfo, startDate: date })}
                    placeholder="Select start date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <DatePicker
                    value={basicInfo.endDate}
                    onChange={(date) => setBasicInfo({ ...basicInfo, endDate: date })}
                    placeholder="Select end date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                  placeholder="Describe the curriculum..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Academic Terms / Sessions</h3>
                  <p className="text-sm text-slate-600 mt-1">Add multiple terms or sessions for this curriculum</p>
                </div>
                <button
                  onClick={addTerm}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Term
                </button>
              </div>

              <div className="space-y-3">
                {terms.map((term, index) => (
                  <div key={term.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                      <span className="text-sm font-medium text-slate-600 w-8">#{index + 1}</span>
                      <input
                        type="text"
                        value={term.name}
                        onChange={(e) => updateTerm(term.id, 'name', e.target.value)}
                        placeholder="Term name (e.g., Term 1, Fall Semester)"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeTerm(term.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 ml-14 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                        <DatePicker
                          value={term.startDate}
                          onChange={(date) => updateTerm(term.id, 'startDate', date)}
                          placeholder="Select start date"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Mid-Term Start</label>
                        <DatePicker
                          value={term.midTermStartDate}
                          onChange={(date) => updateTerm(term.id, 'midTermStartDate', date)}
                          placeholder="Select mid-term start"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Mid-Term End</label>
                        <DatePicker
                          value={term.midTermEndDate}
                          onChange={(date) => updateTerm(term.id, 'midTermEndDate', date)}
                          placeholder="Select mid-term end"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                        <DatePicker
                          value={term.endDate}
                          onChange={(date) => updateTerm(term.id, 'endDate', date)}
                          placeholder="Select end date"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {terms.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-slate-600 font-medium mb-2">No terms added yet</p>
                  <p className="text-sm text-slate-500 mb-4">Click "Add Term" to add multiple terms</p>
                  <button
                    onClick={addTerm}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Term
                  </button>
                </div>
              )}

              {terms.length > 0 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{terms.length}</span> term{terms.length !== 1 ? 's' : ''} added
                  </p>
                  <button
                    onClick={addTerm}
                    className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Term
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Add Classes / Grades</h3>
                <p className="text-sm text-slate-600">Add multiple classes or grades within each term</p>
              </div>

              {terms.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                  <p className="text-slate-600 font-medium mb-2">No terms available</p>
                  <p className="text-sm text-slate-500">Please go back and add terms first</p>
                </div>
              )}

              {terms.map((term) => (
                <div key={term.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{term.name || "Unnamed Term"}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {classes.filter(c => c.termId === term.id).length} class{classes.filter(c => c.termId === term.id).length !== 1 ? 'es' : ''} added
                      </p>
                    </div>
                    <button
                      onClick={() => addClass(term.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Class
                    </button>
                  </div>

                  <div className="space-y-2">
                    {classes.filter(c => c.termId === term.id).map((cls, index) => (
                      <div key={cls.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                        <span className="text-sm font-medium text-slate-600 w-6">#{index + 1}</span>
                        <input
                          type="text"
                          value={cls.name}
                          onChange={(e) => setClasses(classes.map(c => c.id === cls.id ? { ...c, name: e.target.value } : c))}
                          placeholder="Class name (e.g., Grade 7, Form 1)"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeClass(cls.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {classes.filter(c => c.termId === term.id).length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg bg-white">
                      <p className="text-sm text-slate-500 mb-3">No classes added for this term</p>
                      <button
                        onClick={() => addClass(term.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Class
                      </button>
                    </div>
                  )}

                  {classes.filter(c => c.termId === term.id).length > 0 && (
                    <div className="flex items-center justify-end pt-3 border-t border-slate-200 mt-3">
                      <button
                        onClick={() => addClass(term.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Class
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Add Courses / Subjects</h3>
                <p className="text-sm text-slate-600">Add multiple courses within each class</p>
              </div>

              {classes.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                  <p className="text-slate-600 font-medium mb-2">No classes available</p>
                  <p className="text-sm text-slate-500">Please go back and add classes first</p>
                </div>
              )}

              {terms.map((term) => (
                <div key={term.id} className="space-y-4">
                  {classes.filter(c => c.termId === term.id).map((cls) => {
                    const classCourses = courses.filter(co => co.classId === cls.id);
                    const availableCoursesForClass = AVAILABLE_COURSES.filter(
                      ac => !classCourses.some(cc => cc.name === ac.name)
                    );

                    return (
                      <div key={cls.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{cls.name || "Unnamed Class"}</h4>
                            <p className="text-sm text-slate-600">{term.name} • {classCourses.length} course{classCourses.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        {availableCoursesForClass.length > 0 && (
                          <div className="mb-4 p-4 bg-white rounded-xl border border-slate-200">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Select Course to Add</label>
                            <select
                              value={selectedClassForCourse === cls.id ? selectedCourseName : ""}
                              onChange={(e) => {
                                setSelectedClassForCourse(cls.id);
                                setSelectedCourseName(e.target.value);
                                if (e.target.value) {
                                  addCourseFromDropdown(cls.id, e.target.value);
                                  setSelectedCourseName("");
                                  setSelectedClassForCourse("");
                                }
                              }}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                              <option value="">Choose a course to add...</option>
                              {availableCoursesForClass.map((course) => (
                                <option key={course.code} value={course.name}>
                                  {course.name} ({course.code})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {classCourses.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium text-slate-700">Selected Courses</h5>
                            {classCourses.map((course) => (
                              <div key={course.id} className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                                <div className="flex items-start gap-3">
                                  <GripVertical className="w-4 h-4 text-slate-400 cursor-move mt-3" />
                                  <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{course.name}</p>
                                        <p className="text-sm text-slate-500 font-mono">{course.code}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-slate-600 mb-1">Description (Optional)</label>
                                      <textarea
                                        value={course.description}
                                        onChange={(e) => updateCourseDescription(course.id, e.target.value)}
                                        placeholder="Add specific details or learning objectives for this course..."
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeCourse(course.id)}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {classCourses.length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg bg-white">
                            <p className="text-sm text-slate-500 mb-2">No courses added yet</p>
                            <p className="text-xs text-slate-400">Select courses from the dropdown above</p>
                          </div>
                        )}

                        {availableCoursesForClass.length === 0 && classCourses.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700">All available courses have been added to this class</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Review Curriculum Structure</h3>
                <p className="text-sm text-slate-600">Review your curriculum before saving</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-1">{basicInfo.name}</h4>
                <p className="text-sm text-slate-600 mb-3">{basicInfo.description}</p>
                <div className="flex flex-wrap gap-4 text-sm mb-3">
                  <span className="font-mono bg-white px-2 py-1 rounded">{basicInfo.code}</span>
                  <span className="text-slate-600">Version {basicInfo.version}</span>
                  {basicInfo.year && <span className="text-slate-600">Year: {basicInfo.year}</span>}
                </div>
                {(basicInfo.startDate || basicInfo.endDate) && (
                  <div className="flex gap-4 text-sm text-slate-600">
                    {basicInfo.startDate && <span>Start: {basicInfo.startDate.toLocaleDateString()}</span>}
                    {basicInfo.endDate && <span>End: {basicInfo.endDate.toLocaleDateString()}</span>}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {terms.map((term) => (
                  <div key={term.id} className="border border-slate-200 rounded-xl p-4 bg-white">
                    <div className="mb-3">
                      <h5 className="font-semibold text-slate-900">{term.name}</h5>
                      {(term.startDate || term.endDate) && (
                        <p className="text-xs text-slate-500 mt-1">
                          {term.startDate && term.startDate.toLocaleDateString()}
                          {term.startDate && term.endDate && " - "}
                          {term.endDate && term.endDate.toLocaleDateString()}
                        </p>
                      )}
                      {(term.midTermStartDate || term.midTermEndDate) && (
                        <p className="text-xs text-slate-500 mt-1">
                          Mid-term: {formatLocalDateRange(term.midTermStartDate, term.midTermEndDate)}
                        </p>
                      )}
                    </div>
                    {classes.filter(c => c.termId === term.id).map((cls) => (
                      <div key={cls.id} className="ml-4 mb-3 last:mb-0">
                        <p className="font-medium text-slate-800 mb-2">{cls.name}</p>
                        <div className="ml-4 space-y-1">
                          {courses.filter(co => co.classId === cls.id).map((course) => (
                            <div key={course.id} className="text-sm text-slate-600 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                              {course.name} {course.code && `(${course.code})`}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => currentStep > 1 && setCurrentStep((currentStep - 1) as Step)}
            disabled={currentStep === 1}
            className="px-6 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/curriculums")}
              className="px-6 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep((currentStep + 1) as Step)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
              >
                <Check className="w-5 h-5" />
                {isEditing ? "Save Changes" : "Save Curriculum"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
