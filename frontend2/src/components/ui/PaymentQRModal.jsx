import React from 'react';
import Modal from './Modal';
import '../../pages/MomoPayment.css'; // Reuse styles

const PaymentQRModal = ({ isOpen, onClose, qrData }) => {
  if (!qrData) return null;

  const { qrUrl, amount, description, accountName } = qrData;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thanh toán đặt cọc qua VietQR">
      <div className="momo-payment-card" style={{ border: 'none', boxShadow: 'none' }}>
        <div className="payment-details">
          <div className="detail-row total">
            <span>Số tiền cần thanh toán:</span>
            <strong>{amount.toLocaleString('vi-VN')} VND</strong>
          </div>
        </div>

        <div className="qr-section">
          <img src={qrUrl} alt="VietQR Code" className="qr-code-img" />
        </div>

        <div className="instructions">
          <h4>Hướng dẫn thanh toán</h4>
          <ol>
            <li>Mở ứng dụng ngân hàng của bạn và chọn tính năng <strong>QR Pay</strong>.</li>
            <li>Quét mã QR ở trên để thanh toán.</li>
            <li>Giữ nguyên nội dung chuyển khoản là <strong>{description}</strong> để được xử lý tự động.</li>
            <li>Sau khi thanh toán thành công, hệ thống sẽ tự động xác nhận. Bạn có thể tải lại trang để cập nhật trạng thái.</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentQRModal;
