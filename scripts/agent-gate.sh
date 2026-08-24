#!/usr/bin/env bash
# agent-gate.sh — gerbang kualitas tunggal untuk semua agent.
# Jalankan dari root repo. Exit 0 hanya bila SEMUA lulus.
#
# Pemakaian:
#   ./scripts/agent-gate.sh          # gate penuh (api + web)
#   ./scripts/agent-gate.sh api      # hanya backend
#   ./scripts/agent-gate.sh web      # hanya frontend

set -uo pipefail

SCOPE="${1:-all}"
FAILED=()
PASSED=()

run_step() {
  local label="$1"; shift
  printf '\n\033[1m▶ %s\033[0m\n' "$label"
  if "$@" > /tmp/gate_step.log 2>&1; then
    printf '\033[32m  ✓ lulus\033[0m\n'
    PASSED+=("$label")
  else
    printf '\033[31m  ✗ GAGAL\033[0m\n'
    tail -20 /tmp/gate_step.log | sed 's/^/    /'
    FAILED+=("$label")
  fi
}

# Prisma Client wajib ter-generate sebelum typecheck apa pun.
# Tanpa ini: TS2305 Module '@prisma/client' has no exported member.
printf '\033[1m▶ Prisma generate\033[0m\n'
if npm run db:generate > /tmp/gate_step.log 2>&1; then
  printf '\033[32m  ✓ lulus\033[0m\n'
else
  printf '\033[31m  ✗ GAGAL — gate dihentikan\033[0m\n'
  tail -20 /tmp/gate_step.log | sed 's/^/    /'
  exit 1
fi

if [ "$SCOPE" = "all" ] || [ "$SCOPE" = "api" ]; then
  run_step "api · lint"      npm run lint      -w @muslim-hebat/api
  run_step "api · typecheck" npm run typecheck -w @muslim-hebat/api
  run_step "api · test"      npm run test      -w @muslim-hebat/api
  run_step "api · build"     npm run build     -w @muslim-hebat/api
fi

if [ "$SCOPE" = "all" ] || [ "$SCOPE" = "web" ]; then
  run_step "web · lint"      npm run lint      -w @muslim-hebat/web
  run_step "web · typecheck" npm run typecheck -w @muslim-hebat/web
  run_step "web · test"      npm run test      -w @muslim-hebat/web
  run_step "web · build"     npm run build     -w @muslim-hebat/web
fi

printf '\n\033[1m═══ RINGKASAN ═══\033[0m\n'
printf '\033[32mLulus : %d\033[0m\n' "${#PASSED[@]}"

if [ ${#FAILED[@]} -eq 0 ]; then
  printf '\033[32m\n✓ SEMUA GATE LULUS — aman untuk commit\033[0m\n'
  exit 0
fi

printf '\033[31mGagal : %d\033[0m\n' "${#FAILED[@]}"
for f in "${FAILED[@]}"; do printf '\033[31m  - %s\033[0m\n' "$f"; done
printf '\033[31m\n✗ GATE GAGAL — jangan commit sebelum semua hijau\033[0m\n'
exit 1
