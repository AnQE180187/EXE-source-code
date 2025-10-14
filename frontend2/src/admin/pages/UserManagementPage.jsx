import React, { useEffect, useState } from 'react';
import { Search, Filter, UserCheck, UserX, Edit, MoreHorizontal } from 'lucide-react';
import api from '../../services/api';
import './AdminPages.css';

// Mock data for initial UI development
const mockUsers = [
  { id: '1', profile: { displayName: 'Admin User' }, email: 'admin@freeday.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
  { id: '2', profile: { displayName: 'Organizer User' }, email: 'organizer@freeday.com', role: 'Organizer', status: 'Active', joinDate: '2024-02-20' },
  { id: '3', profile: { displayName: 'Participant User' }, email: 'participant@freeday.com', role: 'Participant', status: 'Active', joinDate: '2024-03-10' },
  { id: '4', profile: { displayName: 'Banned User' }, email: 'banned@freeday.com', role: 'Participant', status: 'Banned', joinDate: '2024-01-05' },
  { id: '5', profile: { displayName: 'New User' }, email: 'newuser@freeday.com', role: 'Participant', status: 'Active', joinDate: '2024-12-01' },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real scenario, you would fetch users from the API
        // const response = await api.get('/admin/users');
        // setUsers(response.data);
        
        // Using mock data for now
        setUsers(mockUsers);

      } catch (err) {
        setError('Không thể tải danh sách người dùng.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.profile.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBanUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Banned' ? 'Active' : 'Banned' }
        : user
    ));
  };

  if (loading) return <div className="ap-loading">Đang tải người dùng...</div>;
  if (error) return <div className="ap-error">{error}</div>;

  return (
    <div className="ap-wrap">
      <div className="ap-toolbar">
        <div className="ap-toolbar__row">
          <h1 className="ap-title">Quản Lý Người Dùng</h1>
          <div className="ap-toolbar__actions">
            <button className="ap-btn ap-btn--outline">
              <Filter size={16} /> Xuất
            </button>
            <button className="ap-btn ap-btn--primary">
              <UserCheck size={16} /> Thêm Người Dùng
            </button>
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card__header">
          <h3 className="ap-card__title">Tất Cả Người Dùng ({filteredUsers.length})</h3>
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
                <option value="admin">Quản Trị</option>
                <option value="organizer">Người Tổ Chức</option>
                <option value="participant">Người Tham Gia</option>
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
                <option value="active">Hoạt Động</option>
                <option value="banned">Bị Cấm</option>
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
              {filteredUsers.map((user) => (
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
                        {user.profile.displayName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                          {user.profile.displayName}
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
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="ap-btn ap-btn--outline ap-btn--sm">
                        <Edit size={14} />
                      </button>
                      <button 
                        className={`ap-btn ap-btn--sm ${user.status === 'Banned' ? 'ap-btn--success' : 'ap-btn--danger'}`}
                        onClick={() => handleBanUser(user.id)}
                      >
                        {user.status === 'Banned' ? <UserCheck size={14} /> : <UserX size={14} />}
                      </button>
                      <button className="ap-btn ap-btn--outline ap-btn--sm">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <caption>Hiển thị {filteredUsers.length} trong {users.length} người dùng</caption>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
