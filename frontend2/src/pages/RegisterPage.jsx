import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

// Zod schema for validation, matching the backend DTO
const registerSchema = z.object({
  displayName: z.string().min(2, { message: 'Tên hiển thị phải có ít nhất 2 ký tự.' }),
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
  confirmPassword: z.string(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Số điện thoại phải có đúng 10 chữ số.' }).optional().or(z.literal('')),
  address: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const { register: registerUser, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setApiError(null);
    try {
      // Exclude confirmPassword from the data sent to the backend
      const { confirmPassword: _confirmPassword, ...submissionData } = data;
      if (submissionData.dateOfBirth === '') {
        submissionData.dateOfBirth = null;
      }
      await registerUser(submissionData);
      navigate('/login?registered=true');
    } catch (error) {
      setApiError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        <h1 className="register-title">Tạo tài khoản mới</h1>
        <p className="register-subtitle">Bắt đầu hành trình khám phá sự kiện của bạn!</p>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          {apiError && <p className="api-error-message">{apiError}</p>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="displayName">Tên của Bạn</label>
              <input id="displayName" {...register('displayName')} />
              {errors.displayName && <p className="form-error">{errors.displayName.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" {...register('email')} />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input id="password" type="password" {...register('password')} />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input id="confirmPassword" type="password" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <hr className="form-divider" />

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Ngày sinh</label>
              <input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Giới tính</label>
              <select id="gender" {...register('gender')}>
                <option value="">Không muốn tiết lộ</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Thành phố</label>
              <input id="city" {...register('city')} placeholder="VD: Hồ Chí Minh" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input 
                id="phone" 
                {...register('phone')} 
                placeholder="VD: 0123456789"
                maxLength="10"
              />
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <input 
              id="address" 
              {...register('address')} 
              placeholder="VD: 123 Nguyễn Văn A, Quận 1, TP.HCM" 
            />
            {errors.address && <p className="form-error">{errors.address.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="bio">Tiểu sử ngắn</label>
            <textarea id="bio" {...register('bio')} rows="3" placeholder="Chia sẻ một chút về bạn..."></textarea>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
          </button>
        </form>

        <p className="switch-to-login">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;