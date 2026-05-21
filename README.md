# Fitness Tracker

A production-oriented full-stack fitness tracking platform built with React, TypeScript,
Express, Prisma, and SQLite. The architecture is modular so it can grow into mobile apps,
cloud sync, recommendations, notifications, and multi-user SaaS features.

## Tech Stack

- Frontend: React, Vite, TypeScript, React Router, TanStack Query, Zustand, React Hook Form,
  Zod, Tailwind CSS, Axios, Recharts
- Backend: Node.js, Express, TypeScript, Prisma, Zod, Swagger/OpenAPI, Jest, Supertest
- Database: SQLite through Prisma, with a schema designed for future PostgreSQL/MySQL/MSSQL
  migrations
- Tooling: pnpm workspaces, ESLint, Prettier, Husky, lint-staged, Docker

## Monorepo Layout

```txt
apps/
  frontend/       React application
  backend/        Express REST API
packages/
  shared-types/   Shared DTOs, enums, and API response types
  eslint-config/  Workspace ESLint config
  ts-config/      Shared TypeScript configs
docs/             Architecture and API notes
```

## Setup

```bash
pnpm install
cp apps/backend/.env.example apps/backend/.env
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Frontend runs on `http://localhost:5173`; backend runs on `http://localhost:4000`.

## Common Commands

```bash
pnpm build
pnpm lint
pnpm test
pnpm typecheck
pnpm db:migrate
pnpm db:seed
```

## API Overview

All API routes are versioned under `/api/v1`. Swagger documentation is exposed at
`/api/docs` when the backend is running.

Core modules include workouts, workout types, schedules, workout sessions, meals,
nutrition goals, body progress, habits, dashboard summaries, analytics, and settings.

## Git Workflow

Use conventional commits and commit after meaningful milestones:

```bash
git add .
git commit -m "feat: add workout management module"
```

## Documentation

- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Development](docs/development.md)
