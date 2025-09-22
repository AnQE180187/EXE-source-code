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
        throw error.response.data.message || 'Đã có lỗi xảy ra';
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};
