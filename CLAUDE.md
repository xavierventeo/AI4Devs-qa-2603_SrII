# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LTI (Talent Tracking System) is a full-stack ATS (Applicant Tracking System). The backend is a TypeScript/Express API using Prisma ORM with PostgreSQL; the frontend is a React + Bootstrap SPA bootstrapped with Create React App.

## Commands

### Database (run from project root)
```sh
docker-compose up -d          # Start PostgreSQL container
docker-compose down           # Stop container
```

### Backend (run from `backend/`)
```sh
npm install
npm run dev                   # Dev server with hot reload (ts-node-dev)
npm run build                 # Compile TypeScript → dist/
npm start                     # Run compiled output
npm test                      # Run all Jest tests
npx jest path/to/file.test.ts # Run a single test file
npx prisma generate           # Regenerate Prisma client after schema changes
npx prisma migrate dev        # Apply migrations and update DB
ts-node prisma/seed.ts        # Seed the database
```

### Frontend (run from `frontend/`)
```sh
npm install
npm start                     # Dev server on http://localhost:3000
npm run build                 # Production build
npm test                      # Run Jest tests
```

### Cypress E2E (run from `frontend/`)
```sh
npx cypress open              # Open Cypress GUI (interactive)
npx cypress run               # Run all E2E tests headlessly
npx cypress run --spec "cypress/e2e/foo.cy.js"  # Run a single spec
```

Cypress 15 (installed as devDependency). Config at `frontend/cypress.config.js`. Test files under `frontend/cypress/e2e/**/*.cy.js`. Support files under `frontend/cypress/support/`.

**Ports:** Backend on `3010`, frontend on `3000`. CORS is configured to allow only `http://localhost:3000`.

## Architecture

### Backend — Layered DDD

```
routes/          → Express Router definitions (thin, delegates to controllers)
presentation/
  controllers/   → HTTP request/response handling; calls application services
application/
  services/      → Business use cases (candidateService, positionService, fileUploadService)
  validator.ts   → Input validation for candidate data
domain/
  models/        → Active-record-style domain classes (Candidate, Application, Position, …)
                   Each model owns its own Prisma queries (save(), findOne(), etc.)
```

The `PrismaClient` instance is attached to every Express `Request` as `req.prisma` via middleware in `src/index.ts`, but the domain models also instantiate their own `PrismaClient` directly — both patterns coexist.

Key models: `Candidate`, `Application`, `Position`, `InterviewFlow`, `InterviewStep`, `Interview`, `Employee`, `Company`.

API spec lives at `backend/api-spec.yaml`. Data model docs at `backend/ModeloDatos.md`.

### Frontend — React SPA

Routes (React Router v6):
- `/` → `RecruiterDashboard` — lists open positions
- `/positions` → `Positions` — position list
- `/positions/:id` → `PositionDetails` — kanban board with candidates per interview stage (drag-and-drop via `react-beautiful-dnd`)
- `/add-candidate` → `AddCandidateForm` — multi-section candidate creation form

API calls are centralised in `frontend/src/services/candidateService.js`.

### Testing

Backend tests use Jest + ts-jest. The existing tests mock `@prisma/client` and service dependencies with `jest.mock()`. Test files sit alongside the source files they test (`.test.ts` suffix).

Frontend tests use `@testing-library/react`.

## Environment

Copy `.env` from root into `backend/.env` if needed. Required vars:
```
DB_PASSWORD, DB_USER, DB_NAME, DB_PORT, DATABASE_URL
```

The Prisma schema (`backend/prisma/schema.prisma`) also has a hardcoded fallback URL — update it or rely on the env var.
