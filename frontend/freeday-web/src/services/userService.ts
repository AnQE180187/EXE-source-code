import api from './api';
import type { UpdateProfileDto } from '@/types/profile';

export const userService = {
  getProfile: () => {
    return api.get('/users/me');
  },
  updateProfile: (data: UpdateProfileDto) => {
    return api.put('/users/me', data);
  },
  upgradeToOrganizer: () => {
    return api.post('/users/me/upgrade-to-organizer');
  },
};
