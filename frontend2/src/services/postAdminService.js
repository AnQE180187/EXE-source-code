import api from './api';

/**
 * Fetches a paginated list of posts for the admin panel.
 * @param {object} params - The query parameters.
 * @param {number} params.page - The page number to fetch.
 * @param {number} params.limit - The number of items per page.
 * @param {string} [params.search] - Optional search term.
 * @param {string} [params.status] - Optional status to filter by (e.g., 'VISIBLE', 'HIDDEN').
 * @returns {Promise<object>} The response data with posts and pagination info.
 */
export const getAdminPosts = async (params) => {
  try {
    const response = await api.get('/admin/posts', { params });
    return response.data; // Assuming the API returns { data: [], total, page, limit }
  } catch (error) {
    console.error('Error fetching posts for admin:', error);
    throw error.response?.data?.message || 'Không thể tải danh sách bài viết.';
  }
};

/**
 * Updates the visibility status of a post.
 * @param {string} postId - The ID of the post to update.
 * @param {string} status - The new status for the post ('VISIBLE' or 'HIDDEN').
 * @returns {Promise<object>} The updated post data.
 */
export const updateAdminPostStatus = async (postId, status) => {
  try {
    const response = await api.patch(`/admin/posts/${postId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating post status:', error);
    throw error.response?.data?.message || 'Cập nhật trạng thái bài viết thất bại.';
  }
};

/**
 * Deletes a post as an administrator.
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<void>}
 */
export const deleteAdminPost = async (postId) => {
  try {
    await api.delete(`/admin/posts/${postId}`);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error.response?.data?.message || 'Xóa bài viết thất bại.';
  }
};

