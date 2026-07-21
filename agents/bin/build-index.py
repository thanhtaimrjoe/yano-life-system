#!/usr/bin/env python3
import os
import json
import sqlite3
from pathlib import Path

ROOT = Path(os.path.dirname(os.path.abspath(__file__))).parent.parent
LOG_DIR = ROOT / "log"
INDEX_DIR = ROOT / ".index"
DB_PATH = INDEX_DIR / "life.db"

def build_index():
    INDEX_DIR.mkdir(exist_ok=True)
    
    # Drop and recreate db
    if DB_PATH.exists():
        DB_PATH.unlink()
        
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    c.executescript('''
        CREATE TABLE events(id TEXT PRIMARY KEY, ts TEXT NOT NULL, type TEXT NOT NULL, src TEXT, v INT, data TEXT NOT NULL);
        CREATE INDEX ix_type_ts ON events(type, ts);
        CREATE VIEW v_daily AS SELECT ts, json_extract(data,'$.sleep_h') sleep_h, json_extract(data,'$.caffeine_mg') caffeine_mg FROM events WHERE type='daily';
        CREATE VIEW v_cbt AS SELECT ts, json_extract(data,'$.severity') severity, json_extract(data,'$.trigger') trigger, json_extract(data,'$.outcome') outcome FROM events WHERE type='cbt';
    ''')
    
    count = 0
    for file_path in LOG_DIR.rglob("*.jsonl"):
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip(): continue
                try:
                    ev = json.loads(line)
                    c.execute("INSERT INTO events (id, ts, type, src, v, data) VALUES (?, ?, ?, ?, ?, ?)",
                              (ev.get("id"), ev.get("ts"), ev.get("type"), ev.get("src"), ev.get("v"), json.dumps(ev.get("data", {}))))
                    count += 1
                except Exception as e:
                    print(f"Error parsing line in {file_path}: {e}")
                    
    conn.commit()
    conn.close()
    print(f"Index built successfully at .index/life.db with {count} events.")

if __name__ == '__main__':
    build_index()
