import api from './api';

export const getWithdrawals = (status) => {
  return api.get('/admin/withdrawals', { params: { status } });
};

export const approveWithdrawal = (id) => {
  return api.patch(`/admin/withdrawals/${id}/approve`);
};

export const rejectWithdrawal = (id) => {
  return api.patch(`/admin/withdrawals/${id}/reject`);
};

export const getAllWallets = () => {
  return api.get('/admin/wallets');
};
