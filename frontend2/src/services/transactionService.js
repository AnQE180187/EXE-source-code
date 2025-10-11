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
