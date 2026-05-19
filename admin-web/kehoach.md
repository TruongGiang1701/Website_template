# Kế hoạch Thiết Kế & Triển Khai UI Admin

Sau khi kiểm tra dự án `admin-web`, nhận xét chung về tình trạng hiện tại: **Dự án Frontend hiện tại hầu như chưa có gì, chỉ mới dựng khung routing cơ bản (các thư mục placeholders rỗng bên trong `src/app/(admin)`)**. Để đáp ứng 100% các API mà bạn vừa thiết kế thì Frontend sẽ cần bổ sung rất nhiều.

Dưới đây là Kế hoạch triển khai thiết kế UI hoàn chỉnh theo định hướng thiết kế **cao cấp (premium), mượt mà, và đáp ứng mọi yêu cầu từ API**.

## Các Giai Đoạn Triển Khai

### Giai đoạn 1: Xây dựng Layout & Core Components

Tạo một nền tảng vững chắc và giao diện chuyên nghiệp, sử dụng tông màu hiện đại, Dark Mode tối giản (hoặc sáng sủa nhưng thanh lịch) với các hiệu ứng hover, skeleton loading đẹp mắt.

- **Sidebar Menu & Topbar**: Xây dựng thanh điều hướng động.
- **Bảng Dữ Liệu (Data Table)**: Component dùng chung cực kỳ quan trọng. Yêu cầu: Phân trang (Pagination), Tìm kiếm (Search Bar), Lọc (Filters) cho các cột, và State hiển thị (Loading/Empty/Error).
- **Form Components & Modals**: Xây dựng các Input chuẩn có validation (Text, SelectDropdown, Switch Toggle, File Upload, Textarea) và các Popup Modal tĩnh để xác nhận (VD: Bạn có chắc muốn xoá?).
- **Toast Notifications**: Thông báo thành công / thất bại sau mỗi lần gọi API.

### Giai đoạn 2: Phát triển Dashboard (Thống kê)

- **Tương ứng API**: `GET /api/admin/dashboard/metrics`
- **Giao diện**:
  - Gồm 3-4 Thẻ thống kê (Metric Cards) hiển thị nổi bật: Tổng doanh thu, Số đơn mới, Người dùng mới... có sử dụng hiệu ứng skeleton lúc chờ gọi API.
  - Một biểu đồ đơn giản (Line chart hoặc Bar chart) cho doanh thu 7 ngày qua (nếu có thể lấy dữ liệu).
  - Bảng "Top 5 Sản phẩm bán chạy".

### Giai đoạn 3: Quản lý Đơn hàng (Orders)

- **Danh sách Đơn hàng (`/orders`)**:
  - Bảng dữ liệu lấy từ `GET /api/admin/orders`.
  - Có Dropdown Filter lọc theo `Status` và `Payment Status`.
  - Ô tìm kiếm linh hoạt theo Tên khách, Email, hoặc Mã Code.
- **Chi tiết Đơn hàng (`/orders/[id]`)**:
  - Trang hiển thị 2 cột:
    - Cột 1: Thông tin khách hàng, chi tiết các mặt hàng mua (Order Items).
    - Cột 2: Lịch sử và Trạng thái đơn hàng (Timeline Events).
  - Khối **Cập nhật trạng thái (`PATCH status`)**: Hiển thị là một bộ nút nhấn nổi bật để đổi trạng thái.
  - Khối **Ghi chú nội bộ (`PATCH admin-notes`)**: Khu vực Textarea để Admin notes lại thông tin nhạy cảm.

### Giai đoạn 4: Quản lý Khách hàng / Nhân viên (Users)

- **Danh sách User (`/users`)**: Bảng dữ liệu tìm kiếm người dùng.
- **Chi tiết & Thao tác**:
  - Click vào 1 user sẽ ra trang chi tiết bao gồm chỉ số: Tổng tiền đã mua, tổng số đơn.
  - Nút **Toogle Khóa tài khoản (Disable)** (Gọi API `PATCH disable`).
  - Nút **Đổi Role (Cấp quyền Staff/Admin)**, đi kèm một Modal cảnh báo đỏ cực ngầu do tác động tới phân quyền hệ thống.

### Giai đoạn 5: Quản lý Sản phẩm & Thể loại (Products & Categories)

- **Quản lý Danh mục (`/categories`)**:
  - Bảng danh mục. Form tạo/sửa trên Modal.
- **Danh sách Sản phẩm (`/products`)**:
  - Lấy tất cả (`GET /api/admin/products`). Sẽ hiển thị nhãn (Badge) màu sắc rõ ràng phân biệt: Active, Draft, Archived, Soft Deleted.
- **Tạo / Chỉnh sửa Sản phẩm**:
  - Trang Form lớn. Cần dropdown lấy từ API Danh mục chứ không phải text tay như cũ.
  - Tích hợp khu vực **Kéo thả để tải ảnh lên (Drag & drop File Upload)** (Gọi `POST /api/admin/upload`).

### Giai đoạn 6: Hệ thống Theo dõi (Audit Logs)

- **Danh sách Nhật ký (`/system-logs`)**:
  - Giao diện Table tối giản nhất để dễ đọc vì đây chỉ là màn hình đọc dấu vết (chỉ gọi `GET audit-logs`).

## User Review Required

> [!IMPORTANT]
> **Quyết định về Stack Thiết kế UI Component:**
>
> - Dự án `admin-web` của bạn đang dùng `Next.js 16` và có chứa `tailwindcss^4` trong `package.json`.
> - Để dự án **WOW/Premium** và dễ bảo trì, chúng ta cần chọn phương án Code UI:
>   - _Tùy chọn 1_: Tự viết CSS thuần (Vanilla CSS / Modules) chuẩn chỉnh cho mọi chi tiết (mất công hơn nhưng nhẹ, tùy biến 100%).
>   - _Tùy chọn 2_: Tận dụng Tailwind v4 hiện tại kết hợp tự tuỳ chỉnh màu sắc bảng màu Gradient/Glassmorphism chuyên sâu sao cho độc đáo và cao cấp.
>
> Bạn muốn sử dụng Tùy chọn nào? (Tôi khuyên dùng Tùy chọn 2 với thiết kế riêng biệt để giữ đà phát triển mà vẫn đẹp).
>
> Ngoài ra, đối với Modal tải ảnh (`Media Management`), bạn muốn chúng ta mô phỏng UI cho nó hay chưa cần đi sâu vội?

## Open Questions

Xin hãy confirm để tôi có thể tiến hành bước tiếp theo là xây dựng ngay các base component thực tế.
