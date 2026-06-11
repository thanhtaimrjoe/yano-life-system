# Personal Finance Knowledge

This folder is the local AI-readable mirror for Yano's personal finance tracking.

Primary UI/source of entry:
- Notion database: [Personal Finance Expenses](https://app.notion.com/p/168de02749d742c08f6b27dde94edb93)

Purpose:
- Keep an AI-indexable local mirror of financial data and import decisions.
- Make spending analysis possible even when the Notion connector is unavailable.
- Preserve mapping rules so future imports stay consistent.

Privacy:
- This folder contains personal financial data.
- Do not publish or send externally unless Yano explicitly asks.

## Data Convention

Use this schema for local markdown mirrors:

| Column | Meaning |
|---|---|
| Date | Expense date, ISO format `YYYY-MM-DD` |
| Expense | Short name only, no appended date or amount |
| Amount VND | Numeric VND amount |
| Category | Normalized category matching Notion |
| Source | `Manual` or `Imported supermarket history` |
| Notes | Original category and original description when useful |

Important:
- `Expense` must not include date or amount.
- `Merchant` is not used.
- Original descriptions should go in `Notes`, not in `Expense`.

## Current Notion Categories

- `Groceries`
- `Food`
- `Transport`
- `Home`
- `Health`
- `Gym`
- `Subscription`
- `Shopping`
- `Education`
- `Beauty`
- `Admin`
- `Telecom`
- `AI Tools`
- `Entertainment`
- `Gifts`
- `Cash`
- `Other`

## Mapping Rules

- Shopee purchases -> `Shopping`, `Expense = Shopee`.
- Supermarket records:
  - AEON / SIÊU THỊ AEON VIỆT NAM -> `Groceries`, `Expense = Aeon Mall`.
  - LOTTE / LOTTEMART -> `Groceries`, `Expense = Lotte Mart`.
  - BÁCH HÓA XANH -> `Groceries`, `Expense = Bach Hoa Xanh`.
- Food delivery / convenience store food -> `Food`.
- Rent / room payment -> `Home`, `Expense = Rent`.
- FAHASA / learning materials -> `Education`.
- Nails / haircut / beauty services -> `Beauty`.
- Phone top-up / 3G -> `Telecom`.
- AI subscriptions and AI tools -> `AI Tools`.
- Generic subscriptions like Google -> `Subscription`.
- Cash withdrawal -> `Cash`.
- Gifts, flowers, company celebration spending -> `Gifts`.
- Admin procedures, EMS, photocopy, bank verification fee -> `Admin`.

## Mirror Files

- `expense-import-log.md` records what was imported into Notion and what was skipped/deduped.
- Future detailed ledgers should use monthly files like `expenses-2026-03.md`.
