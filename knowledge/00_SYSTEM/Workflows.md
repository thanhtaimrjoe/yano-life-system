# AI Knowledge Workflows

## 1) Intake Workflow

Use when user drops new material into chat or `workspace/`.

Steps:
1. Identify domain and permanence level.
2. Check existing canonical notes before creating new files.
3. Preserve facts exactly.
4. Normalize into concise markdown.
5. Add links to related notes if obvious.
6. Ask only when ambiguity changes meaning or privacy level.

Output:
- updated file paths
- short summary of changes
- unresolved ambiguities

## 2) Normalization Workflow

Use when notes are rough but valuable.

Steps:
1. Remove formatting noise.
2. Add clear title and section headings.
3. Convert long paragraphs into scannable bullets where helpful.
4. Separate facts, interpretation, and next actions.
5. Keep original meaning intact.

Do not:
- invent missing data
- over-polish personal notes
- remove source-specific vocabulary unless redundant

## 3) Refactor Workflow

Use when folder or note structure becomes messy.

Steps:
1. Map current files and domains.
2. Identify duplicates, stale files, and misplaced notes.
3. Propose moves/merges before major restructure.
4. Move files with `git mv` when tracked.
5. Merge content only after preserving unique facts.
6. Update links and README files.
7. Verify with `git status` and file tree.

## 4) Project Knowledge Workflow

Use for `knowledge/06_PROJECTS/`.

Project folders may contain:
- `README.md`
- project overview
- architecture docs
- feature docs
- glossary
- workflows
- progress/history notes

When adding project knowledge:
1. Preserve project-specific terminology.
2. Keep architecture, features, progress, and interviews separated if useful.
3. Link reusable engineering concepts to `knowledge/04_SOFTWARE_DEVELOPMENT/` when appropriate.
4. Do not mix personal daily logs into project docs.

## 5) Archive Workflow

Use when content is no longer canonical but still useful.

Steps:
1. Confirm content is not active source of truth.
2. Move to `knowledge/99_ARCHIVE/` with original context preserved.
3. Add pointer from old canonical note if needed.
4. Do not delete unique knowledge unless user asks.

## 6) Weekly Maintenance Workflow

Optional routine for AI cleanup:
1. Check new files and untracked files.
2. Normalize obvious rough notes.
3. Suggest merges for duplicates.
4. Update domain README files if structure changed.
5. Report stale or ambiguous items.

## 7) Workspace Processing Workflow

`workspace/` is scratch input only.

Steps:
1. Inspect files locally.
2. Extract durable knowledge into `knowledge/` or life logs.
3. Leave raw workspace files untouched unless user asks.
4. Do not reference `workspace/` as permanent source of truth.

## 8) Safety Workflow

Before storing sensitive profile-level information:
1. Check if user explicitly asked to save it.
2. If not explicit, ask confirmation.
3. Store stable sensitive info in `00-profile/` only when appropriate.
4. Keep daily events in dated logs, not profile.
