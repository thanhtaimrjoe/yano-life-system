# AI Knowledge Workflows

## 1) Intake Workflow

Use when user drops new material into chat or `workspace/`.

Steps:
1. Identify source type: chat, pasted text, file, project docs, or scratch material.
2. Decide permanence level: temporary, durable knowledge, or life-tracking log.
3. Route to likely canonical domain.
4. Check existing canonical notes before creating new files.
5. Preserve facts exactly.
6. Normalize into concise markdown.
7. Add links to related notes if obvious.
8. Ask only when ambiguity changes meaning, scope, or privacy level.

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
5. Add minimal metadata if helpful.
6. Keep original meaning intact.

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
8. Summarize structural rationale for future AI continuity.

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

## 5) Retrieve & Answer Workflow

Use when user asks a question and wants answer from repository knowledge.

Steps:
1. Clarify question scope: direct fact lookup, comparison, explanation, or synthesis.
2. Search likely canonical folders first.
3. Identify most relevant notes and prioritize canonical files over duplicates.
4. Extract facts, decisions, examples, and unresolved ambiguities from source notes.
5. Distinguish clearly between:
   - explicit repository facts
   - reasonable inference
   - missing information
6. Answer directly in user-friendly form.
7. If retrieval exposed organizational gaps, optionally propose follow-up cleanup or synthesis note.

Output:
- direct answer
- file paths used
- uncertainty or missing context if relevant

## 6) Synthesis Workflow

Use when multiple notes together form higher-value understanding than any one note alone.

Typical triggers:
- repeated related notes across same domain
- user asks for summary, pattern, comparison, or lessons learned
- project folder has many fragmented notes with no overview
- AI detects stable cluster worth consolidating

Steps:
1. Define synthesis scope and target audience.
2. Gather source notes from canonical locations.
3. Separate repeated facts from unique insights.
4. Group information into meaningful themes, patterns, or decisions.
5. Write concise synthesis note with:
   - summary
   - major themes
   - key takeaways
   - open questions or gaps
   - links to source notes
6. Store synthesis note in most useful canonical location.
7. Update related README or source notes if synthesis becomes new navigation entry.

Do not:
- replace source notes when synthesis only summarizes them
- collapse conflicting ideas without marking tension
- invent conclusions unsupported by sources

## 7) Archive Workflow

Use when content is no longer canonical but still useful.

Steps:
1. Confirm content is not active source of truth.
2. Move to `knowledge/99_ARCHIVE/` with original context preserved.
3. Add pointer from old canonical note if needed.
4. Do not delete unique knowledge unless user asks.

## 8) Weekly Maintenance Workflow

Optional routine for AI cleanup:
1. Check new files and untracked files.
2. Normalize obvious rough notes.
3. Suggest merges for duplicates.
4. Update domain README files if structure changed.
5. Report stale or ambiguous items.
6. Flag synthesis opportunities if note clusters are emerging.

## 9) Workspace Processing Workflow

`workspace/` is scratch input only.

Steps:
1. Inspect files locally.
2. Extract durable knowledge into `knowledge/` or life logs.
3. Leave raw workspace files untouched unless user asks.
4. Do not reference `workspace/` as permanent source of truth.

## 10) Safety Workflow

Before storing sensitive profile-level information:
1. Check if user explicitly asked to save it.
2. If not explicit, ask confirmation.
3. Store stable sensitive info in `00-profile/` only when appropriate.
4. Keep daily events in dated logs, not profile.
