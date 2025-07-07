# Freeday Web - Nền tảng kết nối cộng đồng

Freeday là một nền tảng web hiện đại giúp kết nối mọi người thông qua các sự kiện thú vị. Dự án được xây dựng với React, TypeScript và Tailwind CSS.

## 🎨 Design System

Dự án sử dụng design system với màu xanh lá chủ đạo:

- **Primary Colors**: Xanh lá (#22c55e) - màu chủ đạo
- **Secondary Colors**: Tím (#d946ef) - màu phụ
- **Accent Colors**: Vàng (#eab308) - màu nhấn
- **Neutral Colors**: Xám trung tính cho text và background

### Typography
- **Display Font**: Poppins cho headings
- **Body Font**: Inter cho text thường

### Components
- Button variants: primary, secondary, outline, ghost
- Card components với hover effects
- Input fields với focus states
- Badge components
- Gradient backgrounds

## 🚀 Tính năng

### Đã hoàn thành
- ✅ Trang chủ với hero section và featured events
- ✅ Trang sự kiện với filter và search
- ✅ Trang đăng nhập/đăng ký
- ✅ Navigation responsive
- ✅ Design system hoàn chỉnh
- ✅ Demo data phong phú

### Đang phát triển
- 🔄 Trang chi tiết sự kiện
- 🔄 Trang diễn đàn
- 🔄 Trang profile người dùng
- 🔄 Chat realtime
- 🔄 Admin dashboard

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Validation
- **Socket.io** - Realtime features

### Development
- **Vite** - Build tool
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📁 Cấu trúc dự án

```
src/
├── components/
│   └── common/
│       ├── Button.tsx
│       ├── Header.tsx
│       └── Footer.tsx
├── layouts/
│   └── MainLayout.tsx
├── pages/
│   ├── Home.tsx
│   ├── Events.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── NotFound.tsx
├── routes/
│   └── AppRouter.tsx
├── services/
│   └── api.ts
├── hooks/
│   └── useAuth.ts
├── utils/
│   └── formatDate.ts
└── assets/
```

## 🎯 Demo Data

Dự án bao gồm demo data phong phú:

### Sự kiện
- Live Music Night (Âm nhạc)
- Bóng đá cộng đồng (Thể thao)
- Workshop Nấu ăn (Ẩm thực)
- Hiking Bà Nà (Ngoài trời)
- Photography Workshop (Nghệ thuật)
- Board Game Night (Giao lưu)
- Yoga tại công viên (Thể thao)
- Coding Meetup (Công nghệ)
- Karaoke Night (Âm nhạc)

### Features
- Tìm kiếm sự kiện
- Filter theo loại, vibe, giá
- Responsive design
- Smooth animations
- Modern UI/UX

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js 16+
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Lint code
```bash
npm run lint
```

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Animations
- Fade in effects
- Slide up animations
- Hover transitions
- Loading states

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management

### Performance
- Lazy loading
- Optimized images
- Code splitting
- Bundle optimization

## 📱 Responsive Navigation

- **Desktop**: Full navigation menu
- **Mobile**: Hamburger menu với slide-down
- **Active states**: Highlight trang hiện tại
- **Smooth transitions**: Hover và focus effects

## 🔧 Development

### Code Style
- ESLint configuration
- TypeScript strict mode
- Prettier formatting
- Consistent naming conventions

### Git Workflow
- Feature branches
- Commit conventions
- Code review process

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📞 Contact

- Email: contact@freeday.com
- Website: https://freeday.com
- GitHub: https://github.com/freeday-web

---

**Freeday** - Kết nối cộng đồng, tạo ra những trải nghiệm đáng nhớ! 🌟
