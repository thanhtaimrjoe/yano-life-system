---
name: project_kinken_sprint_tracking
description: Tracking the overall progress and flow of KINKEN project from early sprints to SPRINT 25 (PROD release).
type: project
originSessionId: 9bdebdd7-459b-474e-a4df-4bd3a1513398
---

# KINKEN Sprint Tracking & Retrospective

> Note: Information from early sprints comes from ad-hoc/sync meetings. Future sprints may include weekly meeting reports. The distinction is kept to understand technical deep-dives (ad-hoc) vs progress summaries (weekly).


## Overview

Dự án hiện tại đang ở **SPRINT 17**, giai đoạn chuẩn bị cho Production Environment Buildout và Test Planning. Tài liệu này dùng để nhìn lại (retrospective) toàn bộ quá trình phát triển dự án từ sơ khai, theo dõi tiến độ tổng thể, các vấn đề gặp phải và cách giải quyết (case studies) qua từng giai đoạn.

## Timeline Clarification
- **Trước 2025/07/25**: Giai đoạn Tiền dự án (Pre-project / Foundation & Infrastructure Planning). **Không được gọi là Sprint**.
- **2025/07/25**: Chính thức bắt đầu **SPRINT 1**.

## Sprint History (Từ SPRINT 1 đến SPRINT 25)

Dưới đây là danh sách các Output Summary Report qua các mốc thời gian:

- **SPRINT 25** *(Current - Preparing for PROD Release)*
- **SPRINT 24**
- **SPRINT 23**
- **SPRINT 22**
- **SPRINT 21**
- **SPRINT 20**
- **SPRINT 20** - 2026/02/27: Output Summary Report (SPRINT 20 Finished)
- **SPRINT 19** - 2026/02/13: Output Summary Report (SPRINT 19 Finished)
- **SPRINT 17** - 2026/01/16: Output Summary Report (SPRINT 17 Finished)
- **SPRINT 15** - 2025/12/19: Output Summary Report (SPRINT 15 Finished)
- **SPRINT 14** - 2025/12/05: Output Summary Report (SPRINT 14 Finished)
- **SPRINT 13** - 2025/11/21: Output Summary Report (SPRINT 13 Finished)
- **SPRINT 12** - 2025/11/07: Output Summary Report (SPRINT 12 Finished)
- **SPRINT 11** - 2025/10/24: Output Summary Report (SPRINT 11 Finished)
- **SPRINT 10** - 2025/10/14: Output Summary Report (SPRINT 10 Finished)
- **SPRINT 9** - 2025/09/19: Output Summary Report (SPRINT 9 Finished)
- **SPRINT 3**
  - 2025/08/08: Output Summary Report (SPRINT 3)
- **SPRINT 2**
  - 2025/08/01: Output Summary Report (SPRINT 2)
- **SPRINT 1**
  - 2025/07/25: Output Summary Report (SPRINT 1)

## Key Milestones & Case Studies

### Giai đoạn Tiền dự án (Tháng 5 - Giữa tháng 7/2025)
*(Xem chi tiết ở các bản ghi cũ)*

### Giai đoạn SPRINT 1 (Bắt đầu từ 2025/07/25)
*(Xem chi tiết ở các bản ghi cũ)*

### Giai đoạn SPRINT 2 (Kết thúc 2025/08/01)
*(Xem chi tiết ở các bản ghi cũ)*

### Giai đoạn SPRINT 3 (Kết thúc 2025/08/08)

#### 1. "Boosting" - Linh hồn của Search Engine 🧠
- **Sự kiện**: Team đã hoàn thành thiết kế Index và đặc biệt là **Boosting Query** cho Elasticsearch.
- **Ý nghĩa**: Search không chỉ là tìm thấy, mà là tìm thấy cái "đúng nhất" ở trên đầu. Việc thiết kế Boosting sớm cho thấy team đang tập trung vào chất lượng kết quả tìm kiếm (Relevance Scoring) ngay từ đầu.

#### 2. Chiến lược Test: Chia để trị (Test Strategy) 🧪
- **Vấn đề**: API và môi trường GCP chưa hoàn thiện 100% dẫn đến việc test bị nghẽn.
- **Giải quyết**: Team quyết định tách các ticket Test thành 2 phần: **"Tạo Test Case"** (đã xong) và **"Thực thi Test"** (đợi môi trường). 
- **QA Action**: Test thực thi sẽ được chạy trên môi trường DEV của GCP (dự kiến build bằng **Terraform** ở Sprint 4). Việc này giúp team QA không bị "ngồi chơi" mà luôn có output (Test Case) sẵn sàng.

#### 3. Nút thắt cổ chai Hạ tầng (Infra & Data Bottleneck) 🏗️
- **Vấn đề 1**: Chờ LIXIL kích hoạt **Databricks** (thành phần cực quan trọng cho ETL).
- **Vấn đề 2**: Chờ data "xịn" (Production-like data) để validation. Dự kiến cuối tháng 8 mới có đủ.
- **Rủi ro**: Dự án có dấu hiệu chậm tiến độ (delay) so với Detail Schedule ban đầu do khâu chuẩn bị môi trường và data tốn thời gian.
- **Đối sách**: Team BE/Test cam kết sẽ "hấp thụ" (absorb) phần delay này trong tháng 8 bằng cách đẩy nhanh tiến độ sau khi có môi trường.

#### 4. Kỹ năng BrSE: Quản lý Q&A mượt mà 💬
- **Vấn đề**: Q&A bị nghẽn do chờ trả lời.
- **Giải quyết**: Thống nhất quy trình "Fast-track Q&A". MOR có Q nào thì dịch và đẩy ngay cho GW. GW cam kết trả lời sớm nhất có thể. 
- **Tầm quan trọng**: BrSE cần đảm bảo luồng thông tin không bị tắc nghẽn, vì một câu hỏi chưa được giải đáp có thể làm dừng cả một line code của Dev.

#### 5. Bảo mật dữ liệu (Data Security) 🔒
- **Lưu ý**: Khách hàng nhấn mạnh dữ liệu dùng cho validation là dữ liệu thật (Production-like), yêu cầu team phải cực kỳ cẩn trọng trong việc bảo mật (Handle with care).

---
### Giai đoạn SPRINT 4 (Kết thúc 2025/08/15)

#### 1. RDB Selection: MySQL InnoDB 🗄️
- **Sự kiện**: Team quyết định sử dụng **MySQL (InnoDB)** cho RDB để lưu trữ data normalized.
- **Lý do**: Có sẵn cộng đồng mở mạnh mẽ hỗ trợ, cộng với kinh nghiệm phong phú của team MOR về MySQL.
- **Output**: Hoàn tất DDL cho RDB.

#### 2. Chiến lược lưu trữ GCS Bucket (Data Collection) 📦
- **Sự kiện**: Thống nhất dùng GCS để lưu trữ các file data cho quá trình phát triển nội bộ.
- **Kiến trúc**: Tạo 2 nhóm bucket riêng biệt: `xxxx-dev` (cho môi trường dev chung) và `xxxx-local` (cho dev tự test ở local).

#### 3. Trở ngại Setup Databricks 🚧
- **Vấn đề**: Vẫn đang chờ account chính thức từ LIXIL.
- **Giải quyết (Tạm thời)**: GW tạo account Databricks Free tạm thời, config kết nối GitHub, rồi bàn giao cho MOR để không block tiến độ viết ETL job.

#### 4. Tổng kết tiến độ Sprint 4
- **Đã xong**: ETL Base Source, UI Component chung, ES Index Design, Test cases/Execution Phase 1 (API, UI, Collection), RDB DDL.
- **Đang review**: API Base Phase 1, Infra Setup GCP (Dev env), Collection Connection Phase 2.
- **Kế hoạch tiếp (Sprint 5)**: Viết tiếp API Base Phase 2, Test cases Phase 2, UI Figma Phase 2, ETL Job Phase 1. Lên plan chi tiết cho tháng 9 và retro (họp nhìn lại) giai đoạn thiết kế tháng 7-8.

---
### Giai đoạn SPRINT 5 (Kết thúc 2025/08/22)

#### 1. Cải tiến quy trình Quản lý Ticket (Monday.com) 🎫
- **Sự kiện**: Team thống nhất protocol mới cho việc update status trên Monday.
- **Rule**: Khi đổi status phải kèm comment, gắn link PR/artifact, và set Owner đúng người review (VD: nhờ GW Take thì assign Take làm Owner).
- **Ý nghĩa**: Giúp team track tiến độ rõ ràng hơn và tránh bị sót task chờ review.

#### 2. Chuẩn bị Training Camp (Gasshuku) tháng 9 🏕️
- **Sự kiện**: Kế hoạch tổ chức Training Camp từ 08/09 - 12/09.
- **Mục tiêu**: Onboard thành viên mới, MOR thuyết trình kết quả phase thiết kế thay vì chỉ nghe một chiều từ GW.
- **Ảnh hưởng**: Tuần này sẽ tốn nhiều thời gian, cần cân nhắc giảm tải task trong kế hoạch phát triển T9-T10.

#### 3. Tiến độ QA/QC và Review
- **QA/QC Deep Analysis**: Đã apply feedback vào test cases.
- **Test Execution**: Hoàn thành chạy test Phase 2 (API, UI, Collection).
- **Review**: Đang giải quyết feedback của API Base Phase 1 và ES Index Design.

#### 4. Kế hoạch tiếp (Sprint 6)
- **Focus**: Figma UI Phase 2, API Base Phase 3, và tiếp tục xử lý các task còn dang dở của Sprint 5.

---
### Giai đoạn SPRINT 6 (Kết thúc 2025/08/29)

#### 1. Tách Domain theo Loại User 🌐
- **Quyết định**: Tách domain URL giữa nhóm Internal/Partner và nhóm Business/General, dựa trên feedback từ QnA #101.
- **Trạng thái**: Đang yêu cầu cấp domain cho môi trường dev. Cần ORIGIN domain của Load Balancer (QnA #110).
- **Ý nghĩa**: Tăng bảo mật và kiểm soát truy cập theo user type.

#### 2. VPC Connect & External System Integration 🔗
- **Đã xong**: VPC Connect đã setup.
- **Đang confirm**: Có nhiều config → đang xác nhận dùng cái nào.
- **Đã nhận connection info**: 電子商品連絡 (product-update) và 点検修理手順書 (maintenance manual).
- **Chờ**: Connection info tới 商品コードマスタ (MDM - Product Code Master).

#### 3. OpenAI API Key & Spending Control 💰
- **Đã có**: API Key từ LIXIL.
- **Cần làm**: Set spending threshold để phòng vượt mức sử dụng. Chien-san phụ trách xem xét.

#### 4. Infra: Secrets & Logging Tasks 🔧
- **KINKEN-173**: Secrets management → tiếp tục ở Sprint 7.
- **KINKEN-174**: Logging config → tiếp tục ở Sprint 7.
- **KINKEN-172**: ETL version management → tiếp tục ở Sprint 7.

#### 5. JIRA/Confluence Shared Account 🔑
- **Quyết định**: Dùng shared mailing list cho member mới + GW Take.
- **Security**: Password được đổi hàng tháng bởi GW Take.

#### 6. Kế hoạch tiếp (Sprint 7)
- API Base Phase 3, ETL Testing Phase 2, UI API Integration Phase 2, Secrets/Logging/Version management.

---
### Giai đoạn SPRINT 7 (Kết thúc 2025/09/05)

#### 1. Infra: Dev Environment Buildout 🏗️
- **Đã xong**: RDB, Load Balancer, Cloud Run (Frontend), Elastic Cloud.
- **Đang làm**: Cloud Run (Backend).
- **Dự kiến**: Dev env hoàn thành sau Training Camp (tuần 09/08).
- **CI/CD**: Defer đến SPRINT 10, sau khi Dev env ổn định.

#### 2. MDM Connection via SSH 🔐
- **Kiến trúc kết nối**:
  1. Tạo SSH keypair local → gửi public key cho LIXIL
  2. Private key + known_hosts → lưu GCP Secret Manager
  3. Mount Secret thành file vào Cloud Run
  4. Dùng VPC Connect (LIXIL đã setup sẵn connector)
  5. App dùng SSH lib (`paramiko`) để connect bằng private key
- **Trạng thái**: MOR đang verify phương án này.

#### 3. QA Milestones 🧪
- **Smoke Test (KINKEN-180)**: Delivered — đánh dấu lần đầu chạy smoke test cho hệ thống.
- **Integration Test (KINKEN-179)**: Bắt đầu lên kế hoạch, tiếp tục ở phase phát triển.

#### 4. Infra Tasks Mới Mở
- **KINKEN-178**: Monitoring setup.
- **KINKEN-177**: RDB Backup & Recovery (Kaz).
- **KINKEN-173/174**: Secrets management + Logging → tiếp tục.

#### 5. Training Camp (Gasshuku) 🏕️
- **Thời gian**: 2025/09/08 (Mon) ~ 09/11 (Thu).
- **Nội dung**: Onboarding, function list walkthrough (VN version có JP), MOR trình bày kết quả design phase.
- **Skip**: DevMeeting ngày 09/12 (Fri).

---
### Giai đoạn SPRINT 9 (Kết thúc 2025/09/19)

#### 1. Chốt Domain & Path chính thức 🌐
- **Internal**: `https://kinken.lixil.co.jp/i/` (Dành cho nhân viên/partner).
- **External**: `https://kinken.lixil.co.jp/e/` (Dành cho business/công chúng).
- **Dev**: `https://dev-kinken.lixil.co.jp` (Đã có Basic Auth, AkamaiWAF configured).

#### 2. Triển khai Elasticsearch (Elastic Cloud) 🔍
- **Sự kiện**: Hoàn tất thiết kế Index.
- **Action**: Bắt đầu mapping và triển khai thực tế lên Elastic Cloud instance.

#### 3. Làm rõ công thức Scoring PoC 🧠
- **Vấn đề**: GW yêu cầu MOR xác nhận lại cách tính score từ đợt PoC (dựa trên source code và tài liệu cũ).
- **Mục tiêu**: Đảm bảo logic search mới kế thừa hoặc cải thiện đúng từ kết quả PoC đã được validate.

#### 4. Kế hoạch nghỉ lễ & Deadline cuối năm 📅
- **Nghỉ lễ GW**: 29/12/2025 - 04/01/2026.
- **Nghỉ lễ MOR**: 01/01/2026 - 02/01/2026.
- **SPRINT 16**: Chốt buổi họp DevMeeting cuối cùng vào 30/12/2025.

#### 5. Quản lý Ticket & Team
- **Assign rule**: TeamQC → Tuna; Team → Kaz; Task nhiều người → lấy người đầu tiên.
- **Function List**: Bắt buộc cập nhật các cột Status/Dev Env/Stg Env.

#### 6. Kết quả SPRINT 9 (Cuối kỳ)
- **Delivered**: Môi trường Dev Setup (KINKEN-169).
- **Hoàn tất**: API Base Phase 2/3, Figma UI, Temporary Auth API/UI.
- **QA (Tai, Tuna)**: Delivered Test Case và Test Data cho Search Functionality; Đang làm Test Case cho Filtering (SPRINT 10/11 task kéo sớm).
- **Trì hoãn (Defer)**: RDB Backup & Recovery (KINKEN-177) lùi sang SPRINT 17 để ưu tiên development.
- **EdgeWorker**: Đang confirm hành vi của EdgeWorker để chốt việc BE/FE integration cho Auth.

---
### Giai đoạn SPRINT 10 (Giữa kỳ - 2025/10/03)

#### 1. Infra: Deploy Dev Environment & CI/CD 🚀
- **Đã deploy xong**: Frontend, Backend, và Database lên môi trường Dev.
- **Sắp xong**: CI/CD Pipeline (xong trong ngày); Terraform Code (xong tuần tới).
- **Ý nghĩa**: Team chuẩn bị có môi trường dev hoàn chỉnh để tích hợp đầu cuối (end-to-end).

#### 2. Milestone: Kích hoạt tính năng Search 🔍
- **Target (Tuần sau)**: Sẽ có thể gọi API search bằng Elasticsearch.
- **Data**: Giai đoạn đầu dùng Sample data (Seed data) do MOR tự chuẩn bị.
- **Next step**: Chờ team ETL chốt lịch import dữ liệu thật (Test data).

#### 3. Cảnh báo rủi ro (Risk/Issue): Data Normalization ⚠️
- **Vấn đề**: Ticket `KINKEN-234` (Data Normalization Processing) bị đội effort lên gấp **11 lần** so với estimate ban đầu do xử lý quá phức tạp.
- **Action**: Yêu cầu MOR đánh giá lại ảnh hưởng tới tổng thể tiến độ. 
- **Quản lý**: Không quản lý bằng sub-tickets nữa, MOR sẽ tách thành danh sách task chính để GW import lại vào Monday.

#### 4. Tiến độ task
- **Delivered**: Elasticsearch Index Design (ElasticCloud build), Search API Foundation.
- **Reviewing**: Data Processing Environment Setup.

#### 5. Kết quả SPRINT 10 (Cuối kỳ - 2025/10/14)

##### a. Keyword Search Algorithm ⚡
- **Delivered**: KINKEN-228 — Keyword Search Algorithm Implementation (Khoa, Hoang).
- **Lưu ý**: PR review có vài chỉnh sửa, đang fix lại.

##### b. ETL Pipeline: Gold Table & RDB Sync 🔄
- **Reviewing**: Finalize Silver → Gold (KINKEN-368/369/370), Transform/Upsert Gold → RDB (KINKEN-375/376).
- **Embedding tasks** (Chunking, Batch embedding, metadata storage, tracking — KINKEN-371~374) chuyển SP11.

##### c. OCR Setup 📄
- **Delivered**: KINKEN-362 — OCR/Library/Init script research & compute setup (Truong).

##### d. Infra: Monitoring & Cloud Function
- **Monitoring (KINKEN-178)**: Xử lý gần xong, đang chờ đủ data để validate alert.
- **Cloud Function**: Bổ sung thêm trong SP11 (KINKEN-230).

##### e. Monday Ticket Rule: Rejected Flow
- **Implementation tickets**: PR merged → Delivered (không có feedback sau Delivered).
- **Test tickets**: Delivered → feedback nhỏ giữ Delivered → feedback lớn/sai hướng → **Rejected** → fix xong → Delivered lại.

---
### Giai đoạn SPRINT 11 (Giữa kỳ - 2025/10/17)

#### 1. Demo bị hoãn — API Calling Architecture Issue ⚠️
- **Vấn đề**: Keyword Search (KINKEN-228) đã merge nhưng phát hiện lỗi kiến trúc gọi API Frontend → Backend.
- **Action**: Đang thiết kế lại luồng gọi. Demo dự kiến buổi họp tiếp theo.

#### 2. Document Delivery: Validate PDF/HTML từ GCS 📄
- **Kiến trúc**: `AkamaiCDN → LB(Origin) → Cloud Run Backend → GCS`.
- **Không đi qua Frontend**: Tránh server-to-server communication → không thể xác thực.
- **URL Rewrite**: `/i/docs/...` → `/api/docs/...` → `gs://lixil-kinken-docs-{env}/...`

#### 3. Tiến độ API
- **Reviewing**: Product List API (KINKEN-235), Product Filtering API (KINKEN-245).

#### 4. Process: Mid-Sprint DevMeeting Format
- Không cần liệt kê Monday ticket status ở buổi họp giữa sprint.
- Chỉ ghi lại nếu có artifact/tài liệu cụ thể.

#### 5. Kết quả SPRINT 11 (Cuối kỳ - 2025/10/24)

##### a. Document Delivery: Signed URLs vs CloudRun Proxy 📄
- **PDF**: Dùng **CloudRun Proxy** — vì cần giữ URL gốc để share cho người khác (Signed URLs không cho phép điều này).
- **HTML**: Dùng **Signed URLs** — chi phí thấp hơn (avg file ~20KB), URL vẫn giữ nguyên khi access.
- **Auth**: Cả hai phương thức đều kiểm soát authorization ở app layer (Cloud Run phát hành URL).
- **Validation**: Tích hợp vào `dev-kinken.lixil.co.jp` để test kết hợp với authentication infrastructure.

##### b. QA Evidence Policy 📋
- **Rule**: Lưu evidence cho cả Pass và Fail trên Google Drive.
- **Ngoại lệ**: Pass evidence chỉ bắt buộc cho chức năng quan trọng/ưu tiên cao. Các chức năng khác có thể bỏ qua.

##### c. Hybrid Search Demo Target 🔍
- **Deadline**: 10/31 (Fri) hoàn thành Hybrid Search.
- **Demo sớm**: GW muốn demo 10/30 (trước buổi họp KH). Ít nhất dùng data 取説 (description/manual).
- **Confirm**: MOR trả lời vào 10/27 (Mon).

##### d. Additional Feature Ticket Process
- Tạo ticket → assign Chien/Son → gắn Labels/Epic → ghi tài liệu liên quan → timing theo yêu cầu LIXIL.

##### e. ETL: Silver → Gold Finalized ✅
- KINKEN-387, 394: Finalize data from Silver to Gold Table — Delivered.

---
---
### Giai đoạn SPRINT 12 (Giữa kỳ - 2025/10/31)

#### 1. Milestone: Hybrid Search đã hoạt động 🎉
- **Status**: Full-text + Vector Search với **RRF** đã được triển khai xong cho `取説` (Description/Manual).
- **Còn lại**: Tuning search parameters cho các loại tài liệu khác (Technical, Catalog, FAQ, QA...) — target 11/10.
- **Logic**: GW yêu cầu làm rõ MOR có kế thừa công thức PoC (chỉ tune hyper-parameter) hay xây dựng công thức hoàn toàn mới. MOR sẽ trả lời qua Slack.

#### 2. Data Collection Platform: Cơ bản hoàn thành ✅
- **Nền tảng**: Thu thập data và Search Engine cơ bản đã xong.
- **Còn lại**: Import các hạng mục riêng biệt của từng loại tài liệu — đang xử lý (target 11/10).
- **Hiểu đúng**: Platform = chỉ cần nạp data liên tục; điều chỉnh nhỏ là bình thường.

#### 3. Sprint Re-scheduling (Sprint 12→15) 📅
- **Vấn đề**: Estimate hiện tại có thể chưa đủ chính xác, có nguy cơ phải điều chỉnh thêm.
- **Action**: MOR tự điều chỉnh task từ Sprint 12→13, Sprint 13→14/15 và re-estimate lại toàn bộ để phòng ngừa delay.

---
### Giai đoạn SPRINT 12 (Kết thúc 2025/11/07)

#### 1. Chiến lược Validation Vector Search 🔍
- **Quyết định**: Import thử nghiệm **1,000 bản ghi** phi cấu trúc cho Web Catalog, FAQ, Past QA để verify độ chính xác của Vector Search.
- **Data Integrity**: Chỉ import những bộ data có đầy đủ cả Structured và Unstructured vào Dev để đảm bảo tính nhất quán kết quả search.
- **Cost**: MOR được yêu cầu tính toán chi phí OpenAI embeddings cho toàn bộ dữ liệu.

#### 2. Chốt nội dung Vector hóa cho FAQ & QA 🧠
- **FAQ**: Vector hóa dựa trên trường `Question` + `Answer`.
- **Past QA**: Vector hóa dựa trên `Title` + `Detail Category` + `Detail Body`.
- **Lưu ý**: Document code không thể dùng làm input vector search (semantic meaning khác nhau hoàn toàn dù mã trông giống nhau).

#### 3. Lộ trình Infra (Terraform & Staging) 🏗️
- **Dev Terraform**: Dự kiến hoàn thành Sprint 13.
- **Staging Environment**: Mục tiêu hoàn thành 28/11 (nửa đầu Sprint 14).

#### 4. Thay đổi quy trình quản lý Bug 🐞
- **Chuyển đổi**: Spreadsheet → **Monday Tickets** (loại "Bug").
- **Q&A**: "Question" và "Other" vẫn dùng file Q&A hiện tại.

#### 5. Demo Signed URLs ✅
- Demo thành công phương thức Signed URLs cho Document Delivery từ GCS.

---
### Giai đoạn SPRINT 13 (Giữa kỳ - 2025/11/14)

#### 1. Chuẩn bị Public Dev Environment cho LIXIL 🌐
- **Mục tiêu**: Public môi trường dev tối thiểu cho khách hàng vào tuần tới.
- **Trạng thái**: Full-text search đã sẵn sàng (ngoại trừ Web Catalog, Maintenance, Product Update). Vector Search logic đã xong nhưng chưa có data vector thực tế để chạy.
- **Ưu tiên**: Giải quyết các bug liên quan đến số lượng kết quả tìm kiếm (result counts).

#### 2. Tối ưu chi phí & Bảo mật GCP 💰🔒
- **Cost**: Thiết lập lịch **tắt CloudSQL vào cuối tuần (T7-CN)**. Đang rà soát chi phí Elasticsearch và CloudRun.
- **Security**: Chuyển từ Public access sang **Cloud SQL Auth Proxy** cho CloudSQL để bảo vệ dữ liệu nhạy cảm.

#### 3. Lộ trình xây dựng môi trường Staging 🏗️
- **Quy trình**: GW (Static IP, SSL Cert) → LIXIL (A Record, AkamaiWAF) → MOR (Tạo LoadBalancer bằng **Terraform**).
- **Trạng thái**: Đang chuẩn bị phát hành domain cho Staging.

#### 4. Định hướng tương lai: MCP (Model Context Protocol) 🤖
- **Đề xuất**: Biến KINKEN thành một MCP server để các AI agent có thể truy xuất dữ liệu context hiệu quả.
- **Action**: GW đang hỏi ý kiến MOR về kinh nghiệm/dự toán cho mảng này.

#### 5. Nhân sự & Nghỉ lễ
- **MOR**: Khám sức khỏe định kỳ 17/12 & 19/12, một số member nghỉ.

---
### Giai đoạn 2025/11/21 (Tương ứng SPRINT 13 Finish)

#### Output Summary SPRINT 13 (Kết thúc Sprint / Sprint 13 Finished)

**Vấn đề / Issues**:
- Chưa phản ánh cập nhật từ Spec.md (Monday status update, artifact delivery, in progress, rollback tasks qua Sprint 14)
- Vận hành dictionary (từ điển): chỉ Morphological được reflect, Synonym cần reindex toàn bộ (cost, schedule impact)
- Dev data đang import vào index mới (v1.2 import, chờ QC test tuần kế, sau đó lên v1.3)
- Technical tài liệu/milestone vẫn gặp delay nhẹ (document_v1.2 ~ 24/11)
- CloudSQL chuyển Auth Proxy, Terraform cho STG đầu tuần tới

**Giải quyết / Solutions**:
- Đã cập nhật status trên Monday, hoàn tất một số task delivered, một số đang review/in progress
- Đã fix OOM lỗi cho description, tách process migrate index
- Đã thống nhất vận hành: khi đổi từ điển ⇒ tạo index version mới, reindex toàn bộ, switch alias sau khi xong
- Tiến trình data import, technical doc cập nhật tới milestone, teamwork MOR/GW đồng bộ

**Kết quả / Outcome**:
- Monday status đã update đúng, delivered nhiều task, review/đang làm task rõ ràng
- Dev môi trường data tiến triển tốt, kỹ thuật tracking (reindex/switch/alias) chuẩn
- Tất cả OK chuẩn bị sang SPRINT 14, backlog đã move task chuyển tiếp
- Đề xuất/issue sẽ xử lý ở Sprint tiếp theo

**Lesson learned**:
- Nếu chỉnh synonym dictionary phải estimate downtime/overhead reindex rõ, chuẩn bị dữ liệu/hỗ trợ phía GW
- Dev/Test nên validate dùng index sandbox trước khi switch alias
- Tracking artifact, status nên cập nhật liên tục song song trên Monday & file tiến độ nội bộ

---

#### Output Summary SPRINT 14 (During / Đang trong sprint)

**Tiến độ / Progress**:
- **Done tasks**:
  - KINKEN-230: Infra work (Chien)
  - KINKEN-418: Product Doc List API development (Bien)
  - KINKEN-434: [Bug][GW][Document-list screen][動画/movie] (Hoang)
  - KINKEN-437: [Bug][GW][Document-list screen][商品コード/product-code] (Hoang)
  - KINKEN-439: [Bug][Document-list screen] Pagination Result display incorrect (Truong, Kaz)
  - KINKEN-459: [Bug][Document-list screen] 商品コードマスタ document display empty (Hoang, Truong, Kaz)
  - KINKEN-472: [Bug][GW][Document-list screen][FAQ] (Hoang, Khoa)
  - KINKEN-475: [Bug][Document-list screen][点検修理手順書] Data display wrong format (Hoai)
  - KINKEN-426: FAQ/過去QA text data for vector & hybrid search (Truong, Hoang, Bien)
  - KINKEN-482: Category master latest data import (Chien)

**Vấn đề / Issues**:
- **GW muốn giảm độ ưu tiên**:
  - Tìm kiếm theo năm (Year search) trong Danh sách tên sản phẩm → Frontend done, Backend chưa làm
  - Chức năng so sánh product-specific → Nếu xử lý cùng màn hình list sẽ không chênh lệch effort nhiều, nên tiếp tục làm
- **Bug**: 図面 tab hiển thị 0 kết quả → Nghi ngờ do permission control, dự kiến fix trong ngày (KINKEN-491)
- **v1.3 Boost Score**: KINKEN-427 (boost score cho exact ID match) → Được ưu tiên, đã bổ sung vào Change Management v1.2→v1.3

**Quyết định / Decisions**:
- **API Key Management**: Không cần DB, chỉ dùng environment variables
  - (1) Auth via Apigee: KINKEN không cần xử lý
  - (2) Auth khi Apigee gọi KINKEN: KINKEN chỉ cần xử lý API key này
- **Common Search Platform**: GW đang hoàn thiện IF definition, dự kiến 12/5 hoàn thành

**Kế hoạch tiếp / Next Plan**:
- Fix bug 図面の tab hiển thị 0 kết quả (trong ngày)
- Tiếp tục các hạng mục v1.3
- Search verification & tuning: Xác nhận test data, MOR chuẩn bị benchmark
- Phát triển Common Search Platform (GW hoàn thành IF 12/5)

**Lesson learned**:
- Xử lý cùng lúc các màn hình liên quan giúp tiết kiệm effort hơn là tách ra làm sau
- API Key authentication cần rõ ràng phân biệt: (1) user→Apigee→KINKEN vs (2) system→Apigee→KINKEN

---

### Giai đoạn 2025/12/05 (Tương ứng SPRINT 14 Finish)

#### Output Summary SPRINT 14 (Finished)

**Done tasks**:
- KINKEN-388: Clean fields, normalize formats, split attributes → write to silver.
- KINKEN-297: Steel Mesh Fence Search API Development.
- KINKEN-456: [Bug][Document-list screen] Wrong result display.
- KINKEN-483: [Bug][Document-list screen][過去QA/question] 404 error on document title.
- KINKEN-484: [Bug][Document-list screen][過去QA/question or FAQ] 404 error on button 商品QA.
- KINKEN-485: [Bug][Document-list screen][FAQ/技術資料/点検修理手順書/電子商品連絡] 404 error on document title.
- KINKEN-488: [Bug][Document-list screen][技術資料/ technical] End of category content display "|”.
- KINKEN-492: [Bug][Document-list screen] Options not showing in dropdown filter.
- KINKEN-294: Test case design - System Integration.
- KINKEN-277: Test case design - Product Specific.
- KINKEN-289: Test case design - Product List & Detail.
- KINKEN-292: Test case design - Filters (S5).
- KINKEN-249: Test execution - Hybrid Search.
- KINKEN-230: Infra work.
- KINKEN-278: Product-specific document filter API development.
- KINKEN-418: Product Doc List API development.
- KINKEN-426: FAQ/過去QA vector & hybrid search data creation.
- KINKEN-482: Category master latest data import.
- KINKEN-430: [GW UAT] Issue in Document List.
- KINKEN-494: [BUG] Incorrect catalog code in WEB catalog.
- KINKEN-434: [Bug][GW][Document-list screen][動画/ movie].
- KINKEN-436: [Bug][GW][Document-list screen][取説/ description].
- KINKEN-437: [Bug][GW][Document-list screen][商品コード/ product-code].
- KINKEN-439: Pagination result display incorrect.
- KINKEN-459: Product code master document empty.
- KINKEN-460: [Bug][Document-list screen] Missing data in 点検修理手順書.
- KINKEN-472: [Bug][GW][Document-list screen][FAQ].
- KINKEN-473: [Bug][GW][Document-list screen][部品].
- KINKEN-475: [Bug][Document-list screen][点検修理手順書] Data display wrong format.
- KINKEN-491: [Bug][Document-list screen] All tab result 0 for 図面 tab.

**Issues**:
- Ongoing bug fixes for document list UI inconsistencies.
- Need to finalize synonym dictionary updates and reindex for v1.3.
- Coordination on API Key management and authentication.

**Decisions**:
- API Key stored in environment variables, no dedicated DB.
- Continue boosting ID exact match (KINKEN-427) in upcoming releases.
- Plan reindex to `documents_v1.4` after validation.

**Outcome**:
- Majority of tickets delivered, key infra work completed, API developments progressed.
- Documentation and backlog updated for upcoming SPRINT 15.

**Lesson learned**:
- Early integration testing catches UI bugs before release.
- Maintaining a clear API key strategy simplifies auth across services.
- Reindex planning essential when updating dictionaries.


### Giai đoạn SPRINT 15 (Kết thúc 2025/12/19)

#### Output Summary SPRINT 15 (Finished)

**Done tasks**:
- KINKEN-391/392: OCR issues handling (Truong NN)
- KINKEN-400: Databricks Jobs/Workflows with retry policies (Hoài Trần)
- KINKEN-463: Verify Jobs & Pipelines run (Hoài Trần)
- KINKEN-504: Data import Bug List (Hoang Tran, Hoài Trần)
- KINKEN-471/478: UI feedback handling (Phan Anh Tuấn)
- KINKEN-501: OCR target document control (Hoang Tran, Hoài Trần)
- KINKEN-506: Cast Door Search UI Implementation - Test QC (Thanh Tài)
- KINKEN-419: 商品資料一覧 UI / Product-specific Document UI (Phan Anh Tuấn, Tu Nguyen)
- KINKEN-499: 商品特定データインポート / Import data Product Search (biendt)
- KINKEN-420/421: Product-specific Document Filter/Document API (Phan Anh Tuấn)
- KINKEN-508: Cast Door/Shape Door/Steel Mesh Fence Details UI (Phan Anh Tuấn)
- KINKEN-512: UI feedback - QC Test (Tu Nguyen)
- KINKEN-513/519/521: Bug fixes cho Product List screen
- KINKEN-367: OCR issues implementation (Truong NN)
- KINKEN-295/283/288/304/296/286/310/314/272/321/326: Various API development completed

**Delivered tasks**:
- KINKEN-505: Shape Door Search UI - Test QC
- KINKEN-428: Movie interface field addition (Backend)
- KINKEN-517: Bug fix - Document list catalog tab
- KINKEN-526/527: Cast Door/Steel Mesh Fence Details - Test QC
- KINKEN-538: Bug fix - Category search from TOP screen

**Reviewing tasks**:
- KINKEN-231: Index design finalization
- KINKEN-263: Product/Document List Sort Order
- KINKEN-518: Bug - Document list tabs not functioning
- KINKEN-545: WEB catalog code name change
- KINKEN-429: Staging Environment Setup
- KINKEN-520: Technical documents tab display issue
- KINKEN-285: Shape Door Search API integration
- KINKEN-510: WEB catalog tool type mapping

**In Progress (moving to SPRINT 16)**:
- KINKEN-461: Technical document detail view check
- KINKEN-495/496: Product-specific TOP / Product-Document List API Integration
- KINKEN-413: Document name with page number for unstructured data
- KINKEN-466/500/507/509/511/515/516/534/535/537: Various bug fixes in progress
- KINKEN-299: Test Execution - Product List & Detail
- KINKEN-316: Terrace Search UI
- KINKEN-308: Test Case Design - SEO & Analytics

**Deferred to Next Sprint**:
- KINKEN-248: Search Accuracy Tuning
- KINKEN-470: Vector search field review
- KINKEN-489: Full-text search field review
- KINKEN-427: Boost score for exact ID match
- KINKEN-533: Bug - Product name search not hitting "FG" keyword

**GW Discussion Points**:
1. **Search Accuracy Evaluation Script**: Script preparation status confirmed; LIXIL requested to unify "code, ID" column to `documents.number`
2. **Staging Environment Setup**: Bucket/ES/RDB done; Databricks in progress (EOD 12/19). v1.3 data sync possible in 2-3 days after dev upgrade
3. **Cost Optimization**: CloudSQL stop, ES spec change, CloudRun min=0 during holiday period (12/24 - 1/4)
4. **v1.3 Data Import Schedule**: Morphological dictionary provided by 12/22; Full reindex required for embedding due to vector search field changes (KINKEN-490)

**MOR Discussion Points**:
- SEO/GA & Access Log/BigQuery MTG scheduled for 12/22-12/23

**Lesson learned**:
- Synonym dictionary changes require full reindex - estimate downtime clearly
- When embedding fields change, full re-vectorization is mandatory
- Staging environment data sync takes 2-3 days - plan accordingly

---

### Giai đoạn SPRINT 16 (Giữa kỳ - 2025/12/26)

#### Output Summary SPRINT 16 (During Sprint)

**Key Discussion Points (GW)**:

##### 1. Production Environment Buildout 🏗️
- **GCP Project Creation**: Đang yêu cầu tạo GCP project
- **Timeline**: Mong muốn hoàn thành infra vào cuối tháng 1
- **Chien-san Plan**: 19/1 ~ 28/1 (SPRINT 18)
  - ES, Databricks setup
  - SSL, Akamai EdgeWorker (giống quy trình staging)
  - Data (Bucket, Master Data,..)
- **Data Strategy**: 
  - Cơ bản dùng production data cuối cùng
  - Có thể tạm đưa test data → xóa toàn bộ → đưa production data trước release
  - Sẽ quyết định với LIXIL

##### 2. LIXIL Steering Committee (13/1/2026) 📋
Phía LIXIL sẽ báo cáo tình hình PJ cho các bên liên quan:

| Nội dung báo cáo | Chi tiết |
|------------------|----------|
| 資料一覧 (Doc List) | Độ chính xác search |
| 商品名一覧 (Product List) | Màn hình product list |
| 商品資料一覧 (Product Doc List) | Màn hình product document list |
| 商品特定 (Product Search) | Từ 1 loại exterior trở lên |

##### 3. 3 điểm quan trọng cần lưu ý ⚠️
| Điểm | Mô tả |
|------|-------|
| v1.3 data import hoàn thành | Cần đảm bảo import xong |
| Filter control trên 3 màn hình | Doc list, Product list, Product doc list |
| Product doc list tab display | Hiển thị các tab đúng cách |

**Risk & Action Items**:
- Hạn chế bug quá nhiều
- Hạn chế tình trạng không thể thao tác được
- Đảm bảo v1.3 data ready trước 13/1 cho steering committee

**Note**: SPRINT 16 Finished không có report do rơi vào giai đoạn nghỉ Tết bên Nhật.

---

### Giai đoạn SPRINT 17 (Kết thúc - 2026/01/16)

#### Output Summary SPRINT 17 (Finished)

**Key Discussion Points (GW)**:

##### 1. Elasticsearch Query Confirmation (To Kaz-san) 🔍

**Request 1: ES Query JSON for Product Search**
- **Need**: Query (JSON) thực tế đang được gửi tới Elasticsearch cho product name search
- **Response**: 
  - Query template đã được đặt tại: https://github.com/GuildWorks/lixil-kinken-etl/blob/main/elasticsearch/latest/queries/products.json
  - Query thực tế sẽ được dump và gửi sớm nhất có thể

**Request 2: Product Search Sort Order**
- **Question**: Thứ tự sắp xếp hiện tại của tìm kiếm tên sản phẩm là gì?
- **Response**: Tham khảo tại: https://github.com/GuildWorks/lixil-kinken-etl/blob/main/elasticsearch/latest/queries/products.json#L80

##### 2. Monday Ticket Comments (To Khoa-san) 📋
- GW đã comment vào 2 ticket trên Monday qua Slack
- Cần Khoa-san kiểm tra và phản hồi:
  - Ticket 1: https://guildworks-company.monday.com/boards/8984663897/pulses/10850816749/posts/4819509960
  - Ticket 2: https://guildworks-company.monday.com/boards/8984663897/pulses/10555613060/posts/4819509851

##### 3. Refinement for Additional Tickets (Feedback / Bug) 🐞
- **Purpose**: Thực hiện refinement cho các ticket bổ sung
- **Reference**: https://docs.google.com/spreadsheets/d/1hI6XGjex7by8yihYztTsh1nHavaSrMa7n5dPSI49YLA/edit?gid=0
- **Status**: GW đã ghi lại các mong muốn → MOR sẽ xem xét và thảo luận nội bộ

**Outcome**:
- ES query documentation đã được cung cấp qua GitHub link
- Monday tickets đang chờ Khoa-san phản hồi
- Feedback/Bug refinement sẽ được MOR xem xét nội bộ

**Lesson Learned**:
- ES query template nên được documentation đầy đủ từ sớm để dễ tra cứu
- Communication qua Slack + Monday cần được track kỹ để tránh miss items
- Refinement process cho feedback/bug tickets cần có quy trình rõ ràng

---

### Giai đoạn SPRINT 18 (Giữa kỳ - 2026/01/23)

#### Output Summary SPRINT 18 (During Sprint)

**Key Discussion Points (GW)**:

##### 1. Document URL Structure trong KINKEN 🌐

**Current URL Format**:
```
https://dev-kinken.lixil.co.jp/i/docs/technical/files/mpi/IDC0000573.pdf?docCode=tecD_797162
```

**Components**:
- `IDC0000573` = 技術資料ID (document_technical_id)
- `docCode` parameter = cần cho Signed URL issuance & user role verification

**Question**: Có cần `docCode` ở cuối URL không?
**Answer**: ✅ Cần - để thực hiện signed URL & check user role

**Action**: LIXIL sẽ thực hiện URL migration, cần test URL hoạt động đúng. GW sẽ tạo ticket riêng cho MOR.

**Priority**: HIGH - là một phần của migration work phía LIXIL

##### 2. Backlog Ticket Review 📋
- Rà soát và thống nhất nội dung các ticket đã tạo trên Backlog

##### 3. SPRINT 18 Progress Concern ⚠️

**Context**: Còn 1 tuần là hết SPRINT 18

**Question**: Liệu có thể hoàn thành hết các ticket của SPRINT 18 không?

**Response**:
- **Task**: Sẽ review đủ thông tin đối ứng task trong sprint và báo lại đầu tuần sau
- **Test**: Một số task test sẽ cần tiếp tục kéo dài sang SPRINT 19

##### 4. Jobs/Orchestration/Monitoring (To Chien-san) 📊

**Monday Ticket**: GW đã comment trong ticket liên quan đến `[Jobs / Orchestration / Monitoring]`

**Current Databricks Capabilities**:
- ✅ Xem execution history của các job
- ✅ Xem execution status
- ✅ Xem execution time

**Planned**: Bổ sung alert notification tới Slack

##### 5. Tracking #17 Priority 🔍

**Request**: Nâng mức độ ưu tiên và xử lý issue Tracking #17

**Status**:
- ✅ Query cho document search (bao gồm product document list) đã hoàn tất
- 🔄 Backend đang tiến hành tích hợp
- 🔄 Đồng thời triển khai cho phần product

**Reference**: https://docs.google.com/spreadsheets/d/1gQvvWq8V11KI6HV4WQpchAi0-lwyzl7v/edit?gid=2000715935

---

#### Output Summary SPRINT 18 (Finished - 2026/01/30)

**Key Discussion Points (GW)**:

##### 1. Product-Limited Mode Cross-Document Search 🔍

**Question 1**: Trong product-limited mode, có thể tìm kiếm keyword giữa các loại tài liệu được liên kết với PIM bằng product code không?

**Document Types**:
- 取説 (Description)
- 図面 (Zumen/Drawings)
- 技術資料 (Technical)
- WEBカタログ (Web Catalog)

**Status**: ✅ Logic đã implement, nhưng phần hiển thị chưa đúng → Sẽ fix

**Feature Request**: Mong muốn có tab "すべて" (All) cho phép tìm kiếm 4 loại tài liệu trong product-limited mode
**Status**: → Sẽ fix phần hiển thị, bao gồm cả tính năng này

---

**Question 2**: Có thể tìm kiếm keyword giữa FAQ và 過去QA (Past QA) dựa theo category path từ category ID không?

**Status**: ✅ Logic đã implement, nhưng phần hiển thị chưa đúng → Sẽ fix

**Feature Request**: Mong muốn có tab "すべて" (All) cho FAQ và Past QA trong product-limited mode
**Status**: → Hiện tại chưa có, sẽ xem xét thêm vào

---

**Question 3 (Best Case)**: Có thể có tab "すべて" tìm kiếm TẤT CẢ 6 loại tài liệu trong product-limited mode không?

**Document Types**:
- 取説, 図面, 技術資料, WEBカタログ (PIM-linked)
- FAQ, 過去QA (Category-based)

**Challenge**: Cách tìm kiếm của PIM documents và non-PIM documents khác nhau

**Status**: → Sẽ xem xét, nhưng có thể khó thực hiện

**Decision**: Pattern này có thể không cần đối ứng, tạm thời không cần xem xét

---

**Question 4**: Hiện tại tab FAQ và 過去QA trong product-limited mode có hoạt động đúng không?

**Implementation Status**:
- ✅ Pattern theo Category ID: Đã implement
- ✅ Pattern theo Keyword: Đã implement

---

### SPRINT 18 Summary

**Completed**:
| Item | Status |
|------|--------|
| Document URL structure clarification | Done - docCode needed for signed URL & role check |
| ES Query for document search | Done - Backend integrating |
| Product search query deployment | In progress |
| Jobs/Orchestration/Monitoring review | Done - Slack alert planned |
| Product-limited mode cross-search | Logic done, display fix needed |

**Pending to SPRINT 19**:
- Một số task test
- Display fix cho product-limited mode
- Tab "すべて" implementation (đang xem xét)

**Lesson Learned**:
- Document URL structure cần được document rõ ràng cho migration team
- Cross-document search trong product-limited mode có 2 loại: PIM-linked và Category-based
- Khi logic đã implement nhưng display sai, cần fix UI priority
- Test tasks có thể kéo dài sang sprint tiếp theo - cần plan buffer

---

### Giai đoạn SPRINT 19 (Giữa kỳ - 2026/02/06)

#### Output Summary SPRINT 19 (During Sprint)

**Key Discussion Points (GW)**:

##### 1. Search Accuracy Improvement 🔍

**Problem**: Keyword behavior inconsistency
- `サーモス　クレセント` → Parts data HIT ✅
- `サーモス　クレセント　部品` → Parts data NOT HIT ❌
- `サーモス　クレセント　図面` → Zumen data NOT HIT ❌
- `サーモス　クレセント　寸法` → Zumen data NOT HIT ❌

**Root Cause**: Parts và Zumen search fields không chứa các từ như `部品`, `図面`, `寸法`

**Proposed Solution (Add Tag approach)**:
- Thêm trường chung `検索補助キーワード` (Search Support Keyword)
- ETL tự động gán: Zumen → `"図面 寸法"`, Parts → `"部品 XXX"`
- **Pros**: Giải quyết vấn đề "không hit"
- **Cons**: Có thể cần điều chỉnh ranking

**Alternative Solution**: Điều chỉnh keyword khi tìm kiếm (MOR đề xuất)

**Status**: ✅ MOR xác nhận Add Tag không phải ý tưởng tồi, đang xem xét cả 2 phương án

##### 2. File Transfer Automation 📦
**Ticket**: [KINKEN-659] Tự động hóa `lixil-kinken-docs-upload-{env}` → `lixil-kinken-docs-{env}`

**Solution**: Cloud Function + Lifecycle Policy để tự động xóa upload bucket

##### 3. Product-Limited Mode Keyword Behavior 📋
**Status**: ✅ Đã thống nhất - https://docs.google.com/spreadsheets/d/1vWz4uFG20pUn5r0hxoeJRo7hRR313IFCkfi3mkRdUyQ/edit?gid=1946895253

##### 4. Security Testing 🔒
**Decision**: MOR sẽ tự test theo quan điểm của MOR

---

#### Output Summary SPRINT 19 (Finished - 2026/02/13)

##### 1. In-Progress Tasks Before Tết Holiday 🎯
**Request**: Hoàn thành tối đa task trước nghỉ Tết

**Upcoming**: Load/Performance testing, Migration, Feedback handling

**Chien-san**: 🙇 Xin lỗi vì còn nhiều ticket, team đang nỗ lực đẩy nhanh

##### 2. Bug Ticket Handling 🐞
**Status**: 
- ✅ Đã xem xét sơ bộ
- E2E scope: Một số ticket trong E2E test
- Outside E2E: Đánh giá lại, rà soát tài liệu, cập nhật test case

##### 3. Feedback & Additional Requirements 📝
**Meeting**: 24/2 (Tue) 15:00-16:30 JST

##### 4. Tết Holiday Wishes 🇻🇳🎉
**Take-san**: Chúc kỳ nghỉ tốt！
**Chien-san**: Cảm ơn, sau Tết sẽ tiếp tục phối hợp chặt chẽ
**Take-san**: Special Thanks 😘

**Lesson Learned**:
- Search accuracy cần giải quyết từ góc độ UX, không chỉ technical
- Bug tickets cần categorize theo E2E scope
- Communication trước kỳ nghỉ dài cần rõ ràng
- Team morale quan trọng trong sprint cuối

---

### Giai đoạn SPRINT 20 (Kết thúc - 2026/02/27)

**Note**: SPRINT 20 During không có report do rơi vào Tết Nguyên Đán của Việt Nam.

#### Output Summary SPRINT 20 (Finished)

**Key Discussion Points (GW)**:

##### 1. Special Thanks ❤️
- Data Import dev & Staging
- Bug fix
- Feature Update
- Special Support

##### 2. WEB Catalog Preview Button (KINKEN-726) 🖼️

**Request**: Set button preview cho WEBcatalog trên document list

**Priority**: HIGH - Yêu cầu từ LIXIL có mức độ cao

**Chien-san**: Sẽ confirm thêm SPEC

##### 3. Search Support Keyword Tag (KINKEN-730) 🏷️

**Ticket**: Muốn đăng ký cố định các keyword có tần suất nhập cao nhưng không có trong tài liệu dưới dạng tag

**Context**: Đây là giải pháp cho vấn đề search accuracy đã thảo luận ở SPRINT 19

**Status**: Phương án xử lý đã được quyết định → Tiến hành triển khai

**Reference**: https://www.notion.so/2fe064bd652780b9bbdfeb99cb56004a

##### 4. Data Import Performance Improvement 🚀

**Achievement**: ✅ Đã cải thiện tốc độ Data Import

**Root Causes**:
| Issue | Impact |
|-------|--------|
| Join table | Query để lấy thông tin cần index chậm |
| Bulk API limitations | Chưa auto scale theo cluster, chưa chạy đa luồng |
| ES & Databricks SPEC | Cần xem xét lại |

**Solutions Implemented**:

1. **MATERIALIZED VIEW** ✅ (Hiệu quả cao)
   - Tạo M_View cho data cần indexing
   - Query chỉ từ M_View → Nhanh hơn
   ```sql
   CREATE OR REPLACE MATERIALIZED VIEW lixil_kinken_dev_gold.mv_webcatalog_embeddings
   AS SELECT d.id, d.chunk_id, em.embedding AS chunk_embedding
   FROM lixil_kinken_dev_gold.document_index_fulltext d
   JOIN lixil_kinken_dev_gold.embeddings em ON d.chunk_id = em.chunk_id
   WHERE d.document_type = 'webcatalog' AND d.gold_status = 'ready_index_vector';
   ```

2. **Notebook Splitting** ✅ (Hiệu quả cao)
   - Kiểm tra số lượng data cần indexing
   - Chia ra số lượng Notebook tương ứng compute

3. **ES SPEC Upgrade** ✅
   - Update SPEC ES dev giống với môi trường PROD
   - Hiện tại dev ES đã gần bằng PROD, sẽ đồng bộ hoàn toàn cho load test

4. **Spark-based Indexing** ✅ (Hiệu quả cao)
   - Tạo notebook mới để thực hiện indexing
   - Sử dụng Spark thay vì Bulk API
   - Spark control quá trình index tốt hơn

**Impact**: 
- Solutions 2 & 4 có hiệu quả đặc biệt cao
- Tất cả solutions kết hợp → Tăng tốc tổng thể
- Áp dụng cho tất cả jobs liên quan đến vector data

**Next Steps**: 28/2, 1/3 - Team xem xét cải thiện Job và tối ưu index thêm

##### 5. Staging Data Import Status 📊

**Target**: Hoàn thành 6/3 (Fri)

**Next Phase**: 9/3 (Mon) - Bắt đầu đưa dữ liệu vào môi trường PRODUCTION

**Current Status (27/2)**:

| Document Type | Status |
|---------------|--------|
| Product, Zumen, Movie, Parts-search | ✅ Complete |
| CAD, Product-code | 🔄 In progress |
| FAQ | ⏳ Unstarted (chờ file từ GW) |
| Description, Technical, Maintenance, Product-update | 🔄 OCR Progress |
| Question, Web-catalog | 🔄 Dev → Staging copy |

**Risk**: Web-catalog x Product data inconsistency
- Web-catalog: Dev → Staging (dev data)
- Product: Import mới vào Staging
- Có thể phát sinh bug do combination data
- **Mitigation**: Import lại Web-catalog x Product data nếu cần (PIM code-based)

**MOR Discussion Points**:

##### 6. Team Structure từ tháng 3 👥

**Total**: 5.5 MM

| Role | Members | MM |
|------|---------|-----|
| **FE** | Phan Anh Tuan | 1.0 |
| **BE** | Tran Dinh Hoang (1.0), Tran Thanh Hoai (0.5), Vo Dang Khoa (0.5) | 2.0 |
| **Tester** | Tu-san (0.5), Tai-san (0.5) | 1.0 |
| **AI Leader** | Chien-san | 0.5 |
| **AI Senior** | An-san | 0.5 |
| **MOR/PM** | Kaz-san | 0.5 |
| **MOR/BrSE** | Hang-san | 0.5 |

**Note**: Truong's farewell, An's introduction

---

### SPRINT 20 Summary

**Completed**:
| Item | Status |
|------|--------|
| Data Import performance improvement | ✅ Done - MATERIALIZED VIEW + Spark-based indexing |
| Search Support Keyword Tag decision | ✅ Approved - KINKEN-730 to proceed |
| Staging data import progress | 🔄 On track for 6/3 completion |
| Team structure for March | ✅ Confirmed - 5.5 MM |

**Key Achievements**:
- **Performance**: Data import tăng tốc đáng kể nhờ M_View + Spark
- **Search Accuracy**: Add Tag solution được approve (KINKEN-730)
- **Production Readiness**: Staging data import on track → PROD import 9/3

**Pending**:
- WEB Catalog preview button (KINKEN-726) - SPEC confirmation
- FAQ data import (chờ file từ GW)
- Web-catalog x Product data consistency verification

**Lesson Learned**:
- MATERIALIZED VIEW + Spark-based indexing là game changer cho performance
- Notebook splitting theo compute resources rất hiệu quả
- ES SPEC cần match PROD từ sớm để test chính xác
- Data import staging → prod cần careful planning cho consistency
- Team transition (Truong out, An in) cần smooth handover

---

### Giai đoạn SPRINT 19 (Giữa kỳ - 2026/02/06)

#### Output Summary SPRINT 17 (During Sprint)

**Key Discussion Points (GW)**:

##### 1. Schedule từ tháng 2 trở đi 📅
- **MOR Test Plan**: Chien-san sẽ cung cấp chi tiết sau SPRINT 17 (16/1)
- **Overview Test Activities**:

| Test Type | Timeline | Mô tả |
|-----------|----------|-------|
| Performance Evaluation | 31/01 | Đánh giá performance hiện tại |
| Bug Re-verification | Feb | Re-verify các bugs đã phát sinh trong quá trình phát triển |
| End-to-End Testing | Feb | Tổng hợp & Kiểm thử E2E |
| Load & Performance Testing | Feb | Kiểm thử Hiệu năng & Tải |
| Security Testing | Feb | Kiểm thử Bảo mật |
| Regression Testing | Feb-Mar | Kiểm thử Hồi quy |
| Post-Migration Validation | Mar | Kiểm thử sau Chuyển đổi Dữ liệu |
| UAT Support | Mar-Apr | Kiểm thử Chấp nhận người dùng |

**UAT Preparation**:
- Chuẩn bị môi trường, dữ liệu và hướng dẫn cho khách hàng thực hiện UAT
- Hỗ trợ kỹ thuật và ghi nhận phản hồi trong quá trình UAT

##### 2. Bug Lifecycle Process 🐞

**Quy trình xử lý và sửa lỗi (Bug Lifecycle)**:

| Step | Action | Owner |
|------|--------|-------|
| (1) | QC confirm bug (từ MOR, GW, LIXIL) | QC |
| (2) | Add/Update Monday với đầy đủ thông tin: bug content, expected result, environment, priority | QC, MOR-san, GW-san |
| (2a) | Bổ sung status mới: Ready for Test STG, Ready for Test PROD, Ready to deploy STG, Ready to deploy PROD | - |
| (3) | Chien-san xem xét và assign Dev Team, quyết định NextAction | Chien-san |
| (4) | Dev Team Fix, Comment, PR | Dev Team |
| (5) | Review PR (Take-san, Chien-san, Kaz-san), có thể xem xét Team review chéo | Reviewers |
| (6) | QC verify trên Dev và báo kết quả | QC |
| (6a) | PASS → continue step (7); NG → Re-work step (3) | - |
| (7) | Take-san, Chien-san, Kaz-san dựa vào (6) để xác định NextAction: Plan deploy to STG/PROD | Leadership |
| (8) | Confirm LIXIL (GW-san) và báo các bên liên quan | GW |

**Phương án đảm bảo tiến độ sửa lỗi**:
- Phân loại ưu tiên rõ ràng
- Họp điều phối hàng ngày (Daily Sync)
- **"Done" Definition**:
  - Code đã được sửa và merge vào nhánh chính (main, deployment/staging, deployment/production)
  - Đầy đủ thông tin: Nguyên nhân, Giải pháp, Impact (nếu có), Evidence
  - Đã được deploy lên môi trường Dev, Staging, Production
  - Đã được QC Team xác nhận hoạt động đúng trên từng môi trường
  - Không gây ra lỗi hồi quy cho các chức năng liên quan

##### 3. Production Environment Buildout Timeline Update 🏗️

**Original Plan**: 19/1 ~ 28/1 (SPRINT 18)

**Updated Plan**: **12/1 ~ 19/1** (1 tuần sớm hơn)

**Lý do thay đổi**:
- Tuần này (SPRINT 17) sẽ DONE các phần sau:
  - Cloud Function: kinken-product-search-import-data, kinken-sitemap
  - ETL: Add data for filter condition
- Update IAC và triển khai cho môi trường STG và PROD

**Production Environment Setup**:
- Environment variables list: Chien-san sẽ gửi 12/1
- Elastic Production accounts:
  - Kaz-san: tu.phungvan+lixil-kinken-es-prod@morsoftware.com
  - Truong-san: truongnn+lixil-kinken-es-prod@mor.com.vn
  - Chien-san: chiennd+lixil-kinken-es-prod@morsoftware.com

##### 4. Infrastructure Cost Estimation 💰
- **Timeline**: Đầu tuần sau (tuần 13/1)
- **Owner**: Chien-san
- **Ref**: Slack message https://mor-g.slack.com/archives/C07LV77PTFD/p1767684119348129

##### 5. Search Normalization Processing Documentation 📝
- **Task**: Tổng hợp & làm rõ nội dung xử lý chuẩn hóa khi tìm kiếm (khi indexing)
- **Status**: Đang tổng hợp
- **Timeline**: Hoàn thành và chia sẻ vào 12/1 (Monday)
- **Owner**: Kaz-san

**MOR Discussion Points**:

##### 6. Sprint Planning & Quality Focus 🎯

**Timeline Status**:
- Thời gian phát triển còn lại: **dưới 1 tháng** (2 sprints)
- Mục tiêu: Hạn chế tối đa các hạng mục bị tồn đọng và kéo dài sang sprint tiếp theo

**Parallel Activities** (ngoài ticket development):
- **Change Management v1.3 → v1.4**: 
  - Plan: https://docs.google.com/spreadsheets/d/1YlZymL4DGgtSEaugIlIQdahttkQaUy3euQJXT6Y4inY/edit?gid=2126318809
- **Preparation for 13/1 Steering Committee**:
  - Gửi thông tin report về status các chức năng
  - Ref: https://www.notion.so/guildworks/2025-12-26-Output-Summary-Report-SPRINT16-During-2d4064bd6527800caf77c8609b011108
- **Function List**: 3 functions chưa start, đánh giá có thể hoàn thành trong development period
  - Ref: https://docs.google.com/spreadsheets/d/1MXeYn9oEf85ahVCQiFDT2jFqRCaOc_FmJSPhmpEYm7Y/edit?gid=916431292

**Next Actions**:
- Ưu tiên các task độ ưu tiên cao
- Plan cho 13/1: https://mor-g.slack.com/archives/C07LV77PTFD/p1767589064897339
- **OT (Overtime)**: Thực hiện OT để đẩy nhanh, bao gồm 1 phần task SPRINT 18, để có nhiều thời gian cho đảm bảo chất lượng
- **Quality Assurance**: Plan check lại Round 1

**Lesson Learned**:
- Bug lifecycle process cần rõ ràng với definition of "Done" đầy đủ
- Daily sync meeting quan trọng để đảm bảo tiến độ sửa lỗi
- Cần chuẩn bị sớm cho UAT: môi trường, data, documentation
- Production environment setup có thể đẩy sớm hơn plan nếu dependencies hoàn thành trước

---

#### Output Summary SPRINT 16 (Planning Phase - 2025/12/19)

**Key Focus Areas**:

1. **v1.3 Data Import & Dictionary Management** 🔄
   - Morphological dictionary delivery: 12/22 (Fri)
   - v1.3 import start: 12/22 onwards
   - Full re-embedding required (KINKEN-490 vector search field changes)
   - OCR: Only diff data between v1.2 and v1.3
   - Timeline: 2-3 days for complete import process

2. **Search Accuracy Evaluation** 🔍
   - Script preparation status: Mostly ready
   - LIXIL action: Unify "code, ID" column to `documents.number`
   - Benchmark testing: MOR to prepare after v1.3 deployment

3. **Staging Environment Finalization** 🏗️
   - Databricks: In progress (EOD 12/19)
   - v1.3 data sync to staging: Possible 2-3 days after dev upgrade
   - Cost optimization: CloudSQL stop, ES spec change, CloudRun min=0 (12/24 - 1/4)

4. **SEO/GA & Access Log/BigQuery Preparation** 📊
   - MTG scheduled: 12/22 (Mon) 15:00-17:00 JST / 13:00-15:00 VNT
   - Alternative: 12/23 (Tue) 15:00-18:00 JST
   - Participants: Chien, Hang, other members (TBD)

5. **Bug Fixes & Document List Issues** 🐞
   - CAD detail transition (KINKEN-535)
   - WEB catalog page transition (KINKEN-537)
   - Document list tab count inconsistencies (KINKEN-516)
   - Technical documents tab display (KINKEN-520)

**Backlog Tasks Moving from SPRINT 15**:
- KINKEN-248: Search Accuracy Tuning
- KINKEN-470: Vector search field review
- KINKEN-489: Full-text search field review
- KINKEN-427: Boost score for exact ID match
- KINKEN-533: Product name search keyword matching

**Planned Deliverables**:
- v1.3 data import completion
- Staging environment ready for testing
- Search accuracy evaluation script finalized
- Bug fixes for document list UI issues
- SEO/GA & BigQuery integration planning

**Risk & Mitigation**:
- **Risk**: Morphological dictionary delay → **Mitigation**: Confirm delivery by 12/20
- **Risk**: Full re-embedding takes longer than estimated → **Mitigation**: Prepare parallel processing
- **Risk**: Staging environment not ready → **Mitigation**: Prioritize Databricks completion

**Lesson learned from SPRINT 15**:
- Dictionary changes require full reindex - always estimate downtime
- Vector search field changes mandate full re-vectorization
- Staging sync takes 2-3 days - plan buffer time
- Cost optimization during holidays needs advance planning


### Giai đoạn 2026/02/02 (Tương ứng SPRINT 15-25: PROD Release Preparation)

#### Tổng quan Backlog từ CSV (SAGAS_Current_Iteration_Backlog)

**Giai đoạn 1: Bug Review & Validation (2026/02/02 - 2026/02/13)**

| Task | Labels | Timeline | Mô tả |
|------|--------|----------|-------|
| 開発段階のバグレビュー・検証 / Rà soát & Xác minh Bug giai đoạn phát triển | 評価・準備 | 2026/2/2 - 2026/2/6 | Review và verify bug trong giai đoạn phát triển |
| Import v1.4 | AI/ETL | 2026/2/2 - 2026/2/10 | Import dữ liệu version 1.4 |
| E2Eテスト / Kiểm thử E2E | システムテスト | 2026/2/6 - 2026/2/13 | End-to-end testing toàn pipeline |
| セキュリティテスト / Kiểm thử Bảo mật | 非機能テスト | 2026/2/6 - 2026/2/13 | Penetration testing, vulnerability scan |
| バグ修正・システム最適化 / Fix Bug & Tối ưu hệ thống | バグ対応 | 2026/2/2 - 2026/2/13 | Sửa bug và tối ưu hệ thống |
| 顧客フィードバックの追跡・対応 / Theo dõi & Xử lý Feedback | 管理・サポート | 2026/2/2 - 2026/2/13 | Thu thập và xử lý phản hồi khách hàng |

**Giai đoạn 2: Regression & Performance (2026/02/23 - 2026/03/06)**

| Task | Labels | Timeline | Mô tả |
|------|--------|----------|-------|
| 回帰テスト / Kiểm thử Hồi quy | システムテスト | 2026/2/23 - 2026/2/27 | Regression test suite |
| パフォーマンス評価 / Đánh giá hiệu năng | 評価・準備 | 2026/2/23 - 2026/3/6 | Benchmark và performance tuning |
| データ移行の確認 / Xác nhận Data Migration | データテスト | 2026/2/23 - 2026/3/6 | Xác nhận migration data |
| サポート体制・リスク軽減策の確立 / Thiết lập Hỗ trợ & Giảm thiểu Rủi ro | UAT準備 | 2026/3/2 - 2026/3/6 | Thiết lập support mechanism |
| ユーザー体験テスト（UX / Usability） | ユーザー体験テスト | 2026/2/23 - 2026/2/27 | UX/usability testing |
| 最終パフォーマンステスト / Kiểm thử Hiệu năng Final | 最終テスト | 2026/2/27 - 2026/3/6 | Final performance test |

**Giai đoạn 3: UAT & Production Prep (2026/03/09 - 2026/04/10)**

| Task | Labels | Timeline | Mô tả |
|------|--------|----------|-------|
| UAT支援 / UAT Support | 継続的UATサポート | 2026/3/9 - 2026/3/28 | Continuous UAT support |
| 未解決課題の対応・解消 / Resolution of Outstanding Issues | 残存課題対応 | 2026/3/9 - 2026/3/20 | Xử lý các vấn đề còn lại |
| パフォーマンスおよび安定性の最適化 / Performance & Stability Optimization | システム最適化 | 2026/3/9 - 2026/3/20 | Tối ưu hiệu năng và ổn định |
| 運用準備テスト / Operational Readiness Testing | 運用テスト | 2026/3/30 - 2026/4/10 | Kiểm tra sẵn sàng vận hành |
| 顧客フィードバックの追跡・対応 / Theo dõi & Xử lý Feedback | 管理・サポート | 2026/3/9 - 2026/3/20 | Tiếp tục theo dõi feedback |

**Giai đoạn 4: UAT Closure & PROD Release (2026/03/23 - 2026/05/12)**

| Task | Labels | Timeline | Mô tả |
|------|--------|----------|-------|
| UAT完了・サインオフ / UAT Closure & Sign-off | 最終UATサポート | 2026/3/23 - 2026/4/3 | Hoàn thành UAT và ký sign-off |
| 本番環境更新 / Production Environment Update | 本番環境更新 | 2026/3/23 - 2026/4/3 | Cập nhật môi trường production |
| 本番データ移行のリハーサル / Production Data Migration Dry-run | データ移行最終確認 | 2026/3/23 - 2026/4/3 | Dự kiến migration production |
| 障害シナリオ検証 / Failure Scenario Validation | 障害シナリオ検証 | 2026/3/30 - 2026/4/10 | Test các kịch bản lỗi |
| 本番前最終テスト / Pre-production Final Testing | 最終システムテスト | 2026/3/23 - 2026/4/3 | Final pre-production testing |
| 運用トレーニングおよび引き継ぎ / Operations Training & Handover | 運用チームトレーニング | 2026/3/23 - 2026/4/3 | Training và bàn giao cho vận hành |
| 本番リリースに向けてやること / Việc cần làm để chuẩn bị cho release production | - | 2026/5/1 - 2026/5/12 | PROD release preparation |

**Key Backlog Items (From CSV - Sorted by Timeline)**

| Priority | Task | Labels | Timeline |
|----------|------|--------|----------|
| HIGH | インフラ：本番環境構築 / Production Environment Setup | INFRA | 2026/1/12 - 2026/1/20 |
| HIGH | セキュリティレビュー / Security Review | Review | 2026/1/20 - 2026/1/24 |
| HIGH | 脆弱性テスト / Security Vulnerability Testing | QC | - |
| HIGH | 負荷テスト / Load & Performance Testing | QC | - |
| HIGH | MDM Production connection | - | - |
| HIGH | [移行：Migration] 差分自動連携開始 (PIM) | - | 2026/4/13 |
| MEDIUM | [Staging/ PRODUCTION] GCP: Build Notification | インフラ | - |
| MEDIUM | データ収集基盤において関連データを追加・変更・削除に対応させたい | - | 2026/4/28 - 2026/5/8 |
| MEDIUM | index のバックアップを取得するジョブを定義したい | 方式検討:Elasticsearch設計 | 2026/4/1 - 2026/4/11 |
| MEDIUM | [運用] 手動でバックアップした index に切り替える時の運用手順書を作成 | 方式検討:Elasticsearch設計 | 2026/4/1 - 2026/4/4 |
| MEDIUM | [運用] 形態素辞書を最新化する際の運用手順書を作成 | 方式検討:Elasticsearch設計 | 2026/4/1 - 2026/4/4 |
| MEDIUM | [運用] 同義語辞書を最新化する際の運用手順書を作成 | 方式検討:Elasticsearch設計 | 2026/4/1 - 2026/4/4 |
| MEDIUM | [運用] ES のゴミデータを確認、削除するための運用手順書を作成 | 方式検討:Elasticsearch設計 | 2026/4/1 - 2026/4/30 |
| LOW | SEO / パンクズを見直したい / SEO and breadcrumb | - | - |
| LOW |  상품特定TOPのカテゴリ一覧に設定されたURLを見直したい | 追加要望 | - |

**Critical Issues từ CSV cần theo dõi:**

| Issue | Priority | Mô tả |
|-------|----------|-------|
| MySQL server has gone away | CRITICAL | Lỗi kết nối MySQL, cần investigate |
| Error searching documents in ES: Connection timed out | CRITICAL | ES connection timeout |
| Application error 発生時に専用画面を表示したい | HIGH | Frontend error handling |
| [PROD] プレビューが遅い資料がある | HIGH | Preview performance trên production |

**Infrastructure Tasks:**

| Task | Labels | Timeline |
|------|--------|----------|
| インフラ：ステージング環境構築 / Staging Environment Setup | インフラ | 2025/12/8 - 2025/12/12 |
| [インフラ] CloudRun の ERROR ログを Slack に通知したい | インフラ | - |
| Apigee 疎通検証 / Test kết nối Apigee | インフラ | - |
| 外形監視を導入したい | インフラ | - |
| [インフラ] dev/Staging の CloudRun 最小インスタンス数を0にしたい | - | - |
| [インフラ] CloudSQL MySQL Version Upgrade 8.0 → 8.4 | インフラ | - |

**Lesson Learned (Từ CSV backlog):**
- Cần lên kế hoạch reindex trước mỗi đợt import lớn (v1.4, v1.5)
- Chuẩn bị tài liệu vận hành (SOP) cho index management từ sớm
- Test failure scenarios trước khi vào production là bắt buộc
- Tối ưu chi phí cloud (CloudSQL auto-stop, ES spec) cần track thường xuyên

---

### Giai đoạn SPRINT 21 (Kết thúc - 2026/03/13)

#### Output Summary SPRINT 21 (During - 2026/03/06)

**Key Discussion Points (GW)**:

##### 1. Production Environment & Data Migration 🏗️

**Full Data Import Plan**:
- **Tuần sau (3/10)**: Nhận dữ liệu full mới nhất từ PIM
  - Product, Description (取説), Zumen (図面), Technical (技術資料), Web Catalog, CAD
- **Kế hoạch import**: Plan [A] hoặc Plan [B]

**Plan [A] - Fresh Import (Ưu tiên)**:
- Question & Web-catalog: Import toàn bộ trong 1 tuần
- Dữ liệu còn lại: Import toàn bộ trong 1 tuần
- **Lợi ích**: Không cần copy từ dev, tất cả import mới

**Plan [B] - Hybrid (Nếu Plan A khó)**:
- Question & Web-catalog: Copy từ dev → PRODUCTION (raw/Bronze/Silver/Gold/ES)
- Dữ liệu còn lại: Import theo quy trình ETL thông thường
- **Cần**: Chien-san mô tả chi tiết quy trình

**Dữ liệu chờ kết nối từ LIXIL**:
- Product-update, Maintenance, Product-code: Yêu cầu thiết lập kết nối
- FAQ, Parts-search: Chuẩn bị vào nửa đầu tuần sau

**Dictionary Data**:
- Synonym: https://drive.google.com/file/d/1OaUyvGtru0CixLgiGYs7TIgQAw4SthxC/view
- Userdict: https://drive.google.com/file/d/1ydyYMBWZMzAKj5QmgAgd3j8B6bwD9FBe/view
- Sẽ áp dụng khi import vào production

##### 2. Staging Data Status 📊

**Web Catalog × Product**:
- ✅ ETL-related data đã đồng bộ vào Staging

**Question Data Issue**:
- ❌ Hiện tại chỉ tồn tại trong ES của Staging, không có trong ETL layers
- **Vấn đề**: Không thể thực hiện import phần diff trên Staging
- **Giải pháp**: Cần đồng bộ ETL-related data từ dev → Staging

**Maintenance Data Overwrite Risk**:
- ⚠️ Đã xảy ra lỗi ghi đè dữ liệu maintenance
- **Cần cẩn trọng** khi thực hiện migration cho production
- **Đề xuất**: Thay đổi thứ tự migration (Question/Web-catalog trước)?

##### 3. Load Testing Status 🧪

**Current Progress**: 50% hoàn thành

**APIs Tested**:
- announcements, Document Search, Document Filter, Google Analytics
- Screens: TOP, #3_Document-list, #16_Product-list, #18_#19_Product-document-list

**Test Scenarios Completed**:
- Keyword search trên các màn hình chính
- Pickup Mode / Limited Mode verification
- Category/keyword-based document search
- Repeat search verification
- Stress test: 924 concurrent users

**Performance Findings** ⚠️:
- **< 300 users**: OK
- **> 300 users**: Hệ thống bắt đầu chậm
- **Response time**: 5-6 giây (target: 3 giây)
- **Bottleneck**: Một số API (count, filter) có performance chưa tốt

**Remaining Test Scenarios**:
- Common Platform API: Document Count, Document Filter
- Future data volume test (5 năm, 10 năm): 3/9 - 3/12
- Test time: 18:00 JST (16:00 VNT) ~ (muốn điều chỉnh thành 15:00 JST / 13:00 VNT)

##### 4. Priority Tickets & Issues 🎯

**High Priority**:
- KINKEN-745: Product document list sort order incorrect
- KINKEN-707: Sort for Description, Zumen by Division
- Filter bugs (multiple)
- ✅ Technical HTML Doc Access Error (FIXED)

**Infrastructure Alerts**:
- alert-lixil-kinken-dev: Nhiều error notifications
- **Nghi ngờ**: Attack từ bên ngoài?
- **Đề xuất**: Thiết lập WAF?

---

#### Output Summary SPRINT 21 (Finished - 2026/03/13)

**Key Discussion Points (GW)**:

##### 1. Performance Tuning Priority 🚀

**Current Status**:
- Load test chưa OK ở thời điểm hiện tại
- Response time: 5-6 giây (target: 3 giây)
- **Cần**: Performance tuning trước khi release

**Bottleneck Analysis**:
- **Main issue**: Elasticsearch search performance
- **Hardware concern**: CPU usage 60%+ (hơi cao)
- **Hardware Profile**: General Purpose - cần xem xét?

**Performance Tuning Timeline**:
- **Deadline**: Chậm nhất tháng 3 phải hoàn thành
- **Dev environment**: Tự do thao tác (performance test đã xong)
- **Next test**: Sẽ trao đổi khung giờ phù hợp

**CloudRun Spec Adjustment**:
- Frontend / Backend / Search Platform: Giảm min instances từ 2 → 1

##### 2. Infrastructure Review 🔍

**Infra Environment Inspection**:
- Take-san sẽ thực hiện xử lý dựa trên tài liệu review
- Chien-san: Review trước (3/13-3/16) + Double check sau
- Thực hiện: 3/17 trở đi

##### 3. Weekly Meeting Reschedule 📅

- **3/20 (Fri)** → **3/23 (Mon) 15:00-16:30 JST** (13:00-14:30 VNT)
- **3/27 (Fri)** → **3/30 (Mon) 15:00-16:30 JST** (13:00-14:30 VNT)

**Completed Tasks**:
- Bug fixes & improvements
- Data migration planning
- Load test execution (50%)
- Infrastructure review preparation

**Key Achievements**:
- Clear Plan [A] vs Plan [B] for production data import
- Load test identified performance bottleneck (ES search)
- Infrastructure inspection scheduled

**Pending**:
- Performance tuning (Elasticsearch optimization)
- Remaining load test scenarios (50%)
- LIXIL connection setup (Product-update, Maintenance, Product-code)
- FAQ & Parts-search data preparation

**Lesson Learned**:
- Load testing must happen early to identify bottlenecks
- Performance tuning needs dedicated time before release
- Data migration order matters (Question/Web-catalog first to avoid ID conflicts)
- Infrastructure review should be done systematically with pre/post checks

---

### Giai đoạn SPRINT 22 (Kết thúc - 2026/03/30)

#### Output Summary SPRINT 22 (During - 2026/03/23)

**Key Discussion Points (GW)**:

##### 1. Performance Improvement Status 🚀

**Debug Logging Implementation**:
- FE: performance/v1 branch
- BE: feature/performance-log branch
- **Plan**: 3/23 run on Dev to identify bottlenecks and processing delays
- **Next**: Share results after confirmation

**Elasticsearch Shard Configuration**:
- **Current**: Primary = 4, Replica = 0
- **Reason**: Temporary setting for data update/reindex performance optimization
- **Plan**: Restore replica = 1 after completion (must be done before load test)
- **Status**: ✅ Confirmed OK

**Query Logging Issue**:
- Product document list search logs appearing twice
- **Action**: Team to investigate and report back

##### 2. Query Optimization Candidates 🔍

**Scope**: Remove document types that always return 0 results from queries

**Document Types to Exclude**:
- 部品 / Parts-search
- 商品コード / Product-code
- 電子商品連絡 / Product-update
- 点検修理手順書 / Maintenance
- CAD
- 動画 / Movie

**Implementation**:
- Remove unnecessary queries from product limited mode & product document list search
- **Owner**: Hoang-san, Kaz-san
- **Timeline**: 3/24

##### 3. Production Data Migration Status 📊

**Current Progress**:
- **Product-code**: Still waiting for SSH key info from Take-san
- **Data Verification**: Ongoing for:
  - product_description_divisions
  - product_zumen_divisions
  - document_products
  - webcatalog_products
  - product_code_documents
  - 7 product-search types

**Reference**: [Data Pipeline Tracking PROD](https://docs.google.com/spreadsheets/d/188NNf5ycoFuxNgrfFJW2joGsS-UKmP9ga-HUG_bskOo/edit?gid=450515503#gid=450515503)

##### 4. Diff Import Verification Status ✅

**Completed (30% progress)**:
- Product, Zumen, CAD, Parts-search, Movie, Product-code
- Data imported correctly, diffs reflected properly
- No issues found
- **Expected completion**: 3/27

**Automation Plan**:
- After verification complete: Set up cron for automatic execution
- **Frequency**: High frequency (e.g., 10-minute intervals)
- **Benefit**: No manual intervention needed from Hoai-san

**Import Constraints**:
- Currently: Import one file type at a time (sequential)
- **Production schedule**: Planned for weekdays 8:00, 12:00, 16:00
- **Target**: Complete all imports within 1 hour

##### 5. ETL Parallelization Issue - ID Change Solution 🔧

**Problem**: Multiple jobs cannot run in parallel due to IDENTITY column conflicts

**Root Cause**:
- id uses auto-increment (IDENTITY column)
- Delta Lake updates metadata on each insert
- Concurrent writes cause metadata conflicts (MetadataChangedException)

**Solution**: Change id from IDENTITY to UUID

**Benefits**:
- ✅ Parallel job execution possible
- ✅ Scheduled automation possible
- ✅ No metadata conflicts on data writes
- ✅ Low implementation complexity
- ✅ Faster deployment vs other solutions (partitioning, orchestration)

**Impact & Scope**:
- Database schema update: id BIGINT → id STRING (UUID)
- ETL pipeline update (Bronze → Silver → Gold)
- Elasticsearch mapping/index update
- Backend/Frontend id usage review
- Data re-import for 3 environments (Dev/Staging/Prod)

**Migration Process**:
1. Create new tables with "_new" prefix
2. Change type, set UUID values, map new IDs
3. Create backup tables (xxx_backup_YYYYMMDD) for rollback
4. Rename new tables to original names

**Execution Time**: ~55 minutes

**Timeline**:
- ETL code update: In Progress (50%), Plan 4/1
- ES index/RDB update: Not started, Plan 4/1
- Backend/Frontend check: Not started, Plan 4/1
- Function verification: Not started, Plan 4/2
- **Dev environment completion**: This week
- **Staging/Production data changes**: Next week
- **Staging/Production completion**: 4/9

---

#### Output Summary SPRINT 22 (Finished - 2026/03/30)

**Key Discussion Points (GW)**:

##### 1. Performance Improvement Strategy 📈

**Query Optimization Options**:
- **No.1**: Consolidate 12 full-text search retrievers into 1
  - GW concern: Consolidating semantic search retrievers might affect accuracy
  - **Recommendation**: Only consolidate full-text retrievers, keep semantic separate

- **No.2**: Add `is_searchable` flag for default conditions
  - GW concern: Filter conditions change dynamically from UI, hard to consolidate
  - **Status**: Feasible for default conditions only

**Timeline Decision**:
- **Deadline**: End of this week, latest early next week
- **Reason**: Must decide before release to stay on schedule
- **Priority**: Highest

**Spec Upgrade Option**:
- Current: 720 GB storage | 16 GB RAM | 4 vCPU ($1009.728)
- Upgrade: 1.41 TB storage | 32 GB RAM | 8 vCPU ($1979.712)
- **Potential**: Significant performance improvement possible

**Keyword-Based Search Control**:
- Propose automatic control: "Full-text only" OR "Full-text + Vector (RRF)"
- **Trigger logic**:
  - If all words ≤ 10 characters: Full-text search only
  - If any word ≥ 11 characters: Full-text + Vector (RRF)
- **Pre-validation**: Evaluate with 2 patterns before consulting LIXIL

##### 2. ETL ID Change - UUID Migration 🔄

**Status**: Data migration script created on Databricks Dev

**Tables Affected** (Silver & Gold):
- products, documents, description_documents, zumen_documents, technical_documents
- webcatalog_documents, cad_documents, faq_documents, question_documents
- maintenance_documents, product_update_documents, product_code_documents, movie_documents
- document_brands, product_labels, webcatalog_products, document_products
- product_description_divisions, product_zumen_divisions
- Gold extra: chunks, embeddings, product_index, document_index_fulltext
- Mapping tables: documents_id_mapping, products_id_mapping, chunks_id_mapping

**Migration Logic**:
- Create new tables with "_new" prefix
- Change type, set UUID, map new IDs
- Create backup tables (xxx_backup_YYYYMMDD)
- Rename new tables to original

**Execution Time**: ~55 minutes

**Progress**:
- ETL code update: In Progress (50%), Plan 4/1
- ES index/RDB update: Not started, Plan 4/1
- Backend/Frontend check: Not started, Plan 4/1
- Function verification: Not started, Plan 4/2
- **Dev completion**: This week
- **Staging/Production**: Next week
- **Final deadline**: 4/9 (Thu)

##### 3. Morphological Dictionary Refresh 📚

**Status**: Discussed with select members at end of meeting
- Reference: [KINKEN-775 Monday ticket](https://guildworks-company.monday.com/item/KINKEN-775)

##### 4. Synonym Dictionary on Staging 🔤

**Status**: ✅ Applied to Staging v2 index

**Latest Indexes**:
- documents_v2_20260310_1252
- products_v2_20260310_1316

**Current Activity**: Team evaluating search results

**Next**: Alias swap planned

##### 5. LIXIL Diff Verification Testing 🧪

**Status**: Started today (3/30)

**Approach**: Manual execution by GW

**Sequence**:
1. PIM-related data first
2. Start with Product data

##### 6. Product-Code (MDM) Production Diff Sync Schedule 📅

**Full Import**: 4/13 (Mon) - Latest data (Product_all.csv)

**Daily Diff Import**: From 4/14 onwards - Every night (Product.csv)

**Sub-ticket**: Created, will announce when date approaches
- Reference: [Monday sub-ticket](https://guildworks-company.monday.com/boards/8984663977/pulses/11622497240/posts/5053633738)

##### 7. April Team Structure 👥

**Proposed Structure**:
- MOR/PM: 0.5 (Kaz)
- MOR/SubM (BrSE): 0.5 (Hang)
- Leader: 0.5 (Chien)
- AI Senior: 0.5 (An)
- FE Leader: 1.0 (Tuan)
- BE Leader: 2.0 (Hoai, Hoang)
  - Khoa-san: 1.0 (maintain, consider departure mid-April)
- QC/QA: 1.0 (0.5 TuNa, 0.5 Tai)

**QC Resource Recommendation** ⚠️:
- **Proposal**: Maintain 2-person QC team (TuNa, Tai)
- **Rationale**:
  - High verification workload (Regression, Performance, Failure scenarios, Data migration)
  - Multiple tasks require 3-environment validation
  - QC must participate early (post-Dev) to meet release schedule
  - Reduces end-of-sprint bottleneck risk
- **Conclusion**: 2-person QC team is safer and more appropriate

**Completed Tasks**:
- Performance improvement strategy defined
- ETL UUID migration script ready
- Synonym dictionary applied to Staging
- LIXIL diff verification started
- April team structure confirmed

**Key Achievements**:
- Clear performance tuning approach (No.1 & No.2 options)
- UUID migration plan finalized (4/9 deadline)
- Keyword-based search control proposed
- Staging v2 index with latest dictionaries ready

**Pending**:
- Performance tuning implementation (No.1 & No.2)
- UUID migration execution (Dev → Staging → Prod)
- Morphological dictionary refresh details
- Alias swap for Staging v2 index

**Lesson Learned**:
- Query consolidation must balance performance with accuracy
- UUID migration is better than orchestration changes for parallelization
- Keyword-based search control can optimize performance without sacrificing accuracy
- QC resource planning must account for multi-environment validation overhead
- Early decision-making on performance strategies is critical for release timeline

---

### Giai đoạn SPRINT 23 (Kết thúc - 2026/04/10)

#### Output Summary SPRINT 23 (During - 2026/04/03)

**Key Discussion Points (GW)**:

##### 1. Release Timeline - 1 Month to Go! 🚀

**1st Release**: 5/13 (Wed) - LIXIL Internal Users Only

**2nd Release**: 6/10 (Wed) - Partner, Business, LTS ME, Internet

**Migration Schedule**:
- **3/30 - 4/8**: Diff verification testing
- **4/9**: Latest full data from PIM + Web Catalog diff data sync
  - Request diff data from last production import for other document types
- **4/10 (~ 4/12)**: Import above data
  - If Technical & Web Catalog diff ~500 records → complete by 4/10
  - Confirm completion timeline with MOR after receiving LIXIL data
- **4/13**: Start automatic PIM production data sync
- **4/14**: Start automatic non-PIM production data sync
  - Product-update, Maintenance, FAQ, Question (excluding Parts-search)
  - Product-code (MDM): 4/13 full import (Product_all.csv), 4/14 start diff (Product.csv)
  - Reference: [KSRP-112](https://lixilg.atlassian.net/browse/KSRP-112)

##### 2. Critical Work Completion Timeline ⏰

**Performance Improvement**: ~ 4/7
- Yesterday tested with upgraded spec: **1.5 seconds (baseline)**
- Question: Is this result from spec upgrade only, or includes No.1 & No.2 optimizations?
- Status of No.1 & No.2 speed improvement measures?
- Reference: [速度改善](https://docs.google.com/spreadsheets/d/1H1RruHXOL7Yw47XFwPw1rU_Vmn6_HOc7oXwiJffa59g/edit?gid=957086664#gid=957086664)

**Diff Verification**: ~ 4/7

**UUID Migration for Job Parallelization**:
- **Staging completion**: 4/8 (Plan confirmed by Chien-san)
- **Production completion**: 4/9 (Plan confirmed by Chien-san)

**Job Parallelization Setup**: ~ 4/9

**OpenAI Degraded Mode Handling**:
- **Status**: Not started yet (prioritizing other tasks)
- **Plan**: Start 4/8 or 4/9, complete by 4/15

**Other Large Remaining Tasks**: MOR to confirm

##### 3. Databricks Job Execution User 👤

**Request**: Set all Databricks job execution users to "kyogoku" for future operations/maintenance

**Status**: Ticket created

##### 4. Keyword-Based Vector Search Control 🔍

**Ticket**: [KINKEN-841 - Relax vector search (+ RRF) trigger condition based on keyword character count](https://guildworks-company.monday.com/item/KINKEN-841)

**Request**: Pre-verification results needed

---

#### Output Summary SPRINT 23 (Finished - 2026/04/10)

**Key Discussion Points (GW)**:

##### 1. Load Test Results & Infrastructure Spec Finalized 📊

**Status**: ✅ Load test results reported, infrastructure spec confirmed

**Reference**: [Infrastructure Spec](https://docs.google.com/spreadsheets/d/1Jd0r8DF0SwD-wWcVc23bURqqXRu5MbIZ4PNJhxbLaoI/edit?gid=2145732957#gid=2145732957)

**CloudRun Configuration**:
- **May (Internal release)**: min 1 instance is sufficient
- **June (External release)**: Decide whether to increase to min 2 based on May usage

**Databricks Cost Estimation**:
- **Method**: Pick 1 document from 4/13 diff data as 1-month sample
- **Calculation**:
  - PROD monthly cost (A) = sample cost × 0.7
  - DEV monthly cost (B) = sample cost × 0.1
  - STG monthly cost (C) = sample cost × 0.2
- **Action**: Request LIXIL to grant access to Databricks cost dashboard

##### 2. Diff Data Verification Schedule Revised 📅

**Schedule**: [Diff Verification Schedule](https://docs.google.com/spreadsheets/d/1VNYh3xFuQ2KKM_4W8V4qYD9eoVaDNrSDvfawbR8mth8/edit?gid=0#gid=0)

**Vietnamese version**: [VN Schedule](https://docs.google.com/spreadsheets/d/1OqbaBifo9uThfVmzCXlS_Fjy3wGFOpEaXJgpnL6eEHg/edit?gid=1790191717#gid=1790191717)

**Status**: Chien-san confirmed, team to follow

##### 3. Staging/Production Spec Upgrade Request 🔧

**Request**: Upgrade Staging/Production infrastructure spec to production-equivalent today

**Reason**: LIXIL internal presentation on 4/15, need smooth performance

**Timeline**:
- **4/10 17:00 VNT (19:00 JST)**: Start Staging spec upgrade
- **4/16**: Downgrade Staging back to documented spec

**Status**: ✅ Chien-san confirmed, will execute today

##### 4. Filter Condition Display Issue 🐞

**Problem**: Occasionally filter conditions don't display on dev environment

**Root Cause**: Suspected Backend or ES timeout (~10 seconds)

**Current Behavior**: No error message, just missing list or filter conditions

**Proposed Solutions**:
1. **Merge APIs**: Combine list search and filter retrieval APIs (proposed by Kaz-san, An-san)
2. **Increase timeout**: Extend timeout duration
3. **Error messaging**: Display error message (Toast?) if either API fails
4. **Other**: Open to MOR suggestions

##### 5. Team Availability Notice 📢

**4/13 (Mon)**: Take-san on personal leave, may respond only in Japanese on Slack

---

### SPRINT 23 Summary

**Completed Tasks**:
- UUID migration (Staging: 4/8, Production: 4/9)
- Performance improvement baseline achieved (1.5 seconds)
- Load test results finalized
- Infrastructure spec confirmed
- Diff verification schedule revised

**Key Achievements**:
- **Performance**: Response time improved to 1.5s (from 5-6s)
- **Infrastructure**: Spec finalized for May/June releases
- **Migration**: UUID migration completed on schedule
- **Release Readiness**: 1 month to 1st release (5/13)

**Pending**:
- OpenAI degraded mode handling (4/8-4/9 start, 4/15 complete)
- Diff data import (4/10-4/12)
- Automatic data sync setup (4/13-4/14)
- Filter condition display issue resolution
- Databricks cost estimation

**Lesson Learned**:
- Performance baseline (1.5s) achieved through spec upgrade + query optimization
- Staging spec must match production for client presentations
- Filter API reliability needs improvement (timeout handling, error messaging)
- Cost estimation requires real diff data sampling
- Release timeline drives all remaining work prioritization

---

### Giai đoạn SPRINT 24 (Kết thúc - 2026/04/24)

#### Output Summary SPRINT 24 (During - 2026/04/17)

**Key Discussion Points (GW)**:

##### 1. Data Collection Platform Enhancement 📊

**Ticket**: [KINKEN-868 - Support add/update/delete related data in data collection platform](https://guildworks-company.monday.com/item/KINKEN-868)

**Scope**: Enable system to handle related data addition, modification, deletion

**Timeline**:
- **Start**: Now (4/17)
- **Release**: After 5/13 (target June external release)
- **Reason**: Too tight for 5/13 release, but can start development now

##### 2. Production Release Preparation ✅

**Ticket**: [KINKEN-777 - Tasks for production release preparation](https://guildworks-company.monday.com/item/KINKEN-777)

**Status**: Content alignment in progress

##### 3. Load Countermeasures & Performance Improvements 🚀

**MUST - AzureOpenAI Embedding Refactoring**:
- Move AzureOpenAI Embedding model calls to Backend side
- **Benefit**: Better control, error handling, performance optimization

**WANT - Embedding Data Caching**:
- Introduce caching mechanism for embedding data
- **Related ticket**: [KINKEN-733](https://guildworks-company.monday.com/item/KINKEN-733)
- **Requirement**: Review control content from above ticket during implementation

**Elasticsearch Timeout Handling**:
- **Current**: ES timeout (10s) returns 0 results
- **Problem**: Frontend shows 0 results, no error indication
- **Solution**: Return error instead of 0 results, enable Frontend handling
- **Status**: Backend already returns 500 errors, Frontend needs control addition
- **Action**: Create ticket and proceed

##### 4. Beta Preview Release (4/27) 🎯

**Plan**: Release beta version to internal users on 4/27

**Limitations**:
- Data and functionality gaps exist
- Basic auth remains until 5/12 (unchanged schedule)
- Formal support starts from 5/13 onwards

**Question**: Will Basic auth info be shared with ALL internal users? (GW to confirm)

---

#### Output Summary SPRINT 24 (Finished - 2026/04/24)

**Key Discussion Points (GW)**:

##### 1. LIXIL Internal Webinar Success ❤️

**First Webinar (Week of 4/17)**: Very positive feedback

**User Feedback Highlights**:
- "Much faster than previous search system"
- "Search time can be significantly reduced"
- High expectations for business speed improvement
- "10-year improvement request finally addressed" - grateful voices
- "Fuzzy search" and "natural language search" now possible

##### 2. Beta Preview Release Confirmed ✅

**Date**: 4/27 (Monday) - As discussed in previous meeting

**Scope**: Early access for LIXIL employees involved in renewal project

**Team Impact**: No changes or additional work required

##### 3. Preview Performance Improvement 🔧

**Ticket**: [KINKEN-883 - Some documents have slow preview on PROD](https://guildworks-company.monday.com/item/KINKEN-883)

**Proposed Solution**: Add index to CloudSQL (RDB)

**Test**: Added `type x url_lixil` index to dev and PROD (temporary)

**Next Steps**:
1. MOR to investigate where slowdown occurs
2. Remove temporary index before investigation
3. Identify root cause, then discuss solution approach

##### 4. Unstructured Data Change Handling Strategy 📄

**Target**: Description, Technical, Web-catalog from PIM

**Proposal 1 - Change Date Approach**:
- PIM provides "Unstructured change date" field
- KINKEN stores this value
- Compare stored date with new structured data date
- If date changed: Import unstructured data
- If date unchanged: Import only structured data

**Proposal 2 - Flag Approach (MOR Preferred)**:
- PIM provides "Unstructured data changed flag"
- KINKEN processes based on flag (simpler)
- **MOR opinion**: Flag approach is simpler for KINKEN processing
- **Trade-off**: Date approach possible but increases effort

**Action**: GW to consult LIXIL about flag approach feasibility

##### 5. Next Meeting Schedule 📅

**Next Regular Meeting**: 5/8 (Friday)

**Reason**: Skip 1 week due to holidays in both Vietnam and Japan

**Holiday Notes**:
- 5/4, 5, 6: Vietnam normal workdays (Japan holidays)

##### 6. Emergency Contact Protocol for Release 🚨

**Release Date**: 5/13 (Wednesday) - Internal release

**Emergency Contact Period**: 5/13, 14, 15

**Requested Availability**: 10:00-19:00 JST (8:00-17:00 VNT)

**Status**: ✅ Chien-san confirmed, team will prepare and be ready

---

### SPRINT 24 Summary

**Completed Tasks**:
- Beta preview release confirmed (4/27)
- LIXIL webinar successfully conducted
- Preview performance investigation started
- Unstructured data handling strategy defined
- Emergency contact protocol established

**Key Achievements**:
- **User Validation**: Positive feedback from LIXIL internal webinar
- **Release Readiness**: Beta preview scheduled, emergency protocol ready
- **Performance**: Preview optimization investigation underway
- **Data Strategy**: Clear approach for unstructured data changes

**Pending**:
- Data collection platform enhancement (post-5/13)
- AzureOpenAI embedding refactoring (MUST)
- Embedding caching implementation (WANT)
- ES timeout error handling
- Preview performance root cause analysis

**Timeline Status**:
- **Today**: 2026-05-05
- **Beta Preview**: 4/27 ✅ (already happened)
- **1st Release**: 5/13 (8 days from today)
- **Emergency Support**: 5/13-5/15 (team ready)
- **2nd Release**: 6/10

**Lesson Learned**:
- User feedback is critical validation for search system improvements
- Beta releases help gather real-world usage before full release
- Flag-based approaches are simpler than date comparisons for data change detection
- Emergency protocols must be established before major releases
- Preview performance needs dedicated investigation separate from search performance
