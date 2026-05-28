# Yano Life System

Private markdown second-brain cho Yano. Dùng 2 layers:
- **Life Tracking** — gym, meals, sleep, mood, daily/weekly logs
- **Knowledge** — durable notes, project knowledge, AI workflows

## Entry points cho AI

Đọc theo thứ tự khi onboard:

1. [`CLAUDE.md`](CLAUDE.md) — rules & workflow cho Claude Code
2. [`AGENTS.md`](AGENTS.md) — rules cho Codex / other agents (sync với CLAUDE.md)
3. [`AI-REPO-ONBOARDING.md`](AI-REPO-ONBOARDING.md) — Vietnamese context + coaching tone
4. [`00-profile/`](00-profile/) — identity, goals, AI behavior context
5. [`knowledge/00_SYSTEM/`](knowledge/00_SYSTEM/) — knowledge governance docs

## Folder map

```text
00-profile/          Personal identity, goals, routines + AI context
01-daily/            Daily life logs (YYYY/YYYY-MM-DD.md)
02-gym/              Gym session logs (YYYY/YYYY-MM-DD-dayX.md)
03-meals/            Meal logs (YYYY/YYYY-MM-DD.md)
04-weekly-review/    Weekly reviews + training plans (YYYY-W##.md, YYYY-W##-plan.md)
05-career-prep/      Time-boxed BrSE/interview prep (YYYY/...)
99-templates/        Reusable markdown templates
knowledge/           Durable knowledge layer (governed by 00_SYSTEM/)
dashboard/           Local web dashboard (run via `node server.js`)
workspace/           Gitignored scratch / cron logs (not source of truth)
```

## Quick reference: "log gì vào đâu?"

| User intent                  | Folder + template                                      |
| ---------------------------- | ------------------------------------------------------ |
| Daily summary                | `01-daily/YYYY/` + `99-templates/daily-template.md`    |
| Gym session                  | `02-gym/YYYY/` + `99-templates/gym-template.md`        |
| Meal log                     | `03-meals/YYYY/` + `99-templates/meal-template.md`     |
| Weekly review                | `04-weekly-review/` + `weekly-review-template.md`      |
| Career-prep daily            | `05-career-prep/YYYY/daily/` + `career-prep-daily-template.md` |
| Mock interview prep          | `05-career-prep/YYYY/mock-interviews/` + `mock-interview-template.md` |
| Durable knowledge note       | `knowledge/<domain>/` — đọc `knowledge/00_SYSTEM/Knowledge-Organization.md` trước |
| Project working notes        | `knowledge/06_PROJECTS/<project>/working-notes.md`     |

## Dashboard

Run `node server.js` → `http://localhost:3000`. Zero-dependency Node server compiles markdown vào `dashboard/data.json` mỗi lần F5.

## Privacy

Repo này chứa data cá nhân (mental health, body, routines). Không bao giờ public, không paste sang external services.
