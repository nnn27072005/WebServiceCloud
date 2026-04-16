# 🪳 GameTwoShape (L02-CockRoaches)

[![CI/CD Pipeline](https://github.com/nnn27072005/WebServiceCloud/actions/workflows/deploy.yml/badge.svg)](https://github.com/nnn27072005/WebServiceCloud/actions/workflows/deploy.yml)
[![Sentry](https://img.shields.io/badge/Sentry-Monitoring-6C5B7B?logo=sentry)](https://sentry.io/)
[![Deployment](https://img.shields.io/badge/Render-Deployment-465452?logo=render)](https://game2shape-backend-y0nk.onrender.com/api)

Chào mừng bạn đến với dự án **GameTwoShape** - sản phẩm thuộc lớp **Mobile Development (L02) - Team CockRoaches**. Ứng dụng tập trung vào việc rèn luyện sự phối hợp song phương (Bimanual Coordination) thông qua các trò chơi vẽ tay tương tác.

---

## 🎮 1. Tổng quan dự án

**Tên dự án:** GameTwoShape  
**Slogan:** *"Kích thích hai bán cầu, hoàn hảo đôi tay"*

Dự án cung cấp hệ thống bài tập luyện não (Memory Match, Speed Calc, GameTwoShape) nhằm cải thiện sự tập trung và khéo léo, đồng thời được quản lý bằng quy trình phát triển phần mềm hiện đại.

---

## 🛠 2. Tech Stack (Công cụ sử dụng)

Hệ thống được thiết kế theo kiến trúc **Decoupled** (Tách biệt hoàn toàn Frontend & Backend):

- **Mobile (Frontend):** Expo (SDK 54), React Native, NativeWind (Tailwind).
- **Web Service (Backend):** NestJS v11, PostgreSQL (Neon.tech), Prisma ORM.
- **Infrastructure:** Render, GitHub Actions, Docker Hub, Sentry.

---

## 🚀 3. CI/CD với GitHub + Cloud

### Khái niệm CI/CD áp dụng trong dự án
- **Continuous Integration (CI):** Tự động kiểm tra mã nguồn mỗi khi thành viên trong nhóm `push` code hoặc gửi Pull Request (PR). Đảm bảo mã nguồn mới không làm hỏng các tính năng cũ.
- **Continuous Deployment (CD):** Tự động đóng gói và triển khai mã nguồn lên môi trường Cloud (Render) ngay sau khi vượt qua các bài kiểm tra.

### Lợi ích trong quản lý nhóm (Lớp L02)
1. **Phát hiện lỗi sớm:** Pipeline tự động chạy Unit Test giúp nhóm tìm ra lỗi ngay sau khi merge code.
2. **Đồng bộ môi trường:** Loại bỏ tình trạng "chạy được trên máy mình nhưng không chạy được trên máy bạn" nhờ Docker.
3. **Tiết kiệm thời gian:** Nhóm không cần deploy thủ công, giảm thiểu sai sót do con người.

### Cấu trúc Pipeline của dự án
Pipeline được thiết kế gồm 4 giai đoạn logic trong [.github/workflows/deploy.yml](.github/workflows/deploy.yml):
1. **Build & Test**: Cài đặt dependency, biên dịch TypeScript và chạy Unit Tests.
2. **Dockerize**: Đóng gói ứng dụng thành Docker Image và đẩy lên Docker Hub.
3. **Deploy**: Gửi tín hiệu (Webhook) để Render kéo Image mới nhất về và khởi chạy.
4. **Sentry Release**: Thông báo và liên kết các commit mới với hệ thống giám sát lỗi Sentry.

### Demo tích hợp & Bảo mật
- **Secrets Management**: Toàn bộ Token của Sentry, Docker Hub, Render Deploy Hook được lưu trữ an toàn trong **GitHub Repository Secrets**. Không lưu thông tin nhạy cảm trong code.
- **Auto-deploy**: Hệ thống tự động triển khai Backend service từ GitHub Organization của nhóm lên Live URL mỗi khi nhánh `main` được cập nhật.

---

## 🌟 4. Gợi ý mở rộng

Để đạt chuẩn ứng dụng "Production-ready", nhóm đã tích hợp các dịch vụ nâng cao:

1. **Managed Database Service**:
   - Sử dụng **Neon.tech** - dịch vụ PostgreSQL Serverless giúp Auto-scaling và quản lý database chuyên nghiệp, thay vì tự cài đặt cục bộ.

2. **Secrets Manager**:
   - Tận dụng **GitHub Secrets** làm trung tâm quản lý biến môi trường. Điều này giúp ngăn chặn rò rỉ thông tin nhạy cảm vào mã nguồn (vấn đề bảo mật hàng đầu).

3. **Logging & Monitoring chuyên sâu**:
   - Tích hợp **Sentry**: Giám sát lỗi thời gian thực, ghi lại vị trí code gây ra crash và thông báo ngay lập tức cho nhóm qua Email/Dashboard.

4. **Triển khai Tác biệt (Decoupled Deployment)**:
   - **Frontend (RN/Expo)**: Phân phối qua Expo Go và định hướng App Store.
   - **Backend (Render)**: Triển khai độc lập dưới dạng Web Service, cho phép mở rộng Backend mà không ảnh hưởng tới người dùng đang dùng App.

---

## 📂 5. Hướng dẫn chạy nhanh

### Backend Setup
```bash
cd backend && npm install && npx prisma generate && npx prisma db seed && npm run start:dev
```

---

## 🛠 6. Hướng dẫn giám sát với Sentry

Dự án sử dụng Sentry để giám sát lỗi và hiệu năng thời gian thực.

### Tích hợp vào Code (Backend NestJS)
1. **Khởi tạo**: Trong `main.ts`, Sentry được khởi tạo ngay khi ứng dụng bắt đầu để bắt được các lỗi khởi động.
   ```ts
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     integrations: [nodeProfilingIntegration()],
     tracesSampleRate: 1.0,
   });
   ```
2. **Module**: `SentryModule.forRoot()` được import trong `app.module.ts` để tích hợp sâu vào hệ sinh thái NestJS.

### Thiết lập trên Sentry Portal
1. **Lấy DSN**: Vào **Sentry Dashboard > Project Settings > Client Keys (DSN)** để lấy mã kết nối. Lưu mã này vào biến `SENTRY_DSN` trong file `.env` hoặc GitHub Secrets.
2. **GitHub Integration**: 
   - Vào **Settings > Integrations > GitHub** để kết nối repository.
   - Việc này giúp Sentry hiển thị **Suspect Commits** (dự đoán đoạn code nào gây lỗi dựa trên lịch sử commit).
3. **Release Management**:
   - Tạo **Auth Token** tại **User Settings > API > Auth Tokens**.
   - Thêm Token này vào **GitHub Secrets** với tên `SENTRY_AUTH_TOKEN`.
   - Pipeline sẽ tự động tạo Release và link các commit mỗi khi deploy, giúp bạn biết chính xác phiên bản nào đang chạy.

### Kiểm tra hoạt động
Bạn có thể gọi endpoint sau để "ép" hệ thống tạo một lỗi test và kiểm tra xem Sentry có nhận được không:
`GET /v1/health/debug-sentry`

---

*Chúc bạn trải nghiệm và luyện tập vui vẻ với GameTwoShape!*
*(Dự án thực hiện bởi Nhóm CockRoaches - L02)*
---

