import api from './api';

export const getPayoutAccount = async () => {
  try {
    const response = await api.get('/payout-accounts/me');
    return response.data;
  } catch (error) {
    // It's okay if it's a 404, it just means no account is set up yet.
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error.response?.data?.message || 'Không thể tải thông tin tài khoản.';
  }
};

export const upsertPayoutAccount = async (data) => {
  try {
    const response = await api.post('/payout-accounts', data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể lưu thông tin tài khoản.';
  }
};
