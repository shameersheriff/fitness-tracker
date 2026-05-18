FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml .npmrc ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/ts-config/package.json packages/ts-config/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
RUN pnpm install --no-frozen-lockfile

FROM deps AS build
WORKDIR /app
COPY . .
RUN pnpm --filter @fitness-tracker/shared-types build
RUN pnpm --filter @fitness-tracker/frontend build

FROM nginx:1.27-alpine
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
