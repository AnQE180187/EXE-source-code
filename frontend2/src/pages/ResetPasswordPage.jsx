import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import './ResetPasswordPage.css';
import '../styles/form.css';

const ResetPasswordPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const [apiError, setApiError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const onSubmit = async ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      setApiError('Mật khẩu xác nhận không khớp');
      return;
    }
    setIsLoading(true);
    setApiError(null);
    setMessage(null);
    try {
      const res = await resetPassword({ token, password });
      setMessage(res.message || 'Đặt lại mật khẩu thành công.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Liên kết không hợp lệ</h1>
          <p className="login-link">Vui lòng yêu cầu lại tại <Link to="/forgot-password">Quên mật khẩu</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Đặt lại mật khẩu</h1>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {message && <p className="form-message form-message--success">{message}</p>}
          {apiError && <p className="form-message form-message--error">{apiError}</p>}
          <div>
            <label htmlFor="password" className="form-label">Mật khẩu mới</label>
            <input 
              id="password" 
              type="password" 
              className="login-input"
              {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } })}
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
            <input 
              id="confirmPassword" 
              type="password" 
              className="login-input"
              {...register('confirmPassword', { required: 'Vui lòng xác nhận mật khẩu' })}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;





