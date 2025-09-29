import api from './api';

export const getRegistrationStatus = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/registration`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể kiểm tra trạng thái đăng ký.';
  }
};

export const createRegistration = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/registration`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Đăng ký sự kiện thất bại.';
  }
};

export const cancelRegistration = async (eventId) => {
    try {
        const response = await api.delete(`/events/${eventId}/registration`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Hủy đăng ký thất bại.';
    }
};

export const getRegistrationsForEvent = async (eventId) => {
    try {
        const response = await api.get(`/events/${eventId}/registrations`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Không thể tải danh sách người tham gia.';
    }
};

export const confirmDeposit = async (eventId) => {
    try {
        const response = await api.post(`/events/${eventId}/registration/confirm-deposit`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Xác nhận đặt cọc thất bại.';
    }
};
