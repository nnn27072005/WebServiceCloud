# 🚀 Hướng dẫn triển khai (Deployment Guide) - Neon & Render

Tài liệu này hướng dẫn bạn thiết lập từ đầu đến cuối hệ thống Database (**Neon**) và triển khai ứng dụng (**Render**) cho dự án GameTwoShape.

---

## 🐘 Phần 1: Thiết lập Database trên Neon.tech

[Neon](https://neon.tech/) cung cấp PostgreSQL Serverless cực kỳ mạnh mẽ và dễ dùng.

### 1. Tạo tài khoản và Project
1. Truy cập [Neon.tech](https://neon.tech/) và đăng ký tài khoản (nên dùng GitHub cho nhanh).
2. Nhấn **Create Project**.
3. Đặt tên project (ví dụ: `gametwoshape-db`) và chọn Region gần nhất (thường là **Singapore / ap-southeast-1**).
4. Nhấn **Create Project**.

### 2. Lấy thông tin kết nối
1. Sau khi tạo xong, bạn sẽ thấy mục **Connection Details** ở Dashboard.
2. Chọn cấu hình là **Prisma**.
3. Bạn sẽ nhận được 2 biến quan trọng:
   - `DATABASE_URL`: Dùng cho các truy vấn thông thường (thường có dạng `postgres://...`).
   - `DIRECT_URL`: Dùng cho việc migrate (thường giống DATABASE_URL nhưng không qua pooler).

---

## ⚙️ Phần 2: Cấu hình Backend (Local)

Trước khi đẩy lên cloud, hãy đảm bảo máy local đã kết nối được.

1. Mở file `backend/.env`.
2. Dán các giá trị bạn vừa lấy từ Neon vào:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   DIRECT_URL="postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   ```
3. Chạy lệnh sau để đồng bộ cấu trúc database:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

---

## ☁️ Phần 3: Triển khai lên Render.com

[Render](https://render.com/) sẽ tự động kéo code từ GitHub về và chạy Docker image của bạn.

### Cách 1: Sử dụng Blueprint (Khuyên dùng)
Dự án đã có file `render.yaml`. Đây là cách nhanh nhất.

1. Truy cập [Render Dashboard](https://dashboard.render.com/).
2. Nhấn **New +** > **Blueprint**.
3. Kết nối với Repository GitHub của bạn.
4. Render sẽ tự nhận diện file `render.yaml`. Nhấn **Apply**.
5. Đợi Render tạo service. Sau đó vào mục **Environment** của service đó để điền các biến còn thiếu (`DATABASE_URL`, `JWT_SECRET`, v.v.).

### Cách 2: Tạo thủ công (Manual Setup)
Nếu bạn muốn tự tay thiết lập:

1. Nhấn **New +** > **Web Service**.
2. Kết nối GitHub.
3. Cấu hình các thông số:
   - **Name**: `game2shape-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render sẽ tự đọc `backend/Dockerfile`)
4. Nhấn **Advanced** > **Add Environment Variable**:
   - `DATABASE_URL`: (Lấy từ Neon)
   - `DIRECT_URL`: (Lấy từ Neon)
   - `PORT`: `3000`
   - `JWT_SECRET`: (Một chuỗi ký tự bất kỳ để bảo mật)
5. Nhấn **Create Web Service**.

---

## 🔄 Phần 4: Tự động hóa CI/CD với GitHub Actions

Mỗi khi bạn `git push` lên nhánh `main`, hệ thống sẽ tự động cập nhật bản mới nhất lên Render.

1. **Lấy Deploy Hook**: Trên Render Dashboard, vào service của bạn > **Settings** > Tìm mục **Deploy Hook**. Coppy URL đó.
2. **Cấu hình GitHub Secrets**:
   - Vào Repo GitHub của bạn > **Settings** > **Secrets and variables** > **Actions**.
   - Thêm `RENDER_DEPLOY_HOOK_URL`: (Dán URL vừa copy).
3. Bây giờ, mỗi khi bạn push code, pipeline trong `.github/workflows/deploy.yml` sẽ kích hoạt Render.

---

## 🛠 Phần 5: Kiểm tra kết quả

Sau khi Render báo **Live**, bạn có thể kiểm tra:

1. **Swagger UI**: Truy cập [Live Backend API](https://game2shape-backend-y0nk.onrender.com/api)
2. **Neon Database**: Quản lý database tại [Neon Console](https://console.neon.tech/)
3. **Sentry**: Theo dõi lỗi tại [Sentry Dashboard](https://sentry.io/organizations/nguyen-ngoc-ngu-dt/projects/javascript-nextjs/)
