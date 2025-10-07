import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    // Ném lỗi để component có thể bắt và xử lý
    throw error.response.data.message || 'Đã có lỗi xảy ra';
  }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Đã có lỗi xảy ra';
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Đã có lỗi xảy ra';
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Đã có lỗi xảy ra';
  }
};

export const verifyForgotOtp = async ({ email, otp }) => {
  try {
    const response = await api.post('/auth/forgot-password/otp', { email, otp });
    return response.data; // { token }
  } catch (error) {
    throw error.response?.data?.message || 'Đã có lỗi xảy ra';
  }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await api.post('/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Đã có lỗi xảy ra';
  }
};