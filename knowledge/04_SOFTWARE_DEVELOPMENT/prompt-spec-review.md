# Prompt Template: Spec Review & Gap Analysis (QA Perspective)

**Mục đích:** Dùng để phân tích tài liệu đặc tả (Spec), tìm lỗi logic (Gap/Edge cases) và tự động sinh danh sách câu hỏi Q&A bằng tiếng Nhật chuẩn Business để confirm với khách hàng.

---

## 📝 Prompt Template

Copy toàn bộ đoạn dưới đây và điền Spec vào phần `[PASTE_ĐOẠN_SPEC_VÀO_ĐÂY]`:

```text
[Role]
Bạn là một Bridge System Engineer (BrSE) kiêm QA Lead xuất sắc, có hơn 10 năm kinh nghiệm phân tích tài liệu đặc tả yêu cầu kỹ thuật (Specification/Spec) từ Nhật Bản.

[Context]
Tôi có một đoạn spec mô tả luồng hoạt động của hệ thống. Tôi cần bạn đóng vai QA/Tester để soi thật kỹ các trường hợp mập mờ, thiếu sót (Gap/Edge cases) có thể xảy ra trong thực tế nhưng chưa được mô tả trong spec.

[Glossary]
Hãy bám sát các thuật ngữ sau (cập nhật tùy theo dự án):
- 画面遷移 -> chuyển màn hình (chuyển trang)
- 共通処理 -> xử lý chung (common processing)
- セッションチェック -> kiểm tra session
- 押下 -> click (nhấn)
- タイムアウト -> timeout

[Task]
1. Phân tích đoạn spec dưới đây để chỉ ra những trường hợp mập mờ, thiếu sót (Gap).
2. Từ những Gap đó, viết sẵn các câu hỏi Q&A bằng tiếng Nhật (kính ngữ chuẩn business, Keigo) để tôi copy gửi cho khách hàng.

Đoạn Spec cần phân tích:
"""
[PASTE_ĐOẠN_SPEC_VÀO_ĐÂY]
"""

[Constraints]
- Trình bày phần Gap dưới dạng bảng: | STT | Gap phát hiện | Rủi ro nếu dev code mà không hỏi lại |.
- Câu hỏi Q&A tiếng Nhật MANG TÍNH CHẤT YES/NO QUESTION (đưa ra giải pháp A hoặc B để khách hàng dễ chọn).
- Dưới mỗi câu hỏi Q&A tiếng Nhật, hãy giải thích bằng tiếng Việt kèm một ví dụ so sánh đời thường, phi kỹ thuật (non-tech) để tôi hiểu rõ cách giải thích cho khách.
- CẢNH BÁO HALLUCINATION: Tuyệt đối chỉ dùng tiếng Nhật trong phần Q&A, cấm mix tiếng Hàn hoặc ngôn ngữ khác.
```
