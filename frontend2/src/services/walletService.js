import api from './api';

export const getWalletBalance = async () => {
  try {
    const response = await api.get('/wallet/me');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể tải số dư ví.';
  }
};

export const getWithdrawalHistory = async () => {
  try {
    const response = await api.get('/withdrawals');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể tải lịch sử rút tiền.';
  }
};

export const createWithdrawal = async (amount) => {
  try {
    const response = await api.post('/withdrawals', { amount });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Yêu cầu rút tiền thất bại.';
  }
};
