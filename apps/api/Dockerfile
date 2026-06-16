FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci

FROM deps AS api-build
COPY apps/api apps/api
COPY packages/shared packages/shared
RUN npm run db:generate
RUN npm run build -w @muslim-hebat/api

FROM deps AS web-build
ARG VITE_API_BASE_URL=/api
ARG VITE_SITE_URL=http://localhost
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SITE_URL=${VITE_SITE_URL}
COPY apps/web apps/web
COPY packages/shared packages/shared
RUN npm run build -w @muslim-hebat/web

FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=prod-deps /app/apps/api/node_modules apps/api/node_modules
COPY --from=api-build /app/node_modules/.prisma node_modules/.prisma
COPY --from=api-build /app/node_modules/@prisma/client node_modules/@prisma/client
COPY --from=api-build /app/apps/api/dist apps/api/dist
COPY --from=api-build /app/apps/api/prisma apps/api/prisma
COPY --from=web-build /app/apps/web/dist apps/api/dist/src/public
COPY package.json package.json
COPY apps/api/package.json apps/api/package.json
WORKDIR /app/apps/api
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
