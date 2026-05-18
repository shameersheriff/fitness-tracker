# Development

## Environment

Copy `.env.example` to `.env`, then adjust ports or database path as needed.

## Database

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

The initial database uses SQLite. Domain ownership fields are prepared for future
authentication and tenant isolation.

## Quality Gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Docker

```bash
docker compose up --build
```

The frontend container serves the static build with nginx. The backend container runs the
Express API.
