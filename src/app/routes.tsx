import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { CurriculumListPage } from "./pages/CurriculumListPage";
import { CreateCurriculumWizard } from "./pages/CreateCurriculumWizard";
import { CurriculumDetailPage } from "./pages/CurriculumDetailPage";
import { AssignCurriculumPage } from "./pages/AssignCurriculumPage";
import { SchoolsPage } from "./pages/SchoolsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: CurriculumListPage },
      { path: "curriculums", Component: CurriculumListPage },
      { path: "curriculums/create", Component: CreateCurriculumWizard },
      { path: "curriculums/:id", Component: CurriculumDetailPage },
      { path: "curriculums/:id/assign", Component: AssignCurriculumPage },
      { path: "schools", Component: SchoolsPage },
      { path: "assignments", Component: () => <div className="p-8 text-slate-600">Assignments page coming soon</div> },
      { path: "settings", Component: () => <div className="p-8 text-slate-600">Settings page coming soon</div> },
    ],
  },
]);
