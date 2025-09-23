import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { upgradeToOrganizer } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import './MomoPayment.css'; // Reusing styles

const OrganizerPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPackage = location.state?.package || { name: 'Gói Tháng', price: '350.000', period: 'tháng' };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    const toastId = toast.loading('Đang xử lý yêu cầu nâng cấp...');

    try {
      await upgradeToOrganizer();
      toast.success('Nâng cấp thành công! Vui lòng đăng nhập lại để cập nhật vai trò của bạn.', { id: toastId });
      logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.toString() || 'Có lỗi xảy ra, vui lòng thử lại.', { id: toastId });
      setIsProcessing(false);
    }
  };

  return (
    <div className="momo-payment-container">
      <div className="momo-payment-card">
        <div className="momo-header">
          <img src="/logofreeday.png" alt="FreeDay Logo" className="logo" />
          <h2>Xác nhận nâng cấp tài khoản</h2>
        </div>

        <div className="payment-details">
          <div className="detail-row">
            <span>Gói dịch vụ:</span>
            <strong>{selectedPackage.name}</strong>
          </div>
          <div className="detail-row total">
            <span>Chi phí:</span>
            <strong>{selectedPackage.price} VND</strong>
          </div>
        </div>

        <div className="instructions">
          <p>Bằng việc nhấn nút bên dưới, tài khoản của bạn sẽ được nâng cấp thành <strong>Nhà tổ chức</strong>.</p>
          <p>(Đây là tính năng giả lập cho mục đích demo do chưa tích hợp cổng thanh toán.)</p>
        </div>

        <button 
          className="confirm-payment-btn"
          onClick={handleUpgrade}
          disabled={isProcessing}
        >
          {isProcessing ? 'Đang xử lý...' : 'Xác nhận & Nâng cấp'}
        </button>

        <div className="footer-links">
            <Link to="/pricing" className="back-link">Quay lại</Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizerPaymentPage;