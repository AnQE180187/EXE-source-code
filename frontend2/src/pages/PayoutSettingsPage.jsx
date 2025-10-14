import React, { useState, useEffect } from 'react';
import { getPayoutAccount, upsertPayoutAccount } from '../services/payoutAccountService';
import toast from 'react-hot-toast';
import './PayoutSettingsPage.css';

const PayoutSettingsPage = () => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const data = await getPayoutAccount();
        if (data) {
          setFormData({
            bankName: data.bankName,
            accountName: data.accountName,
            accountNumber: data.accountNumber,
          });
        }
      } catch (error) {
        toast.error(error.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bankName || !formData.accountName || !formData.accountNumber) {
      toast.error('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    try {
      setSaving(true);
      await upsertPayoutAccount(formData);
      toast.success('Đã cập nhật thông tin tài khoản thành công!');
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Đang tải...</div>;
  }

  return (
    <div className="payout-settings-page">
      <div className="payout-settings-container">
        <h1 className="payout-settings-title">Cài đặt Thanh toán</h1>
        <p className="payout-settings-subtitle">
          Đây là thông tin tài khoản ngân hàng chúng tôi sẽ sử dụng để thanh toán doanh thu từ các sự kiện của bạn.
        </p>

        <form onSubmit={handleSubmit} className="payout-form">
          <div className="form-group">
            <label htmlFor="bankName">Tên ngân hàng</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Ví dụ: Vietcombank, Techcombank..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountName">Tên chủ tài khoản</label>
            <input
              type="text"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Tên in trên thẻ hoặc tài khoản"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber">Số tài khoản</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Nhập chính xác số tài khoản của bạn"
              required
            />
          </div>

          <button type="submit" className="save-button" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PayoutSettingsPage;
