#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
TODAY=$(date +%Y-%m-%d)
YEAR=$(date +%Y)
GYM_DIR="$REPO_DIR/02-gym/$YEAR"

LATEST_GYM=""
if [[ -d "$GYM_DIR" ]]; then
  LATEST_GYM=$(find "$GYM_DIR" -maxdepth 1 -type f -name '*.md' | sort | tail -n 1)
fi

if [[ -z "$LATEST_GYM" || ! -f "$LATEST_GYM" ]]; then
  osascript -e 'display notification "Không tìm thấy gym log gần nhất." with title "Gym Reminder ⚠️"' 2>/dev/null || true
  echo "Không tìm thấy gym log trong $GYM_DIR" >&2
  exit 1
fi

PROMPT="Dựa vào file 00-profile/routines.md và log buổi tập gần nhất của tôi, hãy tạo một plan tập gym hôm nay ($TODAY) tập trung vào Form và MMC.

Buổi tập gần nhất ($(basename "$LATEST_GYM")):
$(cat "$LATEST_GYM")

Hãy đưa ra lịch tập hôm nay, bao gồm: Target muscles, Machines used, Sets x Reps, và Form Cues. Viết ngắn gọn để tôi copy."

if command -v pbcopy >/dev/null 2>&1; then
  echo "$PROMPT" | pbcopy
  osascript -e 'display notification "Prompt plan tập gym đã được copy vào Clipboard. Dán vào ChatGPT nhé!" with title "Gym Reminder 🏋️‍♂️"' 2>/dev/null || true
else
  echo "$PROMPT"
fi
