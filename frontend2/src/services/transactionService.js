import api from './api';

export const createUpgradeTransaction = async (packageData) => {
  try {
    const response = await api.post('/transactions/upgrade-organizer', packageData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not create upgrade transaction.';
  }
};
