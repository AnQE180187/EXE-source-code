import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, verifyForgotOtp } from '../services/authService';
import './ForgotPasswordPage.css';
import '../styles/form.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();
  const [message, setMessage] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email' | 'otp'

  const onSubmitEmail = async ({ email }) => {
    setIsLoading(true);
    setApiError(null);
    setMessage(null);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message || 'Nếu email tồn tại, mã OTP đã được gửi.');
      setStep('otp');
    } catch (error) {
      setApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOtp = async ({ otp }) => {
    setIsLoading(true);
    setApiError(null);
    setMessage(null);
    try {
      const email = getValues('email');
      const res = await verifyForgotOtp({ email, otp }); // { token }
      const token = res.token;
      navigate(`/reset-password?token=${encodeURIComponent(token)}`);
    } catch (error) {
      setApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Quên mật khẩu</h1>
        {step === 'email' && (
          <form className="login-form" onSubmit={handleSubmit(onSubmitEmail)}>
            {message && <p className="form-message form-message--success">{message}</p>}
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
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Gửi mã OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form className="login-form" onSubmit={handleSubmit(onSubmitOtp)}>
            {message && <p className="form-message form-message--success">{message}</p>}
            {apiError && <p className="form-message form-message--error">{apiError}</p>}
            <div>
              <label htmlFor="otp" className="form-label">Nhập mã OTP</label>
              <input 
                id="otp"
                className="login-input"
                placeholder="6 chữ số"
                {...register('otp', { required: 'Vui lòng nhập OTP', minLength: { value: 6, message: 'OTP gồm 6 chữ số' }, maxLength: { value: 6, message: 'OTP gồm 6 chữ số' } })}
              />
              {errors.otp && <p className="form-error">{errors.otp.message}</p>}
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác thực OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;





