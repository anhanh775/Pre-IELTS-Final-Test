# Pre-IELTS Final Test (Listening + Reading + Writing)

Cấu trúc: `index.html` · `css/` · `js/` · `data/` (đề + đáp án) · `img/` · `audio/`

**Audio:** `audio/part1.mp3` … `part4.mp3` (tách từ file gốc, tổng ~25MB). Reading 60 phút, Writing 60 phút.

**Chạy:** GitHub Pages (Settings → Pages → Deploy from branch → `main` / root) hoặc `python3 -m http.server`.
Không double-click mở `index.html` (trình duyệt chặn tải audio qua `file://`).

**Đổi đề:** sửa `data/test.js` (câu hỏi, đáp án), `data/passages.js` (bài đọc), thay audio và ảnh.
**Cấu hình** (mật khẩu giáo viên, webhook Google Sheet, thời gian): `js/config.js`.

## Lưu bài làm & chấm điểm (Google Sheet)
1. Tạo Google Sheet mới → **Tiện ích mở rộng → Apps Script**.
2. Xoá code mẫu, dán toàn bộ `apps-script/Code.gs` → Lưu.
3. **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**: *Thực thi bằng* = Tôi; *Người có quyền truy cập* = **Bất kỳ ai** → Triển khai → cấp quyền → copy **URL Web App**.
4. Dán URL vào `js/config.js` (`webhook`) → commit lên GitHub.
5. (Tuỳ chọn) Chạy hàm `testWrite` trong Apps Script để kiểm tra Sheet.
Sửa Code.gs về sau: Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai (URL giữ nguyên).
