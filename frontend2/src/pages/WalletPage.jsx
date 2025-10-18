import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getWalletBalance, getWithdrawalHistory, createWithdrawal } from '../services/walletService';
import { getPayoutAccount } from '../services/payoutAccountService';
import toast from 'react-hot-toast';
import { Wallet, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import './WalletPage.css';

const COMMISSION_RATE = 0.15; // 15% commission

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [payoutAccount, setPayoutAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletData, historyData, accountData] = await Promise.all([
        getWalletBalance(),
        getWithdrawalHistory(),
        getPayoutAccount().catch(() => null), // Ignore 404 errors for payout account
      ]);
      setBalance(walletData.balance);
      setHistory(historyData);
      setPayoutAccount(accountData);
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (amount > balance) {
      toast.error('Số tiền rút không được vượt quá số dư.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createWithdrawal(amount);
      toast.success('Yêu cầu rút tiền đã được gửi đi thành công!');
      setWithdrawalAmount('');
      fetchData(); // Refresh data after withdrawal
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const statusClasses = {
      PENDING: 'history-badge--pending',
      COMPLETED: 'history-badge--completed',
      FAILED: 'history-badge--failed',
    };
    return <span className={`history-badge ${statusClasses[status] || ''}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading-message">Đang tải dữ liệu ví...</div>;
  }

  return (
    <div className="wallet-page">
      <h1 className="wallet-page-title">Ví của tôi</h1>
      <div className="wallet-grid">
        {/* Left Column: Balance and Withdrawal */}
        <div className="wallet-main-column">
          <div className="wallet-card balance-card">
            <div className="card-header">
              <Wallet size={24} />
              <h2>Số dư hiện tại</h2>
            </div>
            <p className="balance-amount">{balance.toLocaleString('vi-VN')} VNĐ</p>
            <p className="balance-note">Đây là tổng doanh thu từ các sự kiện của bạn.</p>
          </div>

          <div className="wallet-card withdrawal-card">
            <div className="card-header">
              <DollarSign size={24} />
              <h2>Yêu cầu rút tiền</h2>
            </div>
            {!payoutAccount ? (
              <div className="payout-warning">
                <AlertTriangle size={40} />
                <p>Bạn cần phải thiết lập thông tin tài khoản nhận tiền trước khi có thể rút tiền.</p>
                <Link to="/payout-settings" className="setup-payout-link">Cài đặt ngay</Link>
              </div>
            ) : (
              <form onSubmit={handleWithdrawal}>
                <p className="payout-info">
                  Tiền sẽ được chuyển vào tài khoản: 
                  <strong>{payoutAccount.bankName} - {payoutAccount.accountNumber}</strong>
                </p>
                <div className="withdrawal-form-group">
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Nhập số tiền cần rút"
                    className="withdrawal-input"
                    min="1"
                    max={balance}
                    required
                  />
                  <button type="submit" className="withdrawal-button" disabled={isSubmitting || balance <= 0}>
                    {isSubmitting ? 'Đang xử lý...' : 'Rút tiền'}
                  </button>
                </div>
                
                {withdrawalAmount && !isNaN(parseFloat(withdrawalAmount)) && parseFloat(withdrawalAmount) > 0 && (
                  <div className="withdrawal-summary">
                    <div className="summary-row">
                      <span>Số tiền yêu cầu:</span>
                      <span>{parseFloat(withdrawalAmount).toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="summary-row">
                      <span>Phí hoa hồng (15%):</span>
                      <span className="commission-fee">-{(parseFloat(withdrawalAmount) * COMMISSION_RATE).toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <hr className="summary-divider" />
                    <div className="summary-row total-row">
                      <span>Thực nhận:</span>
                      <span>{(parseFloat(withdrawalAmount) * (1 - COMMISSION_RATE)).toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Right Column: History */}
        <div className="wallet-side-column">
          <div className="wallet-card history-card">
            <div className="card-header">
              <Clock size={24} />
              <h2>Lịch sử rút tiền</h2>
            </div>
            {history.length > 0 ? (
              <ul className="history-list">
                {history.map(item => (
                  <li key={item.id} className="history-item">
                    <div className="history-item-details">
                      <span className="history-amount">{item.amount.toLocaleString('vi-VN')} VNĐ</span>
                      <span className="history-date">{new Date(item.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    {statusBadge(item.status)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-history">Chưa có giao dịch nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;

