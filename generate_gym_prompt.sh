#!/bin/bash
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
TODAY=$(date +%Y-%m-%d)
YEAR=$(date +%Y)
LATEST_GYM=$(ls -1 "$REPO_DIR/02-gym/$YEAR"/*.md 2>/dev/null | sort | tail -n 1)

PROMPT="Dựa vào file profile/routines.md và log buổi tập gần nhất của tôi, hãy tạo một plan tập gym hôm nay ($TODAY) tập trung vào Form và MMC.

Buổi tập gần nhất:
$(cat "$LATEST_GYM")

Hãy đưa ra lịch tập hôm nay, bao gồm: Target muscles, Machines used, Sets x Reps, và Form Cues. Viết ngắn gọn để tôi copy."

echo "$PROMPT" | pbcopy

osascript -e 'display notification "Prompt plan tập gym đã được copy vào Clipboard. Dán vào ChatGPT nhé!" with title "Gym Reminder 🏋️‍♂️"'
