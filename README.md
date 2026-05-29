# EduManage Curriculum System

EduManage is a React and Vite curriculum management app for creating curriculum templates, assigning them to schools, and tracking school-specific supplementary courses. The current implementation is a browser-based prototype that persists data in `localStorage`.

## Features

- Curriculum dashboard with curriculum-only metrics and recent templates
- Curriculum library with search and curriculum actions
- Multi-step curriculum builder for terms, classes, and courses
- Curriculum detail pages with structure summaries
- School directory with active curriculum assignments
- School detail pages with assigned curriculum views
- School-wide and class-specific supplementary course additions
- Assignment registry with search, filters, status controls, and quick links
- Curriculum-to-school assignment workflow with effective dates and notes

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

## App Routes

| Route | Purpose |
| --- | --- |
| `/` | Curriculum-focused dashboard |
| `/curriculums` | Curriculum library |
| `/curriculums/create` | Create curriculum wizard |
| `/curriculums/:id` | Curriculum detail |
| `/curriculums/:id/edit` | Edit curriculum wizard |
| `/curriculums/:id/assign` | Assign selected curriculum to a school |
| `/schools` | School directory |
| `/schools/:id` | School detail and supplementary courses |
| `/assignments` | Assignment registry and management |
| `/assignments/create` | Create assignment flow |
| `/settings` | Placeholder |

## Main Modules

### Dashboard

The dashboard is intentionally curriculum-only. It shows totals for curriculums, active curriculums, archived curriculums, course count, curriculum structure summary, and recent curriculum templates.

Key file:

- `src/app/pages/DashboardPage.tsx`

### Curriculums

Curriculums are reusable templates made up of:

- Basic metadata: name, code, version, year, dates, description
- Terms or sessions
- Classes or grades inside each term
- Courses inside each class

Key files:

- `src/app/pages/CurriculumListPage.tsx`
- `src/app/pages/CreateCurriculumWizard.tsx`
- `src/app/pages/CurriculumDetailPage.tsx`
- `src/app/lib/curriculumStorage.ts`

### Schools

Schools can have active curriculum assignments. School detail pages also show the selected assigned curriculum and allow adding supplementary courses.

Supplementary courses can be added:

- School-wide
- To a specific class

Courses can be selected from the existing curriculum course dropdown and then adjusted before saving.

Key files:

- `src/app/pages/SchoolsPage.tsx`
- `src/app/pages/SchoolDetailPage.tsx`
- `src/app/lib/schoolStorage.ts`

### Assignments

Assignments connect curriculums to schools. The assignment module provides:

- Assignment stats
- Search
- Filters by status, school, and curriculum
- Active/inactive status management
- Links to related school and curriculum pages
- A create assignment entry point

Key files:

- `src/app/pages/AssignmentsPage.tsx`
- `src/app/pages/AssignCurriculumPage.tsx`
- `src/app/lib/schoolStorage.ts`

## Data Storage

The app uses browser `localStorage`, so data is stored per browser and per origin.

Storage keys:

| Key | Contents |
| --- | --- |
| `digifunzii.curriculums` | Curriculum templates |
| `digifunzii.schools` | School records |
| `digifunzii.schoolAssignments` | Curriculum-to-school assignments |
| `digifunzii.supplementaryCourses` | School-specific supplementary courses |

Default seed data is defined in:

- `src/app/lib/curriculumStorage.ts`
- `src/app/lib/schoolStorage.ts`

To reset prototype data, clear the browser local storage for the app URL and reload.

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
      DashboardPage.tsx
      SchoolDetailPage.tsx
      SchoolsPage.tsx
    routes.tsx
  styles/
```

## Development Notes

- The app currently has no backend API.
- Assignment removal and deactivation are represented by changing assignment status to `Inactive`.
- Curriculum school counts are updated when assignments are created, activated, deactivated, or removed.
- Data changes are immediate in local storage but are not shared across browsers or devices.
- The Settings route is still a placeholder.

## Useful Commands

```bash
npm run dev
npm run build
```

## Future Improvements

- Replace local storage with a backend API and database
- Add authentication and roles
- Add audit history for assignment changes
- Add import/export for curriculums
- Add tests for storage helpers and page workflows
- Add stronger validation for duplicate assignments and duplicate course codes
