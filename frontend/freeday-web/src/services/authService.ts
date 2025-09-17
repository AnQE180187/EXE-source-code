
import api from './api';
import type { RegisterUserDto, LoginUserDto } from '@/types/auth';

export const authService = {
  register: (data: RegisterUserDto) => {
    return api.post('/auth/register', data);
  },

  login: (data: LoginUserDto) => {
    return api.post('/auth/login', data);
  },
};
