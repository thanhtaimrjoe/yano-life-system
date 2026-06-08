# Gym Notion Migration Workflow

Purpose: keep local gym logs in `02-gym/YYYY/` synced into the Notion database `Gym Sessions 2026`.

Use this workflow after creating or updating any gym log, including rest days, when the Notion connector is available or the user asks for Notion sync.

## Source Of Truth

- Local markdown in `02-gym/YYYY/YYYY-MM-DD-dayX.md` is the source of truth.
- Notion is the mirrored database view for browsing and filtering.
- Do not invent missing health, sleep, recovery, or nutrition data during migration.
- Rest days are valid gym records when the local `02-gym/` sequence counts them.

## Extract

Use lightweight local tools:

1. Identify changed `02-gym/` files.
2. Verify filename, frontmatter `date`, and frontmatter `day` agree.
3. Verify day sequence around the edited dates.
4. Run `node build-data.js` before migration.

For rest days:

- `focus: rest`
- `machines_used: []`
- `duration_min: 0`
- `rpe_avg:` blank
- `recovery_status: not logged` unless the user logged more detail

## Notion Upsert

Use the Notion connector:

1. Search for database `Gym Sessions 2026`.
2. Fetch the database and use the returned data source, usually `collection://...`.
3. Read the live schema before mapping properties.
4. Search inside the data source by exact `Source File`.
5. If no exact source-file result is found, search by exact `Date` and title/date.
6. Update the existing page when a match exists.
7. Create a new page only when no matching page exists.

Current known property mapping:

| Local field | Notion property |
| --- | --- |
| title / date / day | `Name` |
| `date` | `date:Date:start`, `date:Date:is_datetime` |
| `focus` | `Focus` |
| `machines_used` / exercise names | `Exercises` |
| `rpe_avg` | `RPE Avg` |
| `recovery_status` | `Recovery` |
| local path | `Source File` |
| `duration_min` | `Duration Min` |

Recovery mapping:

- `good` -> `good`
- `moderate` -> `moderate`
- `fatigued` -> `fatigued`
- blank / unknown / `not logged` -> `not logged`
- `cautious` -> `moderate`, with the original `cautious` context preserved in page content

Exercise mapping:

- Use exact Notion multi-select option names from the fetched schema.
- If the local name is a near-match, map to the existing option and keep the original wording in page content.
- Example: `Chest Supported Row` -> `Chest Supported Row Machine`.
- Do not create new options unless the user asks or the schema clearly supports it.

## Content Format

Mirror the local markdown body into the Notion page content with:

1. Session Summary
2. Warm-up & Readiness, if present
3. Main Session table, if present
4. Recovery / Nutrition / Notes sections, if present
5. Movement Quality & Insights, if present
6. AI Coaching Notes, if present
7. Source file note

For rest days, keep content short:

```markdown
## Session Summary
- No training session today.
- Rest day for recovery.

## Source
- Repo file: `02-gym/YYYY/YYYY-MM-DD-dayX.md`
```

## Verify

After Notion changes:

1. Fetch updated page(s).
2. Confirm `Name`, `Date`, `Focus`, `Recovery`, and `Source File`.
3. Confirm day numbering has no duplicates.
4. Report Notion page links and any schema compromises to the user.
