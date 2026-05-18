# Architecture

The platform is organized as a TypeScript monorepo with isolated applications and shared
packages. The backend follows layered modular architecture, while the frontend follows
feature-based composition.

## Backend Layers

Requests flow through route definitions, validation middleware, controllers, services,
repositories, and Prisma. Controllers only translate HTTP concerns. Services own business
rules. Repositories isolate persistence details and keep Prisma usage out of feature
controllers.

## Frontend Layers

The React app uses a reusable shell, route-level pages, feature modules, shared UI
components, API service modules, and lightweight Zustand stores for client-only preferences.
Server state is handled with TanStack Query.

## Multi-user Readiness

Authentication is intentionally thin in the first build. The API accepts a future `x-user-id`
context boundary and the schema already models nullable user ownership across domain records.
That keeps local single-user workflows simple without blocking JWT/RBAC later.

## Database Portability

Prisma abstracts SQLite for local development. The schema uses normalized relations, explicit
indexes, timestamps, soft-delete fields where useful, and relation names that can migrate to
PostgreSQL, MySQL, or MSSQL with minimal application-layer changes.
