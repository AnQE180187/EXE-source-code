import api from './api';

// --- User Management ---

/**
 * Fetches a paginated list of users for the admin panel.
 * @param {object} params - The query parameters.
 * @param {number} params.page - The page number to fetch.
 * @param {number} params.limit - The number of items per page.
 * @returns {Promise<object>} The response data with users and pagination info.
 */
export const getUsers = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    });
    return response.data; // { data: [], total, page, limit }
  } catch (error) {
    throw error.response?.data?.message || 'Không thể tải danh sách người dùng.';
  }
};

/**
 * Updates the status of a user.
 * @param {string} userId - The ID of the user to update.
 * @param {string} status - The new status for the user (e.g., 'ACTIVE', 'BANNED').
 * @returns {Promise<object>} The updated user data.
 */
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Cập nhật trạng thái người dùng thất bại.';
  }
};

/**
 * Updates the role of a user.
 * @param {string} userId - The ID of the user to update.
 * @param {string} role - The new role for the user (e.g., 'ADMIN', 'ORGANIZER').
 * @returns {Promise<object>} The updated user data.
 */
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Cập nhật vai trò người dùng thất bại.';
  }
};


// --- Financial Management ---

export const getWithdrawals = (status) => {
  return api.get('/admin/withdrawals', { params: { status } });
};

export const approveWithdrawal = (id) => {
  return api.patch(`/admin/withdrawals/${id}/approve`);
};

export const rejectWithdrawal = (id) => {
  return api.patch(`/admin/withdrawals/${id}/reject`);
};

export const getAllWallets = () => {
  return api.get('/admin/wallets');
};

// --- Dashboard --- 

/**
 * Fetches the statistics for the admin dashboard.
 * @returns {Promise<object>} The dashboard statistics.
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể tải dữ liệu dashboard.';
  }
};

/**
 * Fetches revenue data for the dashboard chart.
 * @param {'7d' | '30d' | '12m'} period - The time period for the data.
 * @returns {Promise<Array<{date: string, revenue: number}>>} The chart data.
 */
export const getRevenueChartData = async (period) => {
  try {
    const response = await api.get('/admin/dashboard/revenue-chart', { params: { period } });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Không thể tải dữ liệu biểu đồ.';
  }
};
