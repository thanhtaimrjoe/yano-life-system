---
name: project_kinken_tech_glossary
description: A glossary of technical terms encountered during the KINKEN project for future learning and reference.
type: reference
---

# KINKEN Technical Glossary (Từ điển Công nghệ)

Đây là danh sách các thuật ngữ kỹ thuật, công nghệ, và concept mà chúng ta đã gặp qua các báo cáo của dự án KINKEN. Tui (Claude) đã tổng hợp lại đây để sau này bạn có thể dễ dàng tra cứu hoặc yêu cầu tui "dạy kèm" nhé!

## 1. Cloud & Infrastructure (Hạ tầng & Đám mây)
- **GCP (Google Cloud Platform):** Nền tảng điện toán đám mây của Google, nơi chứa toàn bộ hệ thống KINKEN.
- **Cloud Run:** Dịch vụ của GCP dùng để chạy các ứng dụng (container) mà không cần quản lý máy chủ (Serverless), có khả năng tự động mở rộng (Auto-scaling) từ 0 đến hàng ngàn instances.
- **API Gateway (Apigee):** "Trạm gác" quản lý toàn bộ lượng truy cập vào API. Giúp bảo mật (Security), giới hạn số lượng gọi (Rate Limiting), và định tuyến (Routing).
- **Terraform (IaC - Infrastructure as Code):** Công cụ dùng code để tự động hóa việc tạo ra các server, database trên Cloud thay vì phải click chuột thủ công.
- **Docker / Container:** Đóng gói ứng dụng vào một "thùng container" chứa sẵn mọi thứ cần thiết để chạy. Giúp code chạy trên máy Dev và máy Prod giống hệt nhau ("Works on my machine").
- **Zero-downtime:** Khả năng nâng cấp hoặc bảo trì hệ thống mà không làm gián đoạn trải nghiệm của người dùng (hệ thống không bị sập).

## 2. Backend & API
- **Signed URL (URL kèm chữ ký):** Một URL có chứa các tham số bảo mật (chữ ký số) giúp giới hạn thời gian truy cập và đối tượng truy cập. Chỉ những user có "vé" hợp lệ mới xem được tài liệu thông qua URL này, giúp bảo mật các tài liệu nội bộ trên GCS.
- **FastAPI:** Một framework của ngôn ngữ Python dùng để xây dựng API cực kỳ nhanh và hiện đại.
- **REST API:** Chuẩn thiết kế API phổ biến nhất. Dùng các HTTP Method (GET, POST, PUT, DELETE) để tương tác với tài nguyên (Resources). Tận dụng tốt HTTP Cache.
- **GraphQL:** Một chuẩn API cho phép Frontend "tùy chỉnh" dữ liệu muốn lấy, tránh bị dư thừa dữ liệu (Over-fetching) nhưng dễ gây gánh nặng cho Database.
- **gRPC:** Giao thức giao tiếp siêu tốc giữa các Server với nhau (Microservices) do Google phát triển, dùng chuẩn Protobuf thay vì JSON.
- **API Versioning (vd: `/v1/search`):** Đánh dấu phiên bản cho API public để khi thay đổi cấu trúc không làm sập hệ thống của người đang sử dụng phiên bản cũ.
- **JWT (JSON Web Token) & Payload:** "Vé thông hành" dùng trong xác thực. `Payload` là phần ruột chứa thông tin của vé (vd: ID, Quyền hạn/id_type).
- **Push vs Pull Integration:** 
  - *Pull (Kéo):* Hệ thống mình phải liên tục đi hỏi/quét hệ thống khác xem có dữ liệu mới không (Tốn tài nguyên).
  - *Push (Đẩy):* Hệ thống khác có dữ liệu mới sẽ chủ động "bắn" sang hệ thống của mình thông qua API Gateway (Real-time hơn).

## 3. Frontend
- **NextJS:** Một framework cực kỳ mạnh mẽ xây dựng trên nền tảng React. Giúp làm web nhanh, hỗ trợ SEO tốt (nhờ SSR - Server Side Rendering).
- **Sentry:** Công cụ giám sát và bắt lỗi (Error Tracking). Khi Frontend bị crash ở máy khách hàng, Sentry sẽ gửi "hộp đen" chứa thông tin lỗi về cho Dev sửa.

## 4. CI/CD & Testing
- **CI/CD (Continuous Integration / Continuous Deployment):** Tích hợp và Triển khai liên tục. Tự động hóa quá trình Test và Đẩy code lên server (dùng GitHub Actions, Cloud Build).
- **Unit Test / Integration Test / E2E Test:** Các cấp độ kiểm thử phần mềm từ nhỏ nhất (từng hàm) đến lớn nhất (toàn bộ luồng người dùng).
- **Mock:** Tạo ra các "vật thế thân" (hàm giả, server giả) trong lúc Test để cô lập đối tượng cần test, tránh bị phụ thuộc vào môi trường ngoài.

## 5. Data & ETL (Extract - Transform - Load)
- **ETL:** Quá trình rút trích dữ liệu từ nguồn (Extract), biến đổi/làm sạch (Transform), và đổ vào kho lưu trữ mới (Load).
- **Databricks:** Công cụ xử lý dữ liệu lớn (Big Data) cực kỳ mạnh mẽ, được chọn làm công cụ ETL chính của KINKEN.
- **Cloud Dataflow / Cloud Data Fusion:** Các công cụ ETL native của nền tảng Google Cloud.
- **Delta Update (Cập nhật chênh lệch):** Chỉ cập nhật những dữ liệu bị thay đổi. Khác với *Full Refresh / Wash* là xóa hết làm lại từ đầu.

- **Surrogate Key (Khóa đại diện):** Một giá trị ID tự động tăng (1, 2, 3...) được hệ thống cấp phát làm khóa chính, không mang ý nghĩa nghiệp vụ. Giúp tối ưu hiệu năng database và tránh rủi ro khi mã nghiệp vụ (Natural Key) thay đổi.
- **Natural Key (Khóa tự nhiên):** Mã định danh có ý nghĩa thực tế (ví dụ: `product_code`, `catalog_id`). Dùng để liên kết dữ liệu ở tầng Bronze trước khi mapping sang Surrogate Key.
- **Lookup Mapping:** Quá trình tra cứu dữ liệu (ví dụ: từ mã `ABC` tìm ra ID `123`) trong bước Transformation của ETL để thiết lập mối quan hệ giữa các bảng dữ liệu.

- **Structured Data (Dữ liệu có cấu trúc):** Dữ liệu được tổ chức theo format cố định (vd: bảng trong Database với các cột rõ ràng như Tên, ID, Giá). Rất dễ để query và phân tích. Thường được import cực nhanh.
- **Unstructured Data (Dữ liệu phi cấu trúc):** Dữ liệu không có format định sẵn (vd: nội dung chữ bên trong trang file PDF, hình ảnh). Trong KINKEN, loại dữ liệu này rất "nặng", cần qua xử lý AI (OCR/Embedding) mới có thể đổ vào Elasticsearch.
- **Diff Data (Dữ liệu chênh lệch/差分データ):** Phần dữ liệu mới phát sinh hoặc bị thay đổi kể từ lần đồng bộ cuối cùng. Di chuyển Diff Data (Diff Migration) giúp tiết kiệm cực nhiều thời gian so với Full Migration.

## 6. AI & Elasticsearch (Search Engine)
- **Morphological Search (形態素検索 - Keitaiso Kensaku):** Tìm kiếm bằng cách phân tích hình thái từ vựng (cắt từ), ví dụ dùng Kuromoji tokenizer. Đối lập với Vector/Semantic Search.
- **Chunking (チャンク化):** Việc cắt nhỏ một đoạn văn bản dài thành các đoạn ngắn hơn để phù hợp với giới hạn của Embedding Model (vì mỗi model chỉ nhận tối đa 1 số lượng token nhất định).
- **Elasticsearch (ES):** Bộ máy tìm kiếm khổng lồ, chuyên dùng để tìm kiếm văn bản tốc độ cao.
- **Index:** Giống như một "Bảng" (Table) trong Database truyền thống, nhưng được thiết kế đặc biệt để tối ưu cho việc tìm kiếm.
- **Re-index:** Quá trình đọc lại toàn bộ dữ liệu từ nguồn và tạo lại Index mới (thường mất nhiều thời gian). Trong Elasticsearch, có thể dùng `_reindex` API để copy data nội bộ giữa các index, giúp chạy lại bộ Tokenizer với từ điển mới mà không cần nạp lại từ DB nguồn.
- **Alias (Bí danh):** "Bảng hiệu" trỏ vào một Index. Giúp thực hiện Zero-downtime Re-index (đổi bảng hiệu từ quán cũ sang quán mới trong 1 giây).
- **User Dictionary (形態素辞書 - Keitaiso Jisho):** Từ điển người dùng cung cấp cho Elasticsearch (như Kuromoji) để định nghĩa cách cắt từ đúng theo ý muốn (ví dụ: tên riêng sản phẩm của LIXIL).
- **Segment Bloat:** Hiện tượng ES bị phình to ổ cứng do cơ chế "chỉ đánh dấu xóa chứ không xóa thật". Cần dùng lệnh dọn rác (Force Merge).
- **Vector Search / Embedding:** Dùng AI (như OpenAI, E5-base) biến văn bản thành các dãy số (Vector) để máy tính hiểu được "ngữ nghĩa" thay vì chỉ so khớp từ khóa.
- **ANN (Approximate Nearest Neighbor):** Thuật toán tìm kiếm xấp xỉ trong Vector Search. Giúp tìm cực nhanh nhưng phải đánh đổi một chút độ chính xác (Recall).
- **RRF (Reciprocal Rank Fusion):** Thuật toán "lai" (Hybrid Search) kết hợp điểm số của Keyword Search truyền thống và Vector Search để ra kết quả tốt nhất mà không cần chuẩn hóa điểm số (score normalization).
- **Score Normalization:** Quá trình quy đổi các loại điểm số khác nhau (ví dụ điểm Vector và điểm Keyword) về cùng một thang đo (thường là 0-1) để có thể cộng/nhân với nhau.
- **Score Boosting:** Việc tăng trọng số cho một trường dữ liệu (field) cụ thể trong Elasticsearch. Ví dụ: Từ khóa xuất hiện ở `title` sẽ được nhân x3 điểm (`title^3`) so với xuất hiện ở `content`.
- **Re-ranking (Sắp xếp lại):** Kỹ thuật lấy một danh sách kết quả thô từ Search Engine, sau đó dùng thuật toán riêng (thường ở Backend) để tính toán lại điểm và thay đổi thứ tự hiển thị trước khi trả về cho UI.
- **Learning to Rank (LTR):** Sử dụng Machine Learning để "dạy" cho hệ thống cách sắp xếp kết quả tìm kiếm dựa trên dữ liệu lịch sử click/tương tác của người dùng.
- **Degraded Operation (縮退運転 - Shukutai unten):** Chế độ "suy giảm hoạt động". Khi một dịch vụ bên thứ 3 (như OpenAI) hoặc một tính năng bị lỗi, hệ thống tự động tắt tính năng đó và duy trì các chức năng cơ bản khác thay vì sập toàn bộ (ví dụ: tắt Vector Search, chỉ chạy Full-text Search).

---
*Ghi chú: Danh sách này sẽ liên tục được cập nhật khi chúng ta đi sâu vào các Sprint tiếp theo của dự án KINKEN.*

## 7. Project Management & Architecture Documentation
- **ADR (Architecture Decision Record):** Tài liệu ghi chú lại CÁC QUYẾT ĐỊNH kiến trúc. Nó không chỉ ghi "chọn công nghệ gì" mà quan trọng nhất là ghi "TẠI SAO lại chọn" và "NHỮNG CÔNG NGHỆ NÀO đã bị loại".
- **WIP PR (Work In Progress Pull Request) / Draft PR:** Tạo một yêu cầu gộp code ở dạng "Bản nháp". Báo cho mọi người biết là "Tui đang code dở chức năng này, mọi người có thể vào xem hướng đi của tui trước, nhưng đừng merge (gộp) vội nhé".
- **Monorepo vs Polyrepo:** 
  - *Monorepo:* Bỏ tất cả (code FE, BE, tài liệu) vào chung một kho chứa (Repository) khổng lồ.
  - *Polyrepo (Multi-repo):* Tách riêng mỗi phần ra một kho chứa khác nhau (Repo FE riêng, Repo BE riêng, Repo Docs riêng).

## 8. Elasticsearch In-Depth (Sâu hơn về Tìm kiếm)
- **Index (Chỉ mục):** Trong Elasticsearch, "Index" có hai nghĩa:
  1. *Danh từ:* Giống như một "Bảng" (Table) trong cơ sở dữ liệu truyền thống. Ví dụ: Index `products` chứa thông tin sản phẩm, Index `documents` chứa tài liệu.
  2. *Động từ (Indexing):* Hành động nạp dữ liệu vào Elasticsearch và phân tích nó để sau này tìm kiếm cực nhanh. Giống như việc bạn tạo "Mục lục" ở cuối cuốn sách để lật trang cho lẹ.
- **Mapping (Sơ đồ cấu trúc):** Giống như khai báo kiểu dữ liệu (Schema) cho Index. Báo cho ES biết trường `title` là dạng chữ, trường `price` là dạng số, trường `vector` là dạng tọa độ AI.
- **Query DSL (Domain Specific Language):** Ngôn ngữ truy vấn của Elasticsearch, được viết hoàn toàn bằng định dạng JSON. Bạn không dùng SQL (như `SELECT * FROM...`) mà gửi một cục JSON báo cho ES biết bạn muốn tìm gì, lọc (filter) thế nào, và ưu tiên (boost) kết quả nào.
## 9. Domain Knowledge (Nghiệp vụ Nhôm Kính - KINKEN)
- **Page-based Search (ページ単位検索):** Phương thức tìm kiếm mà kết quả trả về từng TRANG cụ thể của một cuốn catalog (áp dụng cho danh sách tài liệu chung).
- **Catalog-based Search (カタログ単位検索):** Phương thức tìm kiếm trả về cả CUỐN catalog (áp dụng cho danh sách tài liệu chuyên biệt của 1 sản phẩm).
- **Product Pickup Mode (商品ピックアップモード):** Chế độ hiển thị riêng biệt: khi keyword search khớp với tên một sản phẩm, sản phẩm đó sẽ được "đưa lên top" (highlight) phía trên danh sách tài liệu.
- **Product Limited Mode (商品限定モード):** Chế độ giới hạn: khi có nhiều keyword, nhưng chỉ có MỘT keyword khớp với sản phẩm, hệ thống sẽ tự động giới hạn phạm vi tìm kiếm tài liệu xung quanh sản phẩm đó.
- **Mikomi (見込み):** Kích thước chiều sâu của khung cửa (từ trong nhà ra ngoài trời). Đây là một thuật ngữ chuyên ngành quan trọng để xác định linh kiện thay thế.
- **Mitsuke (見付け):** Kích thước chiều rộng của mặt cắt khung cửa (phần nhìn thấy khi đứng trực diện). Kết hợp với Mikomi để tạo nên thông số profile nhôm.
- **Product Code Master (Danh mục mã sản phẩm gốc):** Bảng dữ liệu cốt lõi chứa toàn bộ các mã sản phẩm từng được sản xuất. Trong dự án KINKEN, con số này lên tới 8.800.000 (8.8 triệu) records, đặt ra thách thức cực lớn về xử lý dữ liệu và tìm kiếm.

