import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createUpgradeTransaction } from '../services/transactionService';
import './MomoPayment.css'; // Reusing styles

const OrganizerPaymentPage = () => {
  const location = useLocation();
  const selectedPackage = location.state?.package || { name: 'Gói Tháng', price: '350.000', period: 'tháng' };

  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateQrCode = async () => {
      setLoading(true);
      const toastId = toast.loading('Đang tạo mã QR...');
      try {
        // 1. Create transaction on our backend to get payment details
        const transactionDetails = await createUpgradeTransaction({
          packageName: selectedPackage.name,
          packagePrice: selectedPackage.price,
        });

        // 2. Construct the direct image URL for VietQR
        const { amount, description, bankBin, accountNumber, accountName } = transactionDetails;
        const template = 'compact'; // Or compact2
        const imageUrl = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

        setQrData({
          qrUrl: imageUrl,
          amount,
          description,
          accountName,
        });

        toast.success('Tạo mã QR thành công!', { id: toastId });
      } catch (err) {
        const errorMessage = err.toString() || 'Không thể tạo mã thanh toán. Vui lòng thử lại.';
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      }
      setLoading(false);
    };

    generateQrCode();
  }, [selectedPackage]);

  return (
    <div className="momo-payment-container">
      <div className="momo-payment-card">
        <div className="momo-header">
          <img src="/logofreeday.png" alt="FreeDay Logo" className="logo" />
          <h2>Thanh toán nâng cấp tài khoản</h2>
        </div>

        {loading ? (
          <p>Đang tạo mã QR, vui lòng chờ...</p>
        ) : error ? (
          <div className="payment-error">
            <p>Đã xảy ra lỗi: {error}</p>
            <Link to="/pricing" className="back-link">Quay lại trang giá</Link>
          </div>
        ) : qrData ? (
          <>
            <div className="payment-details">
              <div className="detail-row">
                <span>Gói dịch vụ:</span>
                <strong>{selectedPackage.name}</strong>
              </div>
              <div className="detail-row total">
                <span>Số tiền cần thanh toán:</span>
                <strong>{qrData.amount.toLocaleString('vi-VN')} VND</strong>
              </div>
            </div>

            <div className="qr-section">
              <img src={qrData.qrUrl} alt="VietQR Code" className="qr-code-img" />
            </div>

            <div className="instructions">
              <h4>Hướng dẫn thanh toán</h4>
              <ol>
                <li>Mở ứng dụng ngân hàng của bạn và chọn tính năng <strong>QR Pay</strong>.</li>
                <li>Quét mã QR ở trên để thanh toán.</li>
                <li>Giữ nguyên nội dung chuyển khoản là <strong>{qrData.description}</strong> để được xử lý tự động.</li>
                <li>Sau khi thanh toán thành công, vai trò của bạn sẽ được <strong>tự động nâng cấp</strong> sau vài phút.</li>
              </ol>
            </div>
          </>
        ) : null}

        <div className="footer-links">
          <Link to="/pricing" className="back-link">Chọn gói khác</Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizerPaymentPage;