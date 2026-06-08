# Codex Adapter

Use this adapter when running workflows through Codex.

## Tier Mapping

| Shared tier | Codex mapping |
| --- | --- |
| Lightweight | Shell tools such as `rg`, `Get-ChildItem`, parsers, or a mini subagent for clearly large extraction |
| Balanced | Everyday Codex model for markdown/code edits |
| Reasoning | Main reasoning model or frontier subagent for heavy synthesis |

Do not spawn subagents for small tasks. In Codex, local shell reads are often cheaper and clearer than delegation.

## Default Codex Workflow

1. Use shell tools to locate candidate files.
2. Read only the relevant files.
3. Extract compact facts locally.
4. Use reasoning on the compact facts, not raw dumps.
5. Write files with `apply_patch`.
6. Run local verification commands.
7. Report changed paths and verification results.

## Delegation Rules

Spawn a subagent only when the user explicitly asks for delegation/parallel agent work, or when the active Codex environment allows it and the task is clearly heavy enough to justify the overhead.

Good Codex delegation targets:

- Broad independent searches across many folders.
- Separate extraction tasks for gym, daily, meals, and career prep.
- Independent verification while the main agent continues editing.

Keep local:

- Single-file updates.
- Simple log creation.
- Small grep/read tasks.
- Anything requiring immediate next-step decisions.

## Weekly Gym Review in Codex

Recommended implementation:

1. Search `02-gym/YYYY/` for week dates.
2. Search `01-daily/YYYY/` for the same week if sleep, mood, stress, DOMS, or recovery are needed.
3. Search `03-meals/YYYY/` only if nutrition is in scope.
4. Extract into the shared schemas or an equivalent compact JSON object.
5. Analyze conservatively.
6. Update or create `04-weekly-review/YYYY-W##.md`.
7. Run `node build-data.js`.

Codex should not call Gemini/GCP scripts unless the user specifically wants that provider pipeline.

## Gym Notion Migration in Codex

After editing `02-gym/YYYY/` logs, use `workflows/gym-notion-migration.md` when Notion access is available or the user asks to sync Notion.

Recommended implementation:

1. Verify the local source files and day numbering with shell tools.
2. Run `node build-data.js`.
3. Use the Notion connector to search/fetch `Gym Sessions 2026`.
4. Fetch the database/data source schema before creating or updating pages.
5. Search inside the data source by `Source File` first, then by `Date`.
6. Update existing pages when found; create only when no matching page exists.
7. Keep rest days as valid gym-session records with `duration_min: 0`, no exercises, and `focus: rest`.
