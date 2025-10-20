import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import '../styles/form.css';

const LoginPage = () => {
  const { login, loginWithToken } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      loginWithToken(token);
      navigate('/');
    }
  }, [searchParams, loginWithToken, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const user = await login(data);
      if (user && user.role.toLowerCase() === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;
      if (status === 401) {
        setApiError('Sai email hoặc mật khẩu');
      } else if (typeof backendMessage === 'string') {
        setApiError(backendMessage);
      } else if (Array.isArray(backendMessage)) {
        setApiError(backendMessage.join(', '));
      } else {
        setApiError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
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
          <div className="or-separator"><span>HOẶC</span></div>
          <button type="button" className="google-login-button" onClick={handleGoogleLogin}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google icon" />
            Đăng nhập với Google
          </button>
          <p className="login-link">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
          <p className="login-link">
            Quên mật khẩu? <Link to="/forgot-password">Khôi phục ngay</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;