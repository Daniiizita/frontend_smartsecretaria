# SmartSecretaria (Frontend)

The web client for SmartSecretaria, a school-management system. It gives school staff, teachers and guardians a role-aware interface for students, classes, enrollments and official documents, backed by a Django REST API.

> **Status:** portfolio project under active development, public for presentation purposes. Screen coverage does not yet match every module in the API, and the product is not production-ready. Use fictional data only.

Backend repository: [backend_smartsecretaria](https://github.com/Daniiizita/backend_smartsecretaria) (Django + Django REST Framework).

The user interface is in Brazilian Portuguese.

## Tech stack

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript 5.9 |
| Build tool | Vite (via `rolldown-vite`), React Compiler Babel plugin |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4, `lucide-react` icons |
| HTTP | Axios (with request/response interceptors) |
| Linting | ESLint 9 + `typescript-eslint` |
| CI | GitHub Actions: lint, build and `npm audit` (Node 22) |
| Hosting (demo) | Vercel |

## Key features

- **Login** with username or email.
- **Role-based home screen**: a school overview for staff, "My classes" for teachers, and "My children" (class, enrollment, teachers and documents) for guardians.
- **Students and teachers**: lists with detail pages; create and edit for school staff; a "My students" view for teachers showing pedagogical data only.
- **Dashboard** with summary cards that link to the matching lists.
- **Classes**: filters by school year, level and period; a class page with the homeroom teacher, subjects, teachers and students; staff can assign teachers directly on the page.
- **Enrollments**: shortcuts by status (active, pending, cancelled, transferred), filters by year, class and student, and quick actions (confirm, cancel, transfer, reactivate). One active enrollment per student per school year; the active enrollment defines the student's current class.
- **Documents**: issue enrollment declarations, certificates, transcripts, report cards and other student documents from templates filled with the student's data, reviewable before issuing, in a print-ready A4 layout that can be saved as PDF. Guardians can open and print their children's documents.
- **Users and permissions**: manage accounts and permission levels (staff only).
- **My profile**: account details and password change for every user.
- **Notifications** in the header.

The calendar does not have its own screen yet.

## Getting started

### Prerequisites

- Node.js 22 (the version used in CI)
- The [backend API](https://github.com/Daniiizita/backend_smartsecretaria) running locally at `http://127.0.0.1:8000`, with CORS allowing `http://localhost:5173` (the backend's default)

### Install and run

```bash
npm ci
VITE_API_BASE_URL=http://127.0.0.1:8000/api npm run dev -- --host localhost
```

On Windows PowerShell:

```powershell
npm ci
$env:VITE_API_BASE_URL = "http://127.0.0.1:8000/api"
npm run dev -- --host localhost
```

Open `http://localhost:5173`. If `VITE_API_BASE_URL` is not set, the app defaults to `http://127.0.0.1:8000/api`.

To have data to explore, generate the demo database in the backend (`python manage.py seed_demo`, see the API README) and sign in as `admin_demo`, `secretaria_demo`, `professor_demo` or `responsavel_demo` to see each role.

### Lint and build

```bash
npm run lint
npm run build
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API address, ending in `/api` |
| `VITE_API_TIMEOUT` | Request timeout in ms (default 60000, to give a free-tier server time to wake up) |
| `VITE_DEMO_MODE` | `true` shows the one-click demo login buttons and a fictional-data notice |
| `VITE_DEMO_PASSWORD` | Public password of the demo accounts (same as the API's `DEMO_PASSWORD`) |
| `VITE_DEV_MODE` | Relaxes CPF/RG validation when `true` (default `true`); set to `false` in production |

Never put secrets in `VITE_` variables: they are bundled into the browser. See [`.env.production`](.env.production) for the production build defaults.

## Technical highlights

- **Role-aware UI, server-side enforcement.** [`src/auth/papeis.ts`](src/auth/papeis.ts) mirrors the backend's permission rules only to hide menus and actions the user cannot use. The API remains the source of truth and enforces access on every endpoint.
- **Safe token refresh under concurrency.** The backend rotates refresh tokens on every use and blacklists the previous one, so [`src/api/axios.ts`](src/api/axios.ts) stores the new refresh token each time and makes simultaneous failed requests share a single in-flight refresh instead of racing each other.
- **Feature-based structure.** Each module (`alunos`, `turmas`, `matriculas`, `documentos`, ...) keeps its list, form, detail views and data hook under `src/features/`, with one API service per resource in `src/api/` and shared UI in `src/components/`.

## Deploying the demo

The frontend is published on Vercel; [`vercel.json`](vercel.json) rewrites all routes to `index.html` for client-side routing. Set the environment variables above in the Vercel project settings. The full step-by-step guide, together with deploying the API on Render, is in the backend repository's `DEPLOY.md`.

## License and authorship

Copyright (c) 2025 Danielle. See [LICENSE](LICENSE) for the terms of use. Commercial use requires prior written permission from the copyright holder. Do not add credentials, student data or private configuration to this repository.
