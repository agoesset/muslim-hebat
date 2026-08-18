#!/bin/sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f .env ]; then
  echo "Missing .env. Copy .env.example and fill every secret first." >&2
  exit 1
fi

docker compose pull
docker compose up --build -d
docker compose ps
echo
echo "Health:"
curl -fsS "http://127.0.0.1/health" || curl -kfsS "https://127.0.0.1/health" || true
echo
echo "Ready:"
curl -fsS "http://127.0.0.1/health/ready" || true
echo
