import api from './api';

// Toggle favorite status for an event
export const toggleFavorite = async (eventId) => {
    try {
        const response = await api.post(`/events/${eventId}/favorite`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Không thể thay đổi trạng thái yêu thích';
        throw new Error(message);
    }
};

// Check if user has favorited an event
export const getFavoriteStatus = async (eventId) => {
    try {
        const response = await api.get(`/events/${eventId}/favorite`);
        return response.data;
    } catch {
        // If 404 or other error, assume not favorited
        return { isFavorited: false };
    }
};

// Get all favorite events for current user
export const getFavoriteEvents = async () => {
    try {
        const response = await api.get('/favorites');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Không thể tải danh sách yêu thích';
        throw new Error(message);
    }
};