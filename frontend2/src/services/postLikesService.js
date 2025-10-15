import api from './api';

export const togglePostLike = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not toggle like.';
  }
};
