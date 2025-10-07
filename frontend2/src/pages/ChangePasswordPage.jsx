import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/authService';
import './ChangePasswordPage.css';
import '../styles/form.css';

const ChangePasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ currentPassword, newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      setApiError('Mật khẩu xác nhận không khớp');
      return;
    }
    setIsLoading(true);
    setApiError(null);
    setMessage(null);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      setMessage(res.message || 'Đổi mật khẩu thành công.');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      setApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Đổi mật khẩu</h1>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {message && <p className="form-message form-message--success">{message}</p>}
          {apiError && <p className="form-message form-message--error">{apiError}</p>}
          
          <div>
            <label htmlFor="currentPassword" className="form-label">Mật khẩu hiện tại</label>
            <input 
              id="currentPassword" 
              type="password" 
              className="login-input"
              {...register('currentPassword', { required: 'Mật khẩu hiện tại là bắt buộc' })}
            />
            {errors.currentPassword && <p className="form-error">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
            <input 
              id="newPassword" 
              type="password" 
              className="login-input"
              {...register('newPassword', { 
                required: 'Mật khẩu mới là bắt buộc', 
                minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } 
              })}
            />
            {errors.newPassword && <p className="form-error">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
            <input 
              id="confirmPassword" 
              type="password" 
              className="login-input"
              {...register('confirmPassword', { required: 'Vui lòng xác nhận mật khẩu mới' })}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/profile')}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;