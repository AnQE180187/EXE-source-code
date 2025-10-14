import api from './api';

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const confirmTransaction = async (id) => {
  const response = await api.patch(`/transactions/${id}/confirm`);
  return response.data;
};
