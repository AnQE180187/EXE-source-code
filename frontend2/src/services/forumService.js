import api from './api';

export const getPosts = async (params = {}) => {
  try {
    const response = await api.get('/posts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not fetch posts.';
  }
};

export const getPostById = async (id) => {
    try {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not fetch post details.';
    }
};

export const createPost = async (postData) => {
    try {
        const response = await api.post('/posts', postData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not create post.';
    }
};

export const updatePost = async (id, postData) => {
    try {
        const response = await api.patch(`/posts/${id}`, postData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not update post.';
    }
};

export const deletePost = async (id) => {
    try {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Could not delete post.';
    }
};