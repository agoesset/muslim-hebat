#!/usr/bin/env bash
# fanout.sh — jalankan beberapa tugas agent secara paralel, masing-masing
# di worktree terisolasi, lalu laporkan hasil gate per tugas.
#
# Pemakaian:
#   ./scripts/fanout.sh tasks.tsv
#
# Format tasks.tsv (dipisah TAB, satu tugas per baris):
#   <branch>	<worker>	<scope>	<brief_file>
#
# Contoh:
#   feat/bookmark	codex	api	/tmp/brief_bookmark.txt
#   feat/darkmode	claude	web	/tmp/brief_darkmode.txt
#
# worker : codex | claude
# scope  : api | web | all   (dipakai agent-gate.sh)
#
# Setiap tugas: buat worktree -> jalankan worker -> jalankan gate -> lapor.
# Tidak ada commit/push otomatis. Review manusia tetap gerbang terakhir.

set -uo pipefail

TASKFILE="${1:?Pemakaian: fanout.sh <tasks.tsv>}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_ID="$(date +%Y%m%d-%H%M%S)"
LOGDIR="/tmp/fanout-$RUN_ID"
mkdir -p "$LOGDIR"

cd "$REPO"

echo "═══ FAN-OUT $RUN_ID ═══"
echo "repo    : $REPO"
echo "log     : $LOGDIR"
echo

PIDS=()
NAMES=()

run_task() {
  local branch="$1" worker="$2" scope="$3" brief="$4"
  local slug="${branch//\//-}"
  local wt="$REPO/.worktrees/$slug"
  local log="$LOGDIR/$slug.log"

  {
    echo "### TUGAS: $branch (worker=$worker scope=$scope)"

    if [ ! -f "$brief" ]; then
      echo "GAGAL: file brief tidak ditemukan: $brief"
      exit 1
    fi

    git worktree add "$wt" -b "$branch" >/dev/null 2>&1 || {
      echo "GAGAL: tidak bisa membuat worktree (branch sudah ada?)"
      exit 1
    }

    cd "$wt"
    ln -sf "$REPO/node_modules" node_modules
    ln -sf "$REPO/apps/web/node_modules" apps/web/node_modules
    ln -sf "$REPO/apps/api/node_modules" apps/api/node_modules
    cp "$REPO/apps/web/.env" apps/web/.env 2>/dev/null || true
    cp "$REPO/apps/api/.env" apps/api/.env 2>/dev/null || true

    echo "--- worker mulai $(date +%H:%M:%S)"
    case "$worker" in
      codex)
        codex exec --dangerously-bypass-approvals-and-sandbox \
          --skip-git-repo-check "$(cat "$brief")" 2>&1 | tail -40
        ;;
      claude)
        claude -p "$(cat "$brief")" --max-turns 35 \
          --allowedTools 'Read,Edit,Write,Bash' 2>&1 | tail -40
        ;;
      *)
        echo "GAGAL: worker tidak dikenal: $worker"
        exit 1
        ;;
    esac
    echo "--- worker selesai $(date +%H:%M:%S)"

    echo "--- gate: $scope"
    if ./scripts/agent-gate.sh "$scope" 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tail -15; then
      echo "GATE: LULUS"
    else
      echo "GATE: GAGAL"
    fi
  } > "$log" 2>&1
}

while IFS=$'\t' read -r branch worker scope brief; do
  [ -z "${branch:-}" ] && continue
  case "$branch" in \#*) continue ;; esac
  echo "▶ dispatch: $branch  ($worker, gate=$scope)"
  run_task "$branch" "$worker" "$scope" "$brief" &
  PIDS+=($!)
  NAMES+=("$branch")
done < "$TASKFILE"

echo
echo "menunggu ${#PIDS[@]} tugas selesai..."
echo

for i in "${!PIDS[@]}"; do
  wait "${PIDS[$i]}"
done

echo "═══ RINGKASAN ═══"
for name in "${NAMES[@]}"; do
  slug="${name//\//-}"
  log="$LOGDIR/$slug.log"
  if grep -q "^GATE: LULUS" "$log" 2>/dev/null; then
    printf '\033[32m  ✓ %-30s gate lulus\033[0m\n' "$name"
  elif grep -q "^GATE: GAGAL" "$log" 2>/dev/null; then
    printf '\033[31m  ✗ %-30s gate GAGAL\033[0m\n' "$name"
  else
    printf '\033[33m  ? %-30s tidak selesai\033[0m\n' "$name"
  fi
done

echo
echo "log lengkap: $LOGDIR/"
echo "worktree    : $REPO/.worktrees/"
echo
echo "Langkah berikutnya: review diff tiap worktree, lalu commit + PR manual."
