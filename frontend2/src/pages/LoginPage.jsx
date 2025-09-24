import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import '../styles/form.css';

const LoginPage = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      setApiError(error.message || 'Đăng nhập thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Đăng Nhập</h1>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {isRegistered && <p className="form-message form-message--success">Đăng ký thành công! Vui lòng đăng nhập.</p>}
          {apiError && <p className="form-message form-message--error">{apiError}</p>}
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              id="email" 
              className="login-input"
              placeholder="email@example.com" 
              {...register('email', { required: 'Email là bắt buộc' })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="form-label">Mật khẩu</label>
            <input 
              id="password" 
              type="password" 
              className="login-input"
              {...register('password', { required: 'Mật khẩu là bắt buộc' })}
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
          <p className="login-link">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;