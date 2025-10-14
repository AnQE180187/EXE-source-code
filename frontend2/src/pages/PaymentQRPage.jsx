import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePaymentStatus from '../hooks/usePaymentStatus';
import './PaymentQRPage.css';

const PaymentQRPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const qrData = location.state?.qrData;

  // Redirect if no QR data is present
  useEffect(() => {
    if (!qrData) {
      console.error('No QR data found, redirecting...');
      navigate(-1); // Go back to the previous page
    }
  }, [qrData, navigate]);

  const handlePaymentSuccess = () => {
    alert('Thanh toán đặt cọc thành công!');
    // Navigate back to the event detail page, assuming the event ID is part of the QR data or needs to be passed differently.
    // For now, let's navigate back to the events list as a fallback.
    const eventId = qrData.description.substring(3); // Simple extraction, might need improvement
    navigate(`/events`);
  };

  const { paymentStatus } = usePaymentStatus(qrData?.description, handlePaymentSuccess, !!qrData);

  if (!qrData) {
    return <div className="loading-message">Đang chuyển hướng...</div>;
  }

  const renderStatus = () => {
    switch (paymentStatus) {
      case 'PENDING':
        return (
          <div className="payment-status payment-status--pending">
            <div className="spinner"></div>
            <span>Đang chờ thanh toán... Vui lòng không rời khỏi trang này.</span>
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="payment-status payment-status--completed">
            <span>Thanh toán thành công! Đang chuyển hướng...</span>
          </div>
        );
      case 'FAILED':
        return (
          <div className="payment-status payment-status--failed">
            <span>Thanh toán thất bại hoặc đã hết hạn.</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="payment-qr-page">
      <div className="payment-card">
        <h1 className="payment-title">Thanh toán Đặt cọc qua VietQR</h1>
        <p className="payment-subtitle">Quét mã QR dưới đây bằng ứng dụng ngân hàng của bạn</p>
        
        <div className="qr-section">
          <img src={qrData.qrUrl} alt="VietQR Code" className="qr-code-image" />
        </div>

        <div className="payment-details">
          <div className="detail-row">
            <span>Số tiền:</span>
            <strong>{qrData.amount.toLocaleString('vi-VN')} VNĐ</strong>
          </div>
          <div className="detail-row">
            <span>Nội dung:</span>
            <strong className="order-code">{qrData.description}</strong>
          </div>
           <div className="detail-row">
            <span>Ngân hàng:</span>
            <strong>MB Bank</strong>
          </div>
           <div className="detail-row">
            <span>Chủ tài khoản:</span>
            <strong>{qrData.accountName}</strong>
          </div>
        </div>

        <div className="payment-status-container">
          {renderStatus()}
        </div>

        <div className="instructions">
          <h4>Hướng dẫn:</h4>
          <ol>
            <li>Mở ứng dụng Ngân hàng của bạn và chọn tính năng quét mã QR.
            </li>
            <li>Giữ nguyên nội dung chuyển khoản là <strong>{qrData.description}</strong> để giao dịch được xác nhận tự động.</li>
            <li>Hệ thống sẽ tự động kiểm tra và xác nhận thanh toán.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRPage;
