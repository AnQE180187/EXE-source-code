import api from './api';

export const getProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Không thể lấy thông tin hồ sơ.';
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/me', profileData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Cập nhật hồ sơ thất bại.';
  }
};

export const getMyEvents = async () => {
  try {
    const response = await api.get('/users/me/events');
    return response.data; // { registered: [], favorited: [], organized: [] }
  } catch (error) {
    throw error.response.data.message || 'Không thể tải danh sách sự kiện.';
  }
};

export const upgradeToOrganizer = async () => {
  try {
    const response = await api.post('/users/me/upgrade-to-organizer');
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Nâng cấp tài khoản thất bại.';
  }
};
