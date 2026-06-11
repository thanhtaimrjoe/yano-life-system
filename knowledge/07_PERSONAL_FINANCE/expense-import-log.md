# Expense Import Log

This file mirrors import decisions for the Notion finance database.

Notion database:
- [Personal Finance Expenses](https://app.notion.com/p/168de02749d742c08f6b27dde94edb93)

## 2026-06-10 Initial Supermarket Import

Created a clean Notion database after replacing verbose titles.

Convention established:
- `Expense` contains only the short expense/merchant name.
- `Date` and `Amount` are separate fields.
- `Merchant` was removed.

Imported:
- 190 clean records total at that point.
- Total imported amount: `89,200,623 VND`.

Archived old verbose database:
- `Personal Finance Expenses - verbose title archive`

Views created/updated:
- `All Expenses`
- `By Month`
- `By Category`
- `Calendar`

## 2026-06-10 January 2026 Other Expenses

Imported:
- 76 manual records.
- Skipped 5 supermarket exact duplicates already present from supermarket history:
  - `2026-01-04` Aeon Mall `1,329,834`
  - `2026-01-04` Aeon Mall `78,400`
  - `2026-01-11` Lotte Mart `1,115,400`
  - `2026-01-17` Aeon Mall `1,250,654`
  - `2026-01-25` Lotte Mart `1,017,200`

Mapping notes:
- `Ăn uống` -> `Food`
- `Siêu thị` -> `Groceries`
- `Shopee` -> `Shopping`
- `Đi lại` -> `Transport`
- `Nhà ở` -> `Home`
- `Sức khoẻ`, Pharmacity, khám, thuốc -> `Health`
- `Học tập`, `Làm đẹp`, `Khác` initially went to `Other`, then later split into more specific categories.

## 2026-06-10 February 2026 Import

Imported:
- 43 records.
- Total new amount: `10,321,015 VND`.

Skipped/deduped:
- 6 supermarket rows already present from supermarket history.
- 1 duplicate FAHASA row:
  - `2026-02-20` FAHASA `15,500`

Categories added:
- `Education`
- `Beauty`
- `Admin`
- `Telecom`

Mapping corrections:
- `Thanh toán BÁCH HOÁ XANH` -> `Groceries`
- `Cắt tóc` -> `Beauty`
- `Nạp 3G` -> `Telecom`
- EMS / nenkin procedure -> `Admin`

Note:
- `2026-02-21` Aeon Mall `55,000` was imported separately because it did not match the existing supermarket-history amount `105,000`.

## 2026-06-11 March 2026 Import

Imported:
- 64 records.
- Total new amount: `11,792,212 VND`.

Skipped/deduped:
- 5 supermarket rows already present from supermarket history:
  - `2026-03-01` Aeon Mall `39,200`
  - `2026-03-01` Aeon Mall `1,435,084`
  - `2026-03-08` Aeon Mall `1,667,328`
  - `2026-03-15` Lotte Mart `875,300`
  - `2026-03-21` Lotte Mart `1,130,300`
- 1 duplicate food row:
  - `2026-03-21` Cơm tấm Long Xuyên `82,000`

Categories added:
- `Gifts`
- `Entertainment`
- `AI Tools`
- `Cash`

Mapping corrections:
- `BÁCH HÓA XANH` -> `Groceries`
- `Nạp tiền điện thoại` / `Nạp 3G` -> `Telecom`
- `Google ngáo` -> `Subscription`
- `RouteAI` -> `AI Tools`
- `ChatGPT Business` -> `AI Tools`
- `Rút tiền mặt` -> `Cash`
- `Ăn sáng` under original `Khác` -> `Food`

## 2026-06-11 April 2026 Import

Imported:
- 56 records.
- Total new amount: `9,401,633 VND`.

Skipped/deduped:
- 1 supermarket row already present from supermarket history:
  - `2026-04-19` Lotte Mart `1,057,000`

Mapping corrections:
- `Bách Hoá Xanh` under original `Ăn uống` -> `Groceries`
- `ChatGPT Go` and `VAT ChatGPT Go` -> `AI Tools`
- `Spotify` -> `Subscription`
- `Nạp 3g` -> `Telecom`
- `Đổi tiền mặt` -> `Cash`
- `Icool Karaoke` -> `Entertainment`
- Shopee health-related purchases (`Thuốc giảm đau kinh`, `Dầu gió`) -> `Health`
- Haircut / `Hớt tóc` -> `Beauty`

## Sync Rule Going Forward

Whenever new expenses are imported into Notion:
1. Normalize `Expense` to a short name only.
2. Map `Category` using `README.md`.
3. Deduplicate against existing supermarket/history records when exact date + amount + store match.
4. Add new category options to Notion when a pattern is repeated or analytically useful.
5. Append a summary here.
6. Add or update a monthly ledger file when detailed row-level local analysis is needed.
