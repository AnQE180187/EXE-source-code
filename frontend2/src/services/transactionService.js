import api from './api';

export const createUpgradeTransaction = async (packageData) => {
  try {
    const response = await api.post('/transactions/upgrade-organizer', packageData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not create upgrade transaction.';
  }
};

export const createFeatureTransaction = async (packageData) => {
  try {
    // This will call a new endpoint on the backend for feature-specific transactions
    const response = await api.post('/transactions/feature-unlock', packageData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not create feature transaction.';
  }
};
export const getTransactionStatus = async (orderCode) => {
  try {
    const response = await api.get(`/transactions/status/${orderCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    // Return a default/error state if needed, or re-throw
    throw error;
  }
};

// Functions for Admin
export const getPendingTransactions = async () => {
  try {
    // Assuming the backend returns all transactions and we filter by PENDING status
    // A better approach would be a dedicated endpoint like /transactions?status=PENDING
    const response = await api.get('/transactions');
    return response.data.filter(t => t.status === 'PENDING' && t.description.includes('Nâng cấp'));
  } catch (error) {
    throw error.response?.data?.message || 'Could not fetch pending transactions.';
  }
};

export const confirmTransaction = async (transactionId) => {
  try {
    const response = await api.patch(`/transactions/${transactionId}/confirm`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not confirm the transaction.';
  }
};
