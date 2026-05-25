#!/usr/bin/env sh
set -eu

mkdir -p backups
docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-muslim_hebat}" "${POSTGRES_DB:-muslim_hebat}" > "backups/muslim-hebat-$(date +%Y%m%d-%H%M%S).sql"
