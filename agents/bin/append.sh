#!/usr/bin/env bash
# The ONLY write path to log/. Usage: append.sh '<json-event>'
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
LINE="$(echo "$1" | jq -ce '.id //= input' <(uuidgen | jq -R .))"
echo "$LINE" | jq -e 'has("ts") and has("type") and has("src") and has("data")' >/dev/null
# strict mode: echo "$LINE" | check-jsonschema --schemafile "$ROOT/log/schema/event.schema.json" -
TS=$(echo "$LINE" | jq -r .ts)
F="$ROOT/log/${TS:0:4}/${TS:0:7}.jsonl"
mkdir -p "$(dirname "$F")"
exec 9>>"$F"; flock 9                # serialize concurrent local agents
printf '%s\n' "$LINE" >&9
