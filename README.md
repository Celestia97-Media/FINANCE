# 🎬 FINANCE MEDIA — Hệ Thống Quản Lý Chi Phí & Ngân Sách Sản Xuất Media

Ứng dụng quản lý ngân sách, kiểm soát chi phí thực tế on-set, hoàn ứng và duyệt chi chuyên nghiệp dành cho Media Team, Agency, Brand và Production House.

---

## ✨ Tính Năng Nổi Bật

- **01 — Dashboard (Tổng quan tài chính)**: Thống kê 7 chỉ số KPI thời gian thực, cảnh báo rủi ro bội chi, biểu đồ so sánh Budget vs Actual và tỉ trọng chi phí theo Category.
- **02 — Media Jobs (Quản lý dự án)**: Danh sách toàn bộ buổi shooting với chế độ xem thẻ (Grid) và bảng (Table), lọc theo loại hình sản xuất và trạng thái.
- **03 — Create Media Job (Khởi tạo dự án)**: Tự động nạp cấu trúc hạng mục và đề xuất tỉ trọng phân bổ ngân sách theo loại hình sản xuất (**Smart Category Auto-loader**).
- **04 — Expense Screen (Chi tiết & Chi phí)**: Tổng kết ngân sách *Budget - Actual - Remaining*, bảng phân bổ 8 nhóm chi phí và danh sách chi phí chi tiết kèm hóa đơn đính kèm.
- **⚡ QUICK ADD EXPENSE (On-set Fast Entry)**: Nhập nhanh chi phí phát sinh khi đi shooting (*Grab, Parking, Coffee, Food, Props, Equipment, Overtime, Other*) kèm chụp/tải hóa đơn chỉ trong 3–5 giây.
- **05 — Approval (Phê duyệt chi phí)**: Hàng đợi duyệt chi dành cho Manager & Finance, xem ảnh chứng từ to rõ, duyệt hoàn ứng nhân viên (Reimbursement) và thanh toán nhà cung cấp.
- **06 — Report & Quyết Toán**: Phân tích chi tiết, **xuất file Excel (.xlsx) 3 Sheet** chuẩn kế toán và **in phiếu thanh quyết toán / nghiệm thu (Print / PDF)** có đủ chữ ký 3 bên.
- **8 Nhóm Danh Mục Chuẩn Ngành**: Hơn 50 sub-categories cố định (*Location, Equipment, Crew, Talent, Styling, Set/Art, Transport, F&B*).

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 18, TypeScript, Vite
- **Styling & UI**: Tailwind CSS v4, Lucide Icons
- **Biểu Đồ**: Recharts
- **Xuất Dữ Liệu**: SheetJS (XLSX)
- **Hiệu Ứng**: Canvas Confetti
- **Lưu Trữ**: LocalStorage / IndexedDB

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Trên Máy Cục Bộ

### 1. Yêu cầu
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18+ trở lên).

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Khởi chạy ứng dụng (Development mode)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173/`

### 4. Build sản phẩm (Production build)
```bash
npm run build
```
Thư mục sản phẩm sau khi build sẽ nằm ở thư mục `dist/`.

---

## 📄 License
Được phát triển dành cho Media Production & Finance Management.
