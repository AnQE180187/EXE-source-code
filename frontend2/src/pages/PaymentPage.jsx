import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { confirmDeposit } from '../services/registrationService';
import './MomoPayment.css'; // Shared CSS

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePaymentConfirmation = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // In a real Momo integration, you would poll your backend to check if the payment was successful.
      // Here, we just simulate it.
      await confirmDeposit(event.id);
      alert('Thanh toán và đặt cọc thành công!');
      // Navigate to ticket page to show the ticket details
      navigate(`/events/${event.id}/ticket`);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!event) {
    return (
      <div className="momo-payment-container">
        <div className="momo-payment-card">
          <h2>Lỗi</h2>
          <p>Không tìm thấy thông tin sự kiện để thanh toán.</p>
          <Link to="/events" className="back-link">Quay lại trang sự kiện</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="momo-payment-container">
      <div className="momo-payment-card">
        <div className="momo-header">
          <img src="/logofreeday.png" alt="FreeDay Logo" className="logo" />
          <h2>Thanh toán qua Ví Momo</h2>
        </div>

        {error && <p className="payment-error">{error}</p>}

        <div className="payment-details">
          <div className="detail-row">
            <span>Sự kiện:</span>
            <strong>{event.title}</strong>
          </div>
          <div className="detail-row total">
            <span>Tiền đặt cọc:</span>
            <strong>{event.price.toLocaleString('vi-VN')} VND</strong>
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
            <li>Quét mã QR và hoàn tất thanh toán.</li>
            <li>Nhấn nút <strong>"Tôi đã thanh toán"</strong> bên dưới để xác nhận.</li>
          </ol>
        </div>

        <button
          className="confirm-payment-btn"
          onClick={handlePaymentConfirmation}
          disabled={isProcessing}
        >
          {isProcessing ? 'Đang xử lý...' : 'Tôi đã thanh toán'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;