FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/ts-config/package.json packages/ts-config/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
RUN npm install

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build --workspace apps/frontend

FROM nginx:1.27-alpine
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
