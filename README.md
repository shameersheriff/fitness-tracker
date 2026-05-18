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
- Tooling: npm workspaces, ESLint, Prettier, Husky, lint-staged, Docker

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
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend runs on `http://localhost:5173`; backend runs on `http://localhost:4000`.

## Common Commands

```bash
npm run build
npm run lint
npm run test
npm run typecheck
npm run db:migrate
npm run db:seed
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
