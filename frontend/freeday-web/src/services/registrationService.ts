import api from './api';

export const registrationService = {
  registerForEvent: (eventId: string) => {
    return api.post(`/events/${eventId}/registration`);
  },

  cancelRegistration: (eventId: string) => {
    return api.delete(`/events/${eventId}/registration`);
  },
};
