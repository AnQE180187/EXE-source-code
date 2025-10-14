import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createUpgradeTransaction } from '../services/transactionService';
import { getProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import './MomoPayment.css'; // Reusing styles

const OrganizerPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const selectedPackage = location.state?.package || { name: 'Gói Tháng', price: '350.000', period: 'tháng' };

  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkTimeoutRef = useRef(null);
  const overallTimeoutRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    if (overallTimeoutRef.current) {
      clearTimeout(overallTimeoutRef.current);
    }
    console.log("Polling stopped.");
  }, []);

  const runCheck = useCallback(async () => {
    if (document.hidden) { // Don't poll if the tab is not active
      scheduleNextCheck();
      return;
    }

    try {
      console.log("Polling for profile update...");
      const latestProfile = await getProfile();
      if (latestProfile.role === 'ORGANIZER') {
        stopPolling();
        toast.success('Thanh toán thành công! Tài khoản của bạn đã được nâng cấp.');
        await refreshUser();
        navigate('/manage/events');
      } else {
        scheduleNextCheck(); // Schedule the next check if not upgraded yet
      }
    } catch (pollError) {
      console.error("Polling error:", pollError);
      scheduleNextCheck(); // Still schedule the next check even if there was a network error
    }
  }, [refreshUser, navigate, stopPolling]);

  const scheduleNextCheck = useCallback(() => {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const minutesUntilNextMark = 5 - (currentMinutes % 5);

    const nextMark = new Date(now);
    nextMark.setMinutes(currentMinutes + minutesUntilNextMark);
    nextMark.setSeconds(0, 0);

    // Schedule the check 2 seconds after the next 5-minute mark
    const checkTime = new Date(nextMark.getTime() + 2000);
    const delay = Math.max(0, checkTime.getTime() - Date.now());

    console.log(`Next check scheduled in ${(delay / 1000).toFixed(1)}s at: ${checkTime.toLocaleTimeString()}`);

    checkTimeoutRef.current = setTimeout(runCheck, delay);
  }, [runCheck]);

  useEffect(() => {
    const generateQrCode = async () => {
      setLoading(true);
      const toastId = toast.loading('Đang tạo mã QR...');
      try {
        const transactionDetails = await createUpgradeTransaction({
          packageName: selectedPackage.name,
          packagePrice: selectedPackage.price,
        });

        const { amount, description, bankBin, accountNumber, accountName } = transactionDetails;
        const template = 'compact';
        const imageUrl = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

        setQrData({ qrUrl: imageUrl, amount, description, accountName });
        toast.success('Tạo mã QR thành công! Đang chờ xác nhận thanh toán.', { id: toastId, duration: 5000 });

        // Start smart polling
        scheduleNextCheck();

        // Set an overall timeout for polling
        overallTimeoutRef.current = setTimeout(() => {
          stopPolling();
          toast.error('Không nhận được xác nhận thanh toán. Vui lòng đăng nhập lại hoặc liên hệ hỗ trợ.', { duration: 10000 });
        }, 6 * 60 * 1000); // 6 minutes overall timeout to be safe

      } catch (err) {
        const errorMessage = err.toString() || 'Không thể tạo mã thanh toán. Vui lòng thử lại.';
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      }
      setLoading(false);
    };

    if (user && user.role !== 'ORGANIZER') {
      generateQrCode();
    }

    // Cleanup on component unmount
    return () => stopPolling();
  }, [selectedPackage, user, scheduleNextCheck, stopPolling]);

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
                <li>Hệ thống sẽ kiểm tra thanh toán sau mỗi phút. Vai trò của bạn sẽ được tự động nâng cấp ngay sau đó.</li>
                <li>Hệ thống sẽ tự động hủy giao dịch sau 10-15 phút.</li>
                <li style={{ color: '#007bff' }}><strong>Vui lòng không rời khỏi trang này</strong> để hệ thống tự động cập nhật.</li>
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