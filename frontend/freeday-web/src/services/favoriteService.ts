import api from './api';

export const favoriteService = {
  toggleFavorite: (eventId: string) => {
    return api.post(`/events/${eventId}/favorite`);
  },
};
