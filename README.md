# Digifunzi Curriculum System

Digifunzi is a React and Vite curriculum management prototype for designing, deploying, versioning, and monitoring school curriculum journeys. The app uses browser `localStorage` for persistence, so it can be explored without a backend while still supporting realistic curriculum, school, assignment, and supplementary-course flows.

## What The App Covers

- Curriculum management dashboard with deployment, learner journey, approval, and curriculum preview sections
- Curriculum creation wizard with basic information, framework, education level, cycle model, countries/regions, tags, structure, classes, courses, placeholders for competencies/settings, and review
- Curriculum structure page with tabs, curriculum tree, selected-term metrics, courses by class, quick actions, and validation status
- Curriculum settings page with general preferences, governance, supplement rules, content standards, and compliance controls
- Version control page for timeline, current version details, change highlights, and all-version management
- School directory and school detail views
- Curriculum-to-school assignment workflow
- Supplementary course deployment workflow that saves compatible supplementary curriculum data
- Shared Digifunzi sidebar matching the product mockups, including Learners, Teachers, Classes, Assessments, and Reports placeholders

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Radix UI primitives
- Lucide React icons
- Browser `localStorage` for prototype persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

After starting the dev server, Vite will print the local URL, usually:

```text
http://localhost:5173
```

## Navigation And Routes

| Route | Purpose |
| --- | --- |
| `/` | Main dashboard |
| `/curriculums` | Curriculum Management dashboard |
| `/curriculums/create` | Create New Curriculum wizard |
| `/curriculums/:id` | Curriculum Structure/detail view |
| `/curriculums/:id/edit` | Edit curriculum wizard |
| `/curriculums/:id/assign` | Assign a curriculum to schools |
| `/schools` | School directory |
| `/schools/:id` | School detail, assigned curriculum, and supplementary curriculum management |
| `/assignments` | Assignment registry |
| `/assignments/create` | Create assignment flow |
| `/deployments/supplementary-course` | Deploy Supplementary Course workflow |
| `/settings` | Curriculum Settings |
| `/settings/version-control` | Version Control |
| `/learners` | Placeholder destination from sidebar |
| `/teachers` | Placeholder destination from sidebar |
| `/classes` | Placeholder destination from sidebar |
| `/assessments` | Placeholder destination from sidebar |
| `/reports` | Placeholder destination from sidebar |

## Main User Flows

### 1. Create A Curriculum

Start at `/curriculums/create`.

The wizard collects:

- Basic information: name, code, description
- Curriculum framework
- Education level
- Academic cycle model: terms, semesters, or custom
- Intended countries/regions
- Tags
- Academic structure
- Classes/grades and courses
- Review before saving

The first step also includes a live curriculum preview and “what’s next” guidance. Competencies and settings are represented as workflow steps even where their full editing behavior is not yet implemented.

Key files:

- `src/app/pages/CreateCurriculumWizard.tsx`
- `src/app/lib/curriculumStorage.ts`

### 2. Manage Curriculums

Open `/curriculums`.

This page acts as the curriculum command center. It includes:

- KPI cards for curriculum versions, deployed schools, supplements, learners, and completion rate
- Curriculum structure preview
- Deployment overview
- Pending approvals
- Recent school deployments
- Learner journey summary

Primary actions:

- `New Curriculum` opens the create wizard
- Curriculum preview links to the structure/detail page
- Pending supplement cards link to supplementary deployment

Key file:

- `src/app/pages/CurriculumListPage.tsx`

### 3. View Curriculum Structure

Open `/curriculums/:id`.

This view focuses on the curriculum structure and includes:

- Breadcrumb and action header
- Curriculum summary banner
- Tabs for Structure, Competencies, Courses, Assessments, Resources, Mapping, and History
- Left curriculum tree of terms and classes
- Selected-term metrics and course grouping by class
- Structure overview chart
- Quick actions
- Structure validation card

Existing edit actions route back to the curriculum wizard.

Key file:

- `src/app/pages/CurriculumDetailPage.tsx`

### 4. Configure Curriculum Settings

Open `/settings`.

The settings area includes:

- General preferences
- Governance and permissions
- Supplement settings
- Content and standards
- Data and compliance
- Interactive local toggles for UI state

The `Version Control` tab links to `/settings/version-control`.

Key file:

- `src/app/pages/CurriculumSettingsPage.tsx`

### 5. Manage Version Control

Open `/settings/version-control`.

This page includes:

- Curriculum version summary
- Version overview tabs
- Timeline of versions
- Current version metrics
- “What’s new” change list
- All versions table with filters and actions

Some version details are static prototype data because full version history persistence is not implemented yet.

Key file:

- `src/app/pages/VersionControlPage.tsx`

### 6. Assign Curriculum To Schools

Open `/curriculums/:id/assign` or `/assignments/create`.

The assignment flow supports:

- Selecting a curriculum
- Searching and selecting one or more schools
- Setting an effective date
- Adding deployment notes
- Saving assignment records

When a new assignment is created, the related curriculum school count is updated.

Key files:

- `src/app/pages/AssignCurriculumPage.tsx`
- `src/app/pages/AssignmentsPage.tsx`
- `src/app/lib/schoolStorage.ts`

### 7. Deploy A Supplementary Course

Open `/deployments/supplementary-course`.

This workflow matches the supplementary-course deployment mockup and supports:

- Selecting a school
- Viewing the base curriculum
- Choosing a supplementary course from the course library
- Configuring supplement type and integration style
- Setting pacing
- Choosing scope and grade/cohort
- Reviewing deployment summary
- Saving a compatible supplementary curriculum record

`Review & Submit` currently writes to the existing supplementary curriculum storage model and then navigates to the selected school.

Key files:

- `src/app/pages/DeploySupplementaryCoursePage.tsx`
- `src/app/lib/schoolStorage.ts`

### 8. School Detail Supplementary Curriculum

Open `/schools/:id`.

School detail pages still contain the original supplementary curriculum management flow. This lets users inspect assigned curricula and add school/class/student-scoped supplementary curricula using the existing data model.

Key file:

- `src/app/pages/SchoolDetailPage.tsx`

## Shared Sidebar

The app shell is defined in `src/app/components/Layout.tsx`.

The sidebar includes:

- Digifunzi brand and “Future-Ready Learning” subtitle
- Dashboard
- Schools
- Curriculum
- Learners
- Teachers
- Classes
- Assessments
- Reports
- Settings
- Need Help card
- Digifunzi footer and copyright

Some sidebar destinations are placeholders until their full modules are implemented.

## Data Storage

The prototype uses browser `localStorage`, so data is stored per browser and origin.

Storage keys:

| Key | Contents |
| --- | --- |
| `digifunzii.curriculums` | Curriculum templates and structure |
| `digifunzii.schools` | School records |
| `digifunzii.schoolAssignments` | Curriculum-to-school assignments |
| `digifunzii.students` | Student seed data |
| `digifunzii.supplementaryCourses` | Legacy supplementary course data |
| `digifunzii.supplementaryCurriculums` | Current supplementary curriculum records |

Default seed data lives in:

- `src/app/lib/curriculumStorage.ts`
- `src/app/lib/schoolStorage.ts`

To reset prototype data, clear local storage for the app URL and reload.

## Project Structure

```text
src/
  app/
    components/
      Layout.tsx
      DatePicker.tsx
      ui/
    lib/
      curriculumStorage.ts
      schoolStorage.ts
    pages/
      AssignCurriculumPage.tsx
      AssignmentsPage.tsx
      CreateCurriculumWizard.tsx
      CurriculumDetailPage.tsx
      CurriculumListPage.tsx
      CurriculumSettingsPage.tsx
      DashboardPage.tsx
      DeploySupplementaryCoursePage.tsx
      SchoolDetailPage.tsx
      SchoolsPage.tsx
      VersionControlPage.tsx
    routes.tsx
  styles/
```

## Development Notes

- The app currently has no backend API.
- Several advanced areas are prototype UI only: approvals, analytics, version history persistence, governance roles, and some settings tabs.
- Assignment records and supplementary curriculum records are saved locally.
- Curriculum metadata now includes optional fields for framework, education level, academic cycle model, countries, and tags.
- Placeholder routes exist for Learners, Teachers, Classes, Assessments, and Reports so the sidebar matches the product navigation.
- Build verification is done with `npm run build`.

## Useful Commands

```bash
npm run dev
npm run build
```

## Future Improvements

- Replace `localStorage` with a backend API and database
- Add authentication, roles, and real permission enforcement
- Persist version history and compare-version data
- Add approval workflows for supplementary deployments
- Add analytics data sources for learner journey and completion metrics
- Add import/export for curriculums
- Add tests for storage helpers and page workflows
- Add full modules for Learners, Teachers, Classes, Assessments, and Reports
