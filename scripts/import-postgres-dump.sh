#!/bin/sh
set -eu

DUMP="${1:?usage: $0 path/to/heroku.dump}"

if [ ! -f "$DUMP" ]; then
  echo "File not found: $DUMP" >&2
  exit 1
fi

echo "Importing $DUMP into the postgres container..."
docker compose exec -T postgres pg_restore \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  -U "${POSTGRES_USER:-muslim_hebat}" \
  -d "${POSTGRES_DB:-muslim_hebat}" \
  < "$DUMP"

echo "Running Prisma migrations..."
docker compose exec api npx prisma migrate deploy

echo "Done."
