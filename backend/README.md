# Freeday Backend

Backend Node.js/Express sử dụng TypeScript, MongoDB, JWT, bcryptjs.

## Chức năng
- Đăng ký, đăng nhập, xác thực người dùng (User, Organizer, Admin)
- Lưu trữ user vào MongoDB

## Cấu hình môi trường
Tạo file `.env` với nội dung:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/freeday
JWT_SECRET=your_jwt_secret_here
```

## Khởi động server
```
npx ts-node src/index.ts
```
Hoặc dùng nodemon:
```
npx nodemon src/index.ts
```

## Thư mục chính
- `src/models/User.ts`: Mongoose User model
- `src/routes/auth.ts`: Đăng ký, đăng nhập
- `src/index.ts`: Khởi tạo app
