
# FreeDayy Backend

This is the backend server for the FreeDayy application, built with Node.js, Express, and MongoDB.

## Project Structure

```
backend/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middleware/         # Custom middleware
├── models/             # Database models
├── routes/             # API routes
├── utils/              # Utility functions
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
└── server.js           # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`
5. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/update-profile` - Update user profile

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join an event

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/comments` - Add comment to post
- `POST /api/posts/:id/like` - Like/unlike post

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
