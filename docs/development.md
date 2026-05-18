# Development

## Environment

Copy `.env.example` to `.env`, then adjust ports or database path as needed.

## Database

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

The initial database uses SQLite. Domain ownership fields are prepared for future
authentication and tenant isolation.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Docker

```bash
docker compose up --build
```

The frontend container serves the static build with nginx. The backend container runs the
Express API.
