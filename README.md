# naitei14_fe_nhom1

## Cấu trúc thư mục
- `public/`: Chứa các tài nguyên tĩnh như hình ảnh, biểu tượng, v.v. (tải từ drive)
- `src`: Chứa mã nguồn chính của ứng dụng
  - `app/`: Chứa các thành phần giao diện người dùng và cấu hình ứng dụng
  - `components/`: Chứa các thành phần giao diện người dùng tái sử dụng
  - `constants/`: Chứa các hằng số và cấu hình chung
  - `hooks/`: Chứa các hook tùy chỉnh
  - `database/`: Chứa file giả lập cơ sở dữ liệu
  - `lib/`: Chứa các thư viện và tiện ích hỗ trợ
  - `services/`: Chứa các dịch vụ API và logic nghiệp vụ
  - `stores/`: Chứa các store quản lý trạng thái ứng dụng
  - `types/`: Chứa các định nghĩa kiểu TypeScript
  - `utils/`: Chứa các hàm tiện ích chung

## Cách chạy ứng dụng
1. Cài đặt các phụ thuộc:
   ```bash
   pnpm install
   ```
2. Chạy lệnh khởi động giả lập cơ sở dữ liệu (port: 3001):
   ```bash
   pnpm run json-server
   ``` 
3. Chạy ứng dụng ở chế độ phát triển:
   ```bash
   pnpm run dev
   ```
4. Mở trình duyệt và truy cập vào địa chỉ: `http://localhost:3000`

## Cách chạy kiểm tra Lint Sun*:
1. Chạy lệnh kiểm tra toàn bộ rules của Lint Sun*:
    ```bash
    pnpm run lint
    ```
2. Chạy lệnh kiểm tra các file thay đổi:
    ```bash
    pnpm run lint:changed
3. Chạy lệnh kiểm tra các lỗi liên quan tới bảo mật:
    ```bash
    pnpm run lint:security
    ```