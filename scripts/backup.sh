#!/usr/bin/env bash
set -euo pipefail

# Automated Postgres backup for Muslim Hebat
# Usage: BACKUP_DIR=/backups RETENTION_DAYS=7 ./backup.sh

BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
DB="${POSTGRES_DB:-muslim_hebat}"
USER="${POSTGRES_USER:-muslim_hebat}"
PASS="${POSTGRES_PASSWORD:-change-me}"
HOST="${POSTGRES_HOST:-postgres}"
PORT="${POSTGRES_PORT:-5432}"
LABEL="${BACKUP_LABEL:-scheduled}"

mkdir -p "$BACKUP_DIR"

TS=$(date +%Y%m%d_%H%M%S)
FILE="$BACKUP_DIR/${DB}_${LABEL}_${TS}.sql.gz"

echo "[backup] starting dump to $FILE"
PGPASSWORD="$PASS" pg_dump -h "$HOST" -p "$PORT" -U "$USER" -d "$DB" --no-owner --clean --if-exists | gzip > "$FILE"

echo "[backup] dumped $DB -> $FILE ($(du -h "$FILE" | cut -f1))"

# Rotate old backups
find "$BACKUP_DIR" -maxdepth 1 -type f -name "${DB}_${LABEL}_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
echo "[backup] retention: removed dumps older than $RETENTION_DAYS days"
