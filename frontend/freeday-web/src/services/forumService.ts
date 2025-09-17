import api from './api';

// We can define proper types for Post and Comment data later

export const forumService = {
  getPosts: (params?: any) => {
    return api.get('/posts', { params });
  },

  getPostById: (postId: string) => {
    return api.get(`/posts/${postId}`);
  },

  createPost: (data: { title: string; content: string; tagIds?: string[] }) => {
    return api.post('/posts', data);
  },

  getCommentsByPostId: (postId: string) => {
    return api.get(`/posts/${postId}/comments`);
  },

  createComment: (postId: string, data: { content: string }) => {
    return api.post(`/posts/${postId}/comments`, data);
  },
};
