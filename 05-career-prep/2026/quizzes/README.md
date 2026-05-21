---
title: Quiz System for Career Prep
purpose: Test and reinforce KINKEN knowledge
tags: [career-prep, quiz, learning]
---

# Quiz System

**Purpose:** Test và củng cố kiến thức KINKEN cho BrSE interview prep  
**Location:** `05-career-prep/2026/quizzes/`

---

## How It Works

### 1. Quiz Files
Mỗi quiz là 1 file markdown:
```
quiz-01-ubiquitous-language.md    # Quiz về 31 thuật ngữ domain
quiz-02-search-behavior.md         # Quiz về search modes
quiz-03-api-endpoints.md           # Quiz về API
...
```

### 2. Answer Files
Mỗi quiz có 1 answer key riêng:
```
quiz-01-answers.md    # Đáp án quiz 01
quiz-02-answers.md    # Đáp án quiz 02
...
```

### 3. Workflow

**Bước 1: Làm Quiz**
1. Mở quiz file (ví dụ: `quiz-01-ubiquitous-language.md`)
2. Điền đáp án vào chỗ trống
3. Save file

**Bước 2: Chấm Bài**
1. Nói với Claude: "chấm quiz 01 giúp tui"
2. Claude sẽ:
   - Đọc quiz file của bạn
   - Đọc answer key
   - So sánh đáp án
   - Tính điểm
   - Đưa feedback chi tiết

**Bước 3: Review**
1. Xem feedback từ Claude
2. Học lại phần sai
3. Làm lại quiz nếu cần

---

## Quiz Types

### Type 1: Multiple Choice
Chọn đáp án đúng từ A/B/C/D

**Example:**
```
Q: 商材 (category) là gì?
A. Sản phẩm
B. Danh mục sản phẩm (top-level classification)
C. Bộ phận
D. Tài liệu

Your answer: ___
```

### Type 2: Fill in the Blank
Điền từ còn thiếu

**Example:**
```
Q: ___ is the source system for product master data.
Your answer: ___
```

### Type 3: Matching
Nối thuật ngữ với định nghĩa

**Example:**
```
Match Japanese terms with English:
1. 商品     A. category
2. 商材     B. product
3. 部品     C. parts

Your answers:
1 → ___
2 → ___
3 → ___
```

### Type 4: Short Answer
Trả lời ngắn (1-2 câu)

**Example:**
```
Q: Explain the difference between 現行品 and 終息.
Your answer:
___
```

### Type 5: Translation
Dịch thuật ngữ giữa JP/EN/VI

**Example:**
```
Q: Translate to Vietnamese: "discontinued product"
Your answer: ___
```

---

## Scoring System

### Points
- Multiple choice: 1 point each
- Fill in the blank: 1 point each
- Matching: 1 point each
- Short answer: 2 points each
- Translation: 1 point each

### Grading Scale
- **90-100%**: Excellent (Xuất sắc) - Ready for interview
- **80-89%**: Good (Tốt) - Minor review needed
- **70-79%**: Fair (Khá) - Review weak areas
- **60-69%**: Pass (Đạt) - Significant review needed
- **<60%**: Need Review (Cần ôn lại) - Study more before retake

### Feedback Format
```
=== QUIZ RESULTS ===

Score: 35/40 (87.5%) - Good

Correct: 35
Incorrect: 5
Skipped: 0

=== INCORRECT ANSWERS ===

Q5: Your answer: "product"
    Correct answer: "category"
    Explanation: 商材 is the top-level classification, not individual products.

Q12: Your answer: "PIM"
    Correct answer: "PIM (Product Information Management)"
    Explanation: Need to include full name for clarity.

=== RECOMMENDATIONS ===

1. Review: Core Concepts (商材 vs 商品 vs 部品)
2. Review: Document Types (資料の種類)
3. Strong areas: Product Search, Brand Hierarchy

=== NEXT STEPS ===

- Review incorrect answers in ubiquitous-language.md
- Retake quiz after 1-2 days
- Move to Quiz 02 when score ≥ 85%
```

---

## Quiz List

| Quiz # | Topic | Terms | Questions | Difficulty | Status |
|--------|-------|-------|-----------|------------|--------|
| 01 | Ubiquitous Language | 31 | 36 | Easy | ✅ Available |
| 02 | Search Behavior | - | - | Medium | 🚧 Coming |
| 03 | API Endpoints | - | - | Medium | 🚧 Coming |
| 04 | Data Flow | - | - | Hard | 🚧 Coming |
| 05 | ETL Pipeline | - | - | Hard | 🚧 Coming |

---

## Tips for Success

### Before Quiz
1. Read knowledge base document first
2. Review key terms and definitions
3. Understand concepts, not just memorize
4. Take notes if needed

### During Quiz
1. Read questions carefully
2. Don't rush
3. If unsure, write your best guess
4. Mark questions you're uncertain about

### After Quiz
1. Review all incorrect answers
2. Understand WHY you got it wrong
3. Re-read relevant knowledge base sections
4. Retake quiz after 1-2 days

### Study Strategy
- **First attempt:** Baseline assessment
- **Review:** Focus on weak areas
- **Second attempt:** Should score 85%+
- **Move on:** When consistently scoring 85%+

---

## Integration with Daily Log

### Track Quiz Progress
In your daily log, add:

```markdown
### Quiz Practice
| Quiz # | Topic | Score | Time | Notes |
|--------|-------|-------|------|-------|
| 01 | Ubiquitous Language | 35/40 (87.5%) | 15 min | Need review: 商材 vs 商品 |

**XP Earned:** 10 XP (quiz completion)
```

### XP System
- Complete quiz: 10 XP
- Score 85%+: +5 XP bonus
- Perfect score (100%): +10 XP bonus
- Retake and improve: +5 XP

---

## Quiz Creation Process

When Claude creates a new quiz:
1. Identify topic and key terms
2. Create quiz file with questions
3. Create answer key file
4. Update this README with quiz info
5. Notify user quiz is ready

---

## Commands

**Start quiz:**
```
"Tôi muốn làm quiz 01"
→ Claude opens quiz file for you
```

**Grade quiz:**
```
"Chấm quiz 01 giúp tui"
→ Claude reads your answers, compares with key, provides score + feedback
```

**Review quiz:**
```
"Review lại quiz 01"
→ Claude shows correct answers and explanations
```

**Create new quiz:**
```
"Tạo quiz về [topic]"
→ Claude creates new quiz based on knowledge base
```

---

## Progress Tracking

### Week 1 Target
- Complete Quiz 01 (Ubiquitous Language)
- Score 85%+ on retake

### Week 2 Target
- Complete Quiz 02-04
- Score 85%+ on all

### Week 3 Target
- Complete Quiz 05-06
- Review all quizzes
- Consistent 90%+ scores

---

**Created:** 2026-05-21  
**Last Updated:** 2026-05-21  
**Total Quizzes:** 1 available, 4 coming soon
