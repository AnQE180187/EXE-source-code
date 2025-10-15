import React, { useEffect, useState } from 'react';
import { Search, Filter, UserCheck, UserX, Edit, MoreHorizontal } from 'lucide-react';
import api from '../../services/api';
import UpdateRoleModal from '../components/user/UpdateRoleModal';
import './AdminPages.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit,
        });
        if (searchTerm) params.append('search', searchTerm);
        if (roleFilter !== 'all') params.append('role', roleFilter);
        if (statusFilter !== 'all') params.append('status', statusFilter);

        const response = await api.get(`/admin/users?${params.toString()}`);
        setUsers(response.data.data);
        setTotalUsers(response.data.total);
      } catch (err) {
        setError('Không thể tải danh sách người dùng.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
        fetchUsers();
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [currentPage, limit, searchTerm, roleFilter, statusFilter]);

  const handleBanUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
    if (!window.confirm(`Bạn có chắc chắn muốn đổi trạng thái người dùng thành ${newStatus}?`)) {
      return;
    }

    const originalUsers = [...users];
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    setError(null);
    setSuccess(null);

    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      setSuccess('Cập nhật trạng thái người dùng thành công.');
    } catch (err) {
      setUsers(originalUsers);
      setError(`Lỗi khi cập nhật trạng thái người dùng: ${err.message}`);
      console.error(err);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleRoleUpdated = (userId, newRole) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="ap-wrap">
      <div className="ap-toolbar">
        <div className="ap-toolbar__row">
          <h1 className="ap-title">Quản Lý Người Dùng</h1>
          <div className="ap-toolbar__actions">
            <button className="ap-btn ap-btn--outline">
              <Filter size={16} /> Xuất
            </button>
          </div>
        </div>
      </div>

      {error && <div className="ap-error">{error}</div>}
      {success && <div className="ap-success">{success}</div>}

      <div className="ap-card">
        <div className="ap-card__header">
          <h3 className="ap-card__title">Tất Cả Người Dùng ({totalUsers})</h3>
          <p className="ap-card__desc">Quản lý tài khoản người dùng, vai trò và quyền hạn</p>
        </div>
        <div className="ap-card__body">
          <div className="ap-filters">
            <div className="ap-search">
              <Search size={16} className="ap-search__icon" />
              <input 
                placeholder="Tìm kiếm người dùng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Vai Trò</label>
              <select 
                className="ap-filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tất Cả Vai Trò</option>
                <option value="ADMIN">Quản Trị</option>
                <option value="ORGANIZER">Người Tổ Chức</option>
                <option value="PARTICIPANT">Người Tham Gia</option>
              </select>
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Trạng Thái</label>
              <select 
                className="ap-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất Cả Trạng Thái</option>
                <option value="ACTIVE">Hoạt Động</option>
                <option value="BANNED">Bị Cấm</option>
              </select>
            </div>
          </div>

          <table className="ap-table">
            <thead>
              <tr>
                <th>Người Dùng</th>
                <th>Email</th>
                <th>Vai Trò</th>
                <th>Trạng Thái</th>
                <th>Ngày Tham Gia</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="ap-loading">Đang tải...</td></tr>
              ) : users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontWeight: '600'
                      }}>
                        {user.profile?.displayName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                          {user.profile?.displayName || 'N/A'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`ap-badge ap-badge--${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`ap-badge ap-badge--${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="ap-btn ap-btn--outline ap-btn--sm" onClick={() => openModal(user)}>
                        <Edit size={14} />
                      </button>
                      <button 
                        className={`ap-btn ap-btn--sm ${user.status === 'BANNED' ? 'ap-btn--success' : 'ap-btn--danger'}`}
                        onClick={() => handleBanUser(user.id, user.status)}
                      >
                        {user.status === 'BANNED' ? <UserCheck size={14} /> : <UserX size={14} />}
                      </button>
                      <button className="ap-btn ap-btn--outline ap-btn--sm">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <caption>Hiển thị {users.length} trong {totalUsers} người dùng</caption>
          </table>

          <div className="ap-pagination">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="ap-btn"
            >
              Trước
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ap-btn"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <UpdateRoleModal 
          user={selectedUser} 
          onClose={closeModal} 
          onRoleUpdated={handleRoleUpdated} 
        />
      )}
    </div>
  );
};

export default UserManagementPage;
