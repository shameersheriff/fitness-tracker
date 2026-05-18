# Frontend

The frontend is a Vite React app with feature-based modules, a reusable layout shell,
TanStack Query for server state, Zustand for local preferences, React Hook Form for forms,
and Tailwind CSS for the design system.

## Architecture

- `src/app`: providers and app bootstrap
- `src/routes`: route definitions
- `src/components`: shared UI, layout, chart, and form primitives
- `src/features`: route-level domain screens
- `src/services`: Axios API client and endpoint wrappers
- `src/stores`: theme and client preference stores

## State

Server state is loaded through TanStack Query. Client-only preferences, such as theme, use
Zustand with local persistence.

## Forms

Forms use React Hook Form and Zod resolvers. Shared form controls live in
`src/components/forms`.

## Environment

`VITE_API_URL` points to the backend API root, defaulting to `http://localhost:4000/api/v1`.
