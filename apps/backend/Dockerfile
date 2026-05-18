FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml .npmrc ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/ts-config/package.json packages/ts-config/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
RUN pnpm install --no-frozen-lockfile

FROM deps AS build
WORKDIR /app
COPY . .
RUN pnpm --filter @fitness-tracker/backend db:generate
RUN pnpm --filter @fitness-tracker/shared-types build
RUN pnpm --filter @fitness-tracker/backend build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma
WORKDIR /app/apps/backend
EXPOSE 4000
CMD ["node", "dist/src/server.js"]
