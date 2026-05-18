FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/ts-config/package.json packages/ts-config/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
RUN npm install

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run db:generate --workspace apps/backend
RUN npm run build --workspace apps/backend

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma
WORKDIR /app/apps/backend
EXPOSE 4000
CMD ["node", "dist/src/server.js"]
