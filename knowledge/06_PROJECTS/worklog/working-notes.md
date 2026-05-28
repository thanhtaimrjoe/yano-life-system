# WorkLog PC Connector (WPC)

## Snapshot
- status: active
- kind: QA / test case organization / batch behavior analysis / JP status updates
- owner_context: Yano
- last_updated: 2026-05-28

## What this project is
- Windows event log collector + TeamSpirit integration for tracking user activity and work sessions.
- Typical support includes test case writing, batch/import behavior analysis, DB field verification, and concise Japanese QA status updates.

## Routing Signals
- aliases: WorkLog, WPC, PC Connector, TeamSpirit, user_summary, BootEventLog, LogDetails
- strong keywords:
  - WLL- (issue tickets)
  - startup delay
  - S3 batch
  - DynamoDB
  - SQS
  - Salesforce
  - TeamSpirit
  - WindowTitle log
  - batch run
  - start_time
  - JST / STG time

## Active Focus
- Issue: WLL-801 (previous context)
- Focus: whether BootEventLog từ S3 override `user_summary.start_time` correctly
- Blocker: Pattern E và uncertainty quanh data-load process vs real WPC processing flow

## Stable Working Map
- Test case format:
  1. Preconditions
  2. Steps
  3. Expected Result / Actual Result
  4. Analysis / Next Check
- Data flow: BootEventLog (S3) → SQS → DynamoDB → user_summary
- Key field mapping: `start_time`, `user_summary`, `LogDetails`, `batch_run_id`
- Status update style: clear preconditions, clear result, direct next action request

## Known Stable Facts
- `start_time` stored as JST timestamp.
- `user_summary` table receives records từ SQS.
- BootEventLog upload to S3 happens before DynamoDB import.
- Batch retries tracked via `batch_run_id`.
- Salesforce field mapping: `task_id` → `user_activity.task_id`.

## References
- router/index: `knowledge/06_PROJECTS/README.md`
- tracking: Monday.com (shared with KINKEN)

## Update Rule
- Keep active issue context ở đây (WLL- tickets, blockers, test scenarios).
- Put day-specific test runs, retest results, temporary blockers vào `01-daily/YYYY/YYYY-MM-DD.md`.
- If new WPC task shape emerge, add nó dưới Active Focus hoặc Known Stable Facts sau khi proven durable.
