# Knowledge Organization

## Purpose

This document defines how AI should organize, name, connect, and maintain permanent knowledge inside `knowledge/`.

It answers:
- what belongs in each domain
- how files should be named
- what metadata is useful
- how notes should link to each other
- how domain README files should be maintained
- how AI should preserve long-term order as repository grows

## 1) Core Organization Principles

1. **One canonical home per note**
   - Every durable note should have one primary location.
   - Avoid storing same concept in multiple domains unless cross-domain duplication is intentional and lightweight.

2. **Structure should help retrieval**
   - Organize for future search, summarization, and reuse.
   - Prefer categories that make routing obvious for another AI.

3. **Notes should remain maintainable**
   - Small enough to scan
   - Clear enough to edit
   - Stable enough to reference

4. **Project-specific knowledge stays separate from general knowledge**
   - Reusable concepts go to domain folders.
   - Context-bound project materials go to `knowledge/06_PROJECTS/`.

5. **Archive instead of deleting valuable history**
   - If knowledge is obsolete but still informative, move it to `knowledge/99_ARCHIVE/`.

## 2) Domain Folder Purpose and Scope

### `knowledge/00_SYSTEM/`
Purpose:
- governance for AI behavior inside knowledge layer
- organization rules
- operating workflows
- system-level conventions

Should contain:
- core rules
- maintenance procedures
- organization standards
- AI-facing operating instructions

Should not contain:
- project notes
- topic knowledge that belongs in another domain

### `knowledge/01_JAPANESE/`
Purpose:
- Japanese language learning knowledge

Use for:
- grammar notes
- vocabulary systems
- reading/listening strategies
- study methods
- practice frameworks

Do not use for:
- temporary practice logs unless user explicitly wants them preserved as knowledge

### `knowledge/02_AI_TOOLS/`
Purpose:
- durable knowledge about AI tools, prompting, models, and agent workflows

Use for:
- model comparisons
- prompt patterns
- tool setup references
- AI operating methods
- agent design patterns

Do not use for:
- project-specific AI implementation details that only matter inside one project

### `knowledge/03_PRODUCTIVITY/`
Purpose:
- personal systems for execution, planning, and review

Use for:
- planning systems
- prioritization methods
- time and energy management
- habit execution frameworks
- review and reflection systems

Do not use for:
- dated life logs
- therapy-style daily journaling

### `knowledge/04_SOFTWARE_DEVELOPMENT/`
Purpose:
- reusable engineering knowledge across projects

Use for:
- architecture patterns
- debugging methods
- coding standards
- engineering heuristics
- tools and technical references

Do not use for:
- one-project-only implementation notes unless they generalize cleanly

### `knowledge/05_PERSONAL_DEVELOPMENT/`
Purpose:
- mindset, communication, learning, and growth frameworks

Use for:
- behavior change models
- communication principles
- learning systems
- reflection frameworks
- self-management ideas

Do not use for:
- raw emotional daily logs
- dated events that belong in life-tracking folders

### `knowledge/06_PROJECTS/`
Purpose:
- project-based documentation and context

Use for:
- project overviews
- architecture docs
- feature notes
- domain glossaries
- decision records
- workflows
- interview or research notes tied to project

Project folders may keep internal structure when inherited structure is already coherent.

### `knowledge/99_ARCHIVE/`
Purpose:
- preserve inactive or superseded knowledge without polluting active structure

Use for:
- retired note structures
- merged notes kept for traceability
- legacy imports
- obsolete but still useful references

Do not use for:
- active canonical notes

## 3) Recommended Folder Pattern

Default domain pattern:

```text
domain/
├── README.md
├── topic-note-a.md
├── topic-note-b.md
└── optional-subfolder/
```

Recommendations:
- keep top-level domain folders shallow by default
- create subfolders only when volume or topic boundaries justify them
- avoid deeply nested trees unless domain genuinely needs them
- preserve stable inherited project structures when already useful

## 4) File Naming Convention

### Default rule
- Use descriptive `kebab-case.md` file names.

Good examples:
- `retrieval-strategies.md`
- `weekly-review-framework.md`
- `prompt-patterns-for-refactoring.md`

Avoid:
- `notes.md`
- `misc.md`
- `ideas2.md`
- `new-file.md`

### Naming guidance
- Name by concept, not by mood.
- Prefer stable nouns over vague verbs.
- Include scope when needed:
  - `japanese-shadowing-routine.md`
  - `agent-prompt-evaluation.md`
  - `system-design-review-checklist.md`

### Exception rules
- Preserve inherited project filenames when rename would hurt continuity.
- Preserve external naming when file is imported reference material and original naming has value.

## 5) Metadata and Frontmatter Suggestions

Frontmatter is optional, not mandatory.

Use frontmatter when it improves:
- machine routing
- retrieval quality
- synthesis quality
- maintenance clarity

Recommended lightweight pattern:

```yaml
---
title: Retrieval Strategies
domain: AI_TOOLS
status: active
type: concept
tags:
  - retrieval
  - knowledge-management
updated: 2026-05-16
source:
  - internal
related:
  - knowledge/00_SYSTEM/Workflows.md
---
```

Suggested fields:
- `title` — canonical readable title
- `domain` — major domain or bucket
- `status` — `active`, `draft`, `archived`, `superseded`
- `type` — `concept`, `workflow`, `reference`, `project-note`, `glossary`, `synthesis`
- `tags` — lightweight retrieval hints
- `updated` — last meaningful update date
- `source` — origin of knowledge when useful
- `related` — direct related files

Guidance:
- do not force frontmatter onto every file
- prefer consistency within same folder or note family
- avoid verbose metadata that AI will not maintain

## 6) Recommended Internal Note Structure

For most durable notes, prefer structure like:

1. short summary
2. key points or main sections
3. examples / decisions / references
4. related notes

Common section patterns:
- `## Summary`
- `## Key Ideas`
- `## Practical Use`
- `## Related Notes`

Project notes may instead use:
- `## Context`
- `## Architecture`
- `## Decisions`
- `## Open Questions`

## 7) Linking Strategy

Links should improve navigation and synthesis.

### Minimum useful linking
When helpful, include:
- parent domain context
- sibling concepts
- project-to-general knowledge links
- workflow-to-tool links

### Preferred link types
1. **Domain to note**
   - via domain `README.md`
2. **Note to related note**
   - when another note materially helps understanding
3. **Project to general concept**
   - when project note illustrates reusable engineering or workflow concept
4. **Synthesis to source notes**
   - always link major source notes for synthesis pages

### Linking rules
- link only meaningful relationships
- avoid dense link spam
- prefer explicit “Related Notes” sections for important connections
- update broken links when moving canonical files

## 8) README.md Strategy for Domain Folders

Every top-level folder in `knowledge/` should have a `README.md`.

Domain README should explain:
- folder purpose
- what belongs there
- what does not belong there
- any important subfolders
- current canonical topics or projects if useful

Good domain README traits:
- short
- routing-oriented
- easy for AI to scan quickly
- updated when folder scope changes

README should not:
- duplicate every file in folder
- become long essay
- replace actual topic notes

## 9) Canonicalization and Deduplication

When overlap exists:
1. identify all overlapping files
2. choose canonical file
3. merge unique content carefully
4. leave pointer or archive duplicate
5. preserve origin if context matters

Signals that notes should be merged:
- same concept with slightly different wording
- same workflow repeated in multiple domains
- same project summary copied across files

Signals that notes should stay separate:
- different audience
- different abstraction level
- one general note and one project-specific application

## 10) Refactor Best Practices for AI

AI may autonomously:
- rename vague files
- move misplaced notes
- create missing README files
- split oversized notes
- merge thin duplicates
- add lightweight related-note links

AI should be cautious when:
- changing project vocabulary
- collapsing nuanced distinctions
- rewriting imported external material
- archiving files that may still be canonical

Before major refactor:
1. map current structure
2. identify change set
3. prefer reversible operations
4. preserve unique information
5. verify final tree and git diff

## 11) Long-Term Maintainability Rules

To keep system AI-native over time:

1. **Prefer predictable patterns**
   - same kinds of notes should look similar

2. **Keep routing obvious**
   - future AI should not need guesswork to place new material

3. **Avoid folder explosion**
   - do not create new top-level domains casually

4. **Preserve traceability**
   - if note comes from project, transcript, or source import, keep that context

5. **Maintain active vs archived separation**
   - active knowledge should stay easy to search

6. **Use README files as routing aids**
   - not as full documentation dump

7. **Review for drift**
   - periodically detect duplicates, stale notes, and misfiled material

## 12) Quick Decision Rules for AI

When deciding where a note belongs:

1. Is it durable knowledge or temporary input?
2. Is it general or project-specific?
3. Which domain would another AI check first?
4. Does similar canonical note already exist?
5. Would creating new file improve retrieval more than updating old one?

If unclear, prefer:
- updating existing canonical note
- placing project-bound knowledge in `knowledge/06_PROJECTS/`
- keeping note small and easy to move later
