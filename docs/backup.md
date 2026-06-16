# Database Backup & Restore

Automated daily backups run via a dedicated `backup` container using `pg_dump`.

## Configuration

Set via environment variables or `.env`:

```bash
BACKUP_SCHEDULE=0 2 * * *      # default: 02:00 Asia/Jakarta
BACKUP_RETENTION_DAYS=7        # keep 7 days of dumps
```

The backup container inherits Postgres credentials from `docker-compose.yml`.

## Manual backup

```bash
docker compose exec backup /app/backup.sh
```

## List backups

```bash
docker compose exec backup ls -la /backups
```

## Restore

**Warning: restore overwrites the target database.**

```bash
docker compose down api web
docker compose exec -T backup /app/restore.sh /backups/muslim_hebat_scheduled_YYYYMMDD_HHMMSS.sql.gz
docker compose up -d api web
```

## Local backup without Docker

```bash
./scripts/backup.sh
```
