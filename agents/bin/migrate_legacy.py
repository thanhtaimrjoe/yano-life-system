#!/usr/bin/env python3
import os
import json
import uuid
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Cấu hình
ROOT_DIR = Path(os.path.dirname(os.path.abspath(__file__))).parent.parent
LEGACY_DIR = ROOT_DIR / "legacy"
LOG_DIR = ROOT_DIR / "log"
JST = timezone(timedelta(hours=9))

def parse_date_from_filename(filename):
    # Tìm YYYY-MM-DD trong tên file
    match = re.search(r'(\d{4}-\d{2}-\d{2})', filename)
    if match:
        return match.group(1)
    return None

def extract_content(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        return f"Error reading file: {e}"

def convert_legacy_files():
    mappings = {
        "01-daily": "daily",
        "02-gym": "gym",
        "03-meals": "meal",
        "05-career-prep/daily": "career",
        "04-weekly-review": "note"
    }

    count = 0
    for legacy_folder, event_type in mappings.items():
        folder_path = LEGACY_DIR / legacy_folder
        if not folder_path.exists():
            continue

        for filepath in folder_path.rglob("*.md"):
            date_str = parse_date_from_filename(filepath.name)
            if not date_str:
                continue
                
            # Tạo timestamp lúc 12:00 trưa JST cho an toàn
            ts = f"{date_str}T12:00:00+09:00"
            content = extract_content(filepath)
            
            # Vì parser không thể bóc tách cấu trúc MD cũ chính xác 100%, 
            # ta gom raw text vào type "note" với tag migration để ko mất data,
            # hoặc ép kiểu schema lỏng lẻo. 
            # Ở đây dùng type event_type nhưng nhét raw content vào field "raw_migration" 
            # để ông có thể lọc lại sau.
            
            event = {
                "id": str(uuid.uuid4()),
                "ts": ts,
                "type": event_type,
                "src": "migration",
                "v": 1,
                "data": {
                    "_raw_migration_source": str(filepath.relative_to(ROOT_DIR)),
                    "_raw_content": content[:1000] + ("..." if len(content) > 1000 else "") 
                    # Cắt ngắn 1000 char để file jsonl ko bị phình quá to, nếu cần full thì bỏ slice
                }
            }
            
            # Xác định file log đích
            year = date_str[:4]
            month = date_str[:7]
            dest_log_file = LOG_DIR / year / f"{month}.jsonl"
            
            dest_log_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(dest_log_file, "a", encoding="utf-8") as f:
                f.write(json.dumps(event, ensure_ascii=False) + "\n")
            
            count += 1

    print(f"✅ Đã migrate thành công {count} files từ legacy/ sang log/ theo chuẩn JSONL.")

if __name__ == '__main__':
    convert_legacy_files()
