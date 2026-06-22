---
name: project_mini_kinken_v2_training
description: Training plan and operating rules for mini-kinken-v2 as a BrSE practice project.
type: project
updated: 2026-06-21
source: Hermes setup session
related:
  - knowledge/06_PROJECTS/kinken/mini-kinken-infra-audit.md
  - knowledge/06_PROJECTS/kinken/SESSION_START.md
  - /Users/taiht/Documents/mini-kinken-v2
---

# mini-kinken-v2 — BrSE Training Plan

## Purpose

`mini-kinken-v2` is the clean rebuild of the old `mini-kinken` sandbox.

Main goal:

> Use a small KINKEN-inspired search project to practice BrSE skills without outsourcing the learning to AI.

Code lives in:

```text
~/Documents/mini-kinken-v2
```

This note is the meta-tracking layer in Yano Life System.

## Why v2

Old `mini-kinken` had useful architecture shape, but became too broad and AI-heavy:

- large untracked/generated frontend
- too many document types too early
- fake/local/mocked core behaviors
- no strong acceptance criteria/test evidence loop

v2 starts smaller and requires Yano to own requirements, AC, and nghiệm thu.

## AI Usage Policy

AI can:

- ask clarification questions
- play PM/client/dev/reviewer
- review Yano's Draft 0
- implement small approved slices
- suggest test cases and risks

AI cannot:

- code before AC is approved
- replace Yano's first attempt
- decide final scope alone
- mark work done without evidence
- create broad generated code dumps

Shortcut:

```text
Learn -> Yano drafts first.
Produce -> AI assists.
Decide -> Yano owns.
```

## Required Feature Workflow

For every feature:

1. Yano writes requirement summary.
2. Yano writes clarification questions.
3. Yano writes user story.
4. Yano writes acceptance criteria.
5. AI reviews AC only.
6. Yano approves final scope.
7. AI may implement.
8. Yano tests and records evidence.
9. Yano writes short retrospective.

## Current Sprint 0

Output expected:

- [x] Clone `mini-kinken-v2`
- [x] Add repo scaffold and AGENTS rules
- [x] Add MVP scope / backlog / F001 template
- [ ] Yano writes F001 Draft 0
- [ ] AI reviews F001 Draft 0
- [ ] Yano approves scope
- [ ] Implementation begins

## First Feature

```text
F001 — Document Search by Keyword
```

Draft file:

```text
~/Documents/mini-kinken-v2/docs/features/F001-document-search.md
```

Yano's next action:

1. Open/read the F001 file.
2. Fill Draft 0 sections:
   - Requirement Summary
   - Clarification Questions
   - User Story
   - Acceptance Criteria
3. Ask AI to review, not code.

## Weekly Review Questions

At the end of each week/project sprint:

- Did Yano write Draft 0 before asking AI?
- Which BrSE skill was trained?
- What evidence was created?
- What did AI do that Yano should own next time?
- What is the next smallest feature?
