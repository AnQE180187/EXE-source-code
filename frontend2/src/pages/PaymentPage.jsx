import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { upgradeToOrganizer } from '../services/userService';
import './PaymentPage.css';
import '../styles/form.css';
import '../components/ui/Button.css';

const packages = [
  { name: 'Gói Tuần', price: '50,000 VNĐ', duration: '7 ngày', features: ['Tạo và quản lý sự kiện không giới hạn', 'Hỗ trợ ưu tiên'], popular: false },
  { name: 'Gói Tháng', price: '150,000 VNĐ', duration: '30 ngày', features: ['Tạo và quản lý sự kiện không giới hạn', 'Hỗ trợ ưu tiên', 'Thống kê sự kiện cơ bản'], popular: true },
  { name: 'Gói Năm', price: '1,500,000 VNĐ', duration: '365 ngày', features: ['Tạo và quản lý sự kiện không giới hạn', 'Hỗ trợ ưu tiên', 'Thống kê sự kiện nâng cao', 'Sự kiện nổi bật'], popular: false },
];

const PaymentPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setApiError(null);
    setTimeout(() => {
      document.getElementById('payment-form').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // The form data isn't actually used by the backend for this, but in a real scenario
      // it would be sent to a payment processor like Stripe.
      console.log('Processing payment for:', selectedPackage.name, 'with data:', data);
      
      await upgradeToOrganizer();
      
      alert(`Đăng ký ${selectedPackage.name} thành công! Bạn đã trở thành Nhà tổ chức.`);
      
      // Force a reload of the page to ensure the auth context gets the new user role.
      // A more elegant solution might involve a dedicated function in AuthContext to refresh the user state.
      window.location.href = '/events/create'; 

    } catch (err) {
      setApiError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="page-header">
        <h1 className="page-title">Nâng cấp tài khoản Organizer</h1>
        <p className="page-subtitle">Chọn một gói phù hợp để bắt đầu tạo và quản lý sự kiện của riêng bạn.</p>
      </div>

      <div className="package-grid">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`package-card ${pkg.popular ? 'package-card--popular' : ''}`}>
            {pkg.popular && <div className="package-card__popular-badge">Phổ biến nhất</div>}
            <div className="package-card__header">
              <h3 className="package-card__name">{pkg.name}</h3>
              <p className="package-card__price">{pkg.price}</p>
              <p className="package-card__duration">/ {pkg.duration}</p>
            </div>
            <div className="package-card__features">
              <ul>
                {pkg.features.map((feature, i) => (
                  <li key={i}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="package-card__footer">
              <button className="button" onClick={() => handleSelectPackage(pkg)}>Chọn gói này</button>
            </div>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div id="payment-form" className="payment-form-section">
          <div className="form-container">
            <h2 className="form-title">Thanh toán cho {selectedPackage.name}</h2>
            {apiError && <p className="form-message form-message--error">{apiError}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-content">
                <div className="form-group">
                  <label htmlFor="cardName" className="form-label">Tên trên thẻ</label>
                  <input id="cardName" {...register('cardName', { required: true })} className="form-input" />
                  {errors.cardName && <p className="form-error">Tên trên thẻ là bắt buộc.</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="cardNumber" className="form-label">Số thẻ</label>
                  <input id="cardNumber" {...register('cardNumber', { required: true })} className="form-input" placeholder="0000 0000 0000 0000" />
                  {errors.cardNumber && <p className="form-error">Số thẻ là bắt buộc.</p>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate" className="form-label">Ngày hết hạn</label>
                    <input id="expiryDate" {...register('expiryDate', { required: true })} className="form-input" placeholder="MM/YY" />
                    {errors.expiryDate && <p className="form-error">Bắt buộc.</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvc" className="form-label">CVC</label>
                    <input id="cvc" {...register('cvc', { required: true })} className="form-input" placeholder="123" />
                    {errors.cvc && <p className="form-error">Bắt buộc.</p>}
                  </div>
                </div>
              </div>
              <div className="form-footer">
                <button type="submit" className="button form-button" disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : `Thanh toán ${selectedPackage.price}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;