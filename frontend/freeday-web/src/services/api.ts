import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { UpdateProfileDto, UserProfile, UserEvents } from '@/types/profile';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from the Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access by calling the logout action from the store
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    // Log error details for debugging
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const eventsAPI = {
  getAll: (params?: any) => api.get('/events', { params }),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.patch(`/events/${id}`, data),
  updateStatus: (id: string, data: { status: string }) => api.patch(`/events/${id}/status`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

export const forumAPI = {
  getPosts: (params?: any) => api.get('/forum/posts', { params }),
  getPost: (id: string) => api.get(`/forum/posts/${id}`),
  createPost: (data: any) => api.post('/forum/posts', data),
  getComments: (postId: string) => api.get(`/forum/posts/${postId}/comments`),
  createComment: (postId: string, data: any) =>
    api.post(`/forum/posts/${postId}/comments`, data),
};

export const userAPI = {
  getProfile: () => api.get<{ data: UserProfile }>('/users/me'),
  updateProfile: (data: UpdateProfileDto) => api.put<{ data: UserProfile }>('/users/me', data),
  getEvents: () => api.get<{ data: UserEvents }>('/users/me/events'),
  upgradeToOrganizer: () => api.post<{ data: UserProfile }>('/users/me/upgrade-to-organizer'),
};

export default api; 