import api from './api';

export const getEvents = async (params) => {
  try {
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not fetch events.';
  }
};

export const getEventById = async (id) => {
    try {
        const response = await api.get(`/events/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not fetch event details.';
    }
};

export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/events', eventData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not create event.';
    }
};

export const updateEvent = async (id, eventData) => {
    try {
        const response = await api.patch(`/events/${id}`, eventData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not update event.';
    }
};

export const deleteEvent = async (id) => {
    try {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not delete event.';
    }
};

export const toggleFavorite = async (id) => {
    try {
        const response = await api.post(`/events/${id}/favorite`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not toggle favorite status.';
    }
};