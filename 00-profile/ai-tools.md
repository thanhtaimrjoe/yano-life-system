# TOOLS.md - Local Notes

Skills định nghĩa _cách_ tools làm việc. File này cho _specifics của tui_ — stuff unique cho setup của tui.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## XLSX Reading Workflow

Preferred order khi read hoặc edit `.xlsx` trong workspace này:

1. **First choice: PowerShell + OpenXML-as-ZIP parsing**
   - Treat `.xlsx` as zip package.
   - Read:
     - `xl/workbook.xml`
     - `xl/_rels/workbook.xml.rels`
     - `xl/sharedStrings.xml`
     - target `xl/worksheets/sheetN.xml`
   - Best for:
     - extracting raw text fast
     - listing sheet names
     - searching keywords across large workbooks
     - avoiding Excel UI / COM slowness
     - read-only workbook inspection và spec lookup
   - Caveat:
     - cần handle XML namespaces correctly
     - cần workbook rel mapping; don't assume sheet id = sheetN blindly
     - not ideal cho preserving Excel-only display behavior, formatting quirks, hoặc recalculation-dependent values

2. **Fallback: Excel COM automation**
   - Use khi workbook weird, heavily formatted, formula/display dependent, hoặc XML parsing failing.
   - Good for:
     - reading displayed cell text (`.Text`)
     - checking UsedRange
     - inspecting specific sheets/ranges
     - preserving Excel's interpretation của dates / formats / formulas
   - Caveat:
     - slower
     - more fragile
     - có thể leave Excel processes if not closed cleanly

3. **Python spreadsheet workflow (only if environment confirmed)**
   - Consider only khi Python và needed libs actually available.
   - General rule:
     - `openpyxl` → safer cho workbook-preserving edits to `.xlsx`
     - `pandas` → better cho tabular analysis / transforms, nhưng easier lose workbook structure/formatting if used carelessly
   - Use for:
     - structured table cleanup
     - bulk row/column transforms
     - multi-sheet data processing where workbook fidelity không main risk
   - Avoid as default unless runtime support explicitly confirmed.

4. **For spec-reading tasks**
   - Breadth first: list sheets, inspect top rows, search keywords, then zoom into exact ranges.
   - If workbook có multiple similar sheets/variants, identify source-of-truth sheet before summarizing.
   - Watch naming variants carefully.
   - For formulas/dates, distinguish clearly between:
     - raw stored value
     - displayed Excel text
     - recalculated expectation

5. **Safety / integrity rules**
   - Prefer read-only inspection first.
   - Before editing, decide nếu workbook fidelity matters: formulas, merged cells, styles, named ranges, templates, hidden sheets, validation rules.
   - Extra careful với `.xlsm` files; don't casually strip hoặc rewrite macro-bearing workbooks.
   - If preserving workbook structure matters, avoid lossy export/rewrite flows.
   - Summarize sensitive workbook contents instead of copying large raw dumps.

## Notes
- Python không available by default on this machine.
- Stable no-install path: PowerShell/.NET XML parsing của zipped XLSX structure.
- If using COM, always close workbook và quit Excel explicitly.
