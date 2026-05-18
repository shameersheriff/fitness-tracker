# Backend

The backend is an Express REST API using TypeScript, Prisma, Zod validation, and layered
modules. Each domain module separates routes, controllers, services, repositories,
validators, DTOs, entities, types, and tests.

## Layers

- Routes define HTTP endpoints and attach validation.
- Controllers translate request/response details.
- Services own business rules and orchestration.
- Repositories isolate Prisma persistence operations.
- Middleware centralizes security, validation, user context, errors, and not-found handling.

## Prisma

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

The default SQLite datasource is `file:./dev.db` under `apps/backend/prisma`.

## Validation

Zod schemas validate request params, query strings, and bodies before controllers run.
DTO types are inferred from those schemas to keep the API contract strict.

## Security

Helmet, CORS, rate limiting, request body limits, and centralized error handling are enabled
by default. Authentication is intentionally prepared but not enforced in this first local
single-user build.

## API Docs

Swagger UI is served at `/api/docs`.
