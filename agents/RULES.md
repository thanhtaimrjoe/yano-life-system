# SSOT CONTRACT — binding on all agents (cursor, claude-code, hermes)

## RULE 1 — WRITE TOPOLOGY: history is immutable
- log/** is APPEND-ONLY, and only via agents/bin/append.sh. Never open a
  .jsonl for edit; never delete or reorder a line. Errors are fixed by
  appending {type:"correction", data:{ref:<id>, replaces:{...}}}.
- system/state.yaml: whole-file overwrite allowed, but state MUST be
  reconstructible from log/. Commit state.yaml together with the events
  that produced it.
- system/context.yaml, knowledge/**, log/schema/**: agent READ-ONLY.
  Proposed changes go to agents/proposals/ as a diff; only a human commits.

## RULE 2 — READ BUDGET: every read is a predicate, never a scan
Resolve in order, stop at the first tier that answers the task:
  1. context.yaml            (already in prompt)
  2. state.yaml              (stateful tasks)
  3. .index/life.db          (aggregates/trends; rebuild if older than log/)
  4. jq slice of log/        (MUST filter: type + time window; cap 200 events)
  5. knowledge/              (grep frontmatter keys first; load ≤2 full docs)
Forbidden: cat-ing directories, loading whole month shards into context,
any retrieval without a type filter and a time bound.

## RULE 3 — CONCURRENCY & SYNC: conflicts are structural, not negotiated
- Local: append.sh's flock serializes all writers on one machine.
- Git: .gitattributes sets `log/**/*.jsonl merge=union`. Line order is
  NOT semantic — readers always sort by ts and dedup by id.
- Protocol: `git pull --rebase` before push; one commit per logical batch,
  message `log(<type>): <YYYY-MM-DD> <summary>`.
- Conflict in state.yaml → discard both sides, rebuild from log.
- Conflict in context.yaml or knowledge/ → ABORT, escalate to human. Never
  auto-resolve invariants.
