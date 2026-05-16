# Knowledge Organization

## Purpose

This document defines how AI should organize permanent knowledge inside `knowledge/`.

## 1) Domain Routing Rules

### `knowledge/01_JAPANESE/`
Use for:
- vocabulary systems
- grammar notes
- immersion methods
- study plans
- speaking/listening/reading practice frameworks

### `knowledge/02_AI_TOOLS/`
Use for:
- model comparisons
- prompting methods
- AI workflows
- tool references
- agent operating patterns

### `knowledge/03_PRODUCTIVITY/`
Use for:
- task systems
- planning frameworks
- personal execution methods
- focus, habit, time, and energy management

### `knowledge/04_SOFTWARE_DEVELOPMENT/`
Use for:
- programming concepts
- architecture patterns
- coding standards
- infra/dev tools knowledge
- engineering best practices

### `knowledge/05_PERSONAL_DEVELOPMENT/`
Use for:
- mindset frameworks
- communication skills
- reflection models
- learning frameworks
- behavior change concepts

### `knowledge/06_PROJECTS/`
Use for:
- project-specific notes
- project architecture
- feature knowledge
- domain glossaries
- project workflows and interview notes

### `knowledge/99_ARCHIVE/`
Use for:
- deprecated structures
- superseded notes
- inactive material worth retaining

Do not archive active canonical notes.

## 2) Structure Within Domains

Preferred pattern:
- domain `README.md` explains scope
- top-level index note only when needed
- subfolders only when volume or context demands them
- project folders may keep inherited internal structure if already coherent

Avoid deep nesting unless information density requires it.

## 3) Atomicity Rules

Prefer one note per:
- concept
- workflow
- comparison
- architecture topic
- glossary cluster

Split notes when:
- file mixes many unrelated concepts
- note becomes hard to scan
- section can stand alone and be linked elsewhere

Keep combined notes when:
- sections are tightly coupled
- splitting would create fragmentation without value

## 4) Canonicalization Rules

When multiple notes overlap:
1. pick canonical file
2. merge useful content into canonical file
3. reduce duplicate file into pointer or archive it
4. preserve provenance if important

Do not maintain parallel versions of same knowledge without reason.

## 5) Linking Rules

AI should add lightweight links when useful:
- parent domain link
- sibling concept link
- project-to-concept link
- workflow-to-tool link

Links should improve navigation, not create noise.

## 6) Refactor Rules

AI may autonomously:
- rename vague files
- move misplaced files
- consolidate duplicates
- create missing README/index files
- archive obsolete content

AI should avoid:
- rewriting meaning without evidence
- deleting unique information
- changing stable project vocabulary casually

## 7) Source Handling

If content comes from:
- project docs
- transcript notes
- external references
- ad hoc user dumps

AI should preserve source meaning, then normalize structure.

If source is messy:
- clean formatting
- keep facts
- mark ambiguity explicitly

## 8) Naming Conventions

- folders: `UPPER_SNAKE_CASE` only for top-level system buckets already established
- ordinary folders: `kebab-case`
- files: `kebab-case.md` unless inherited project naming already exists
- README files explain folder purpose, not full content dump

## 9) Archive Policy

Move to `knowledge/99_ARCHIVE/` when content is:
- legacy
- superseded
- merged elsewhere
- structurally obsolete

Archive with enough context to recover origin.
