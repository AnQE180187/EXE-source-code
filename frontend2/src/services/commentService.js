import api from './api';

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not fetch comments.';
  }
};

export const createComment = async (postId, commentData) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not create comment.';
  }
};
