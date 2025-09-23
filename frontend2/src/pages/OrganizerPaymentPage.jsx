import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './MomoPayment.css'; // Shared CSS

const OrganizerPaymentPage = () => {
  const location = useLocation();
  
  const selectedPackage = location.state?.package || { name: 'Gói Tháng', price: '350.000', period: 'tháng' };

  return (
    <div className="momo-payment-container">
      <div className="momo-payment-card">
        <div className="momo-header">
          <img src="/logofreeday.png" alt="FreeDay Logo" className="logo" />
          <h2>Thanh toán qua Ví Momo</h2>
        </div>

        <div className="payment-details">
          <div className="detail-row">
            <span>Gói dịch vụ:</span>
            <strong>{selectedPackage.name}</strong>
          </div>
          <div className="detail-row total">
            <span>Tổng thanh toán:</span>
            <strong>{selectedPackage.price} VND</strong>
          </div>
        </div>

        <div className="qr-section">
          <img src="/qrcode.png" alt="Momo QR Code" className="qr-code-img" />
        </div>

        <div className="instructions">
          <h4>Hướng dẫn thanh toán</h4>
          <ol>
            <li>Mở ứng dụng <strong>Momo</strong> trên điện thoại của bạn.</li>
            <li>Chọn tính năng <strong>"Quét Mã"</strong>.</li>
            <li>Quét mã QR ở trên để hoàn tất thanh toán.</li>
          </ol>
        </div>

        <div className="footer-links">
            <Link to="/pricing" className="back-link">Quay lại</Link>
            <Link to="/my-events" className="status-link">Kiểm tra trạng thái</Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizerPaymentPage;