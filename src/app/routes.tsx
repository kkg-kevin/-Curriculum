import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { CurriculumListPage } from "./pages/CurriculumListPage";
import { CreateCurriculumWizard } from "./pages/CreateCurriculumWizard";
import { CurriculumDetailPage } from "./pages/CurriculumDetailPage";
import { AssignCurriculumPage } from "./pages/AssignCurriculumPage";
import { AssignmentsPage } from "./pages/AssignmentsPage";
import { CurriculumSettingsPage } from "./pages/CurriculumSettingsPage";
import { SchoolDetailPage } from "./pages/SchoolDetailPage";
import { SchoolsPage } from "./pages/SchoolsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "curriculums", Component: CurriculumListPage },
      { path: "curriculums/create", Component: CreateCurriculumWizard },
      { path: "curriculums/:id/edit", Component: CreateCurriculumWizard },
      { path: "curriculums/:id", Component: CurriculumDetailPage },
      { path: "curriculums/:id/assign", Component: AssignCurriculumPage },
      { path: "schools", Component: SchoolsPage },
      { path: "schools/:id", Component: SchoolDetailPage },
      { path: "assignments", Component: AssignmentsPage },
      { path: "assignments/create", Component: AssignCurriculumPage },
      { path: "settings", Component: CurriculumSettingsPage },
    ],
  },
]);
