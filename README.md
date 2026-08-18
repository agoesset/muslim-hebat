# Muslim Hebat

Production-oriented monorepo for Muslim Hebat.

## Stack

- `apps/web`: React + Vite public site and admin UI
- `apps/api`: NestJS API
- `packages/shared`: shared types/constants
- PostgreSQL + Prisma
- Docker Compose (works with OrbStack on macOS) + Nginx for self-hosted production

## Local Setup

```sh
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Run web:

```sh
npm run dev:web
```

Run API:

```sh
npm run dev:api
```

Generate Prisma client:

```sh
npm run db:generate
```

Run migrations in production:

```sh
npm run db:migrate
```

Seed first admin and starter content:

```sh
npm run db:seed
```

Default seed admin is `admin@muslimhebat.local` with password `ChangeMe123!` unless overridden by env vars.

## Production (VPS + Docker)

Self-host with Docker Compose + Caddy (HTTPS). Full steps: [docs/vps.md](docs/vps.md).

```sh
cp .env.example .env
# fill SITE_HOST, ACME_EMAIL, JWT_SECRET, POSTGRES_PASSWORD
scripts/vps-deploy.sh
```

OrbStack users can use the same `docker compose` commands for local production-like runs.

Seed the production container after the first deploy (empty database only):

```sh
docker compose exec api npm run seed
```

Health check:

```sh
curl https://muslimhebat.com/health
curl https://muslimhebat.com/health/ready
```

Backup database:

```sh
scripts/backup-postgres.sh
```

Restore database:

```sh
scripts/restore-postgres.sh backups/file.sql
```

## Build Checks

```sh
npm run build
```
