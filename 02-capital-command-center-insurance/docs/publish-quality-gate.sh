#!/usr/bin/env bash
# Pre-publish gate for agio-agentic-command-center-preview.html
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
FILE="$ROOT/agio-agentic-command-center-preview.html"
FAIL=0

die() { echo "FAIL: $1"; FAIL=1; }
pass() { echo "PASS: $1"; }

[[ -f "$FILE" ]] || { echo "Missing $FILE"; exit 1; }

if grep -q "premium financing" "$FILE"; then die 'found "premium financing"'; else pass 'no "premium financing"'; fi
if grep -q '<span class="pillar">Execute</span>' "$FILE"; then die 'Execute pillar present'; else pass 'no Execute pillar'; fi
if grep -qi 'optics' "$FILE"; then die 'found optics'; else pass 'no optics'; fi
if grep -qi 'watches' "$FILE"; then die 'found watches'; else pass 'no watches'; fi

# Banned vendor words
if grep -Eiq 'seamless|robust|unlock|leverage|cutting-edge|transformative|revolutionary' "$FILE"; then
  die 'banned vendor word present'
else
  pass 'no banned vendor words'
fi

if grep -Eiq 'CrewAI|Neo4j|Temporal' "$FILE"; then die 'buzzword stack remnant'; else pass 'POC stack cleaned'; fi

# Local optional name banlist (never commit real names into repo)
BANLIST="$ROOT/banned_names.local.txt"
if [[ -f "$BANLIST" ]]; then
  while IFS= read -r name || [[ -n "$name" ]]; do
    [[ -z "$name" || "$name" =~ ^# ]] && continue
    if grep -Fiq "$name" "$FILE"; then die "banned name: $name"; fi
  done < "$BANLIST"
  pass 'banned_names.local.txt clean'
fi

TM_COUNT=$(grep -o 'Agio Summit™' "$FILE" | wc -l | tr -d ' ')
if [[ "$TM_COUNT" -gt 2 ]]; then
  die "Agio Summit™ count=$TM_COUNT (expected ≤2)"
else
  pass "Agio Summit™ count=$TM_COUNT"
fi

if [[ "$FAIL" -ne 0 ]]; then
  echo "GATE FAILED"
  exit 1
fi
echo "GATE PASSED"
exit 0
