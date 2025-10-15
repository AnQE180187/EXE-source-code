import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = () => adminApi.get('/users');

export const updateUserRole = (userId, role) => {
  return adminApi.patch(`/users/${userId}/role`, { role });
};

export const updateUserStatus = (userId, status) => {
  return adminApi.patch(`/users/${userId}/status`, { status });
};
