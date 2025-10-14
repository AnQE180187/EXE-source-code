import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Eye, User, Calendar, Shield, Settings, AlertCircle } from 'lucide-react';
import './AdminPages.css';

// Mock data for initial UI development
const mockAuditLogs = [
  {
    id: '1',
    action: 'User Login',
    user: { name: 'Admin User', email: 'admin@freeday.com' },
    resource: 'Authentication',
    details: 'Successful login from IP 192.168.1.1',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    severity: 'Info',
    ipAddress: '192.168.1.1'
  },
  {
    id: '2',
    action: 'Event Created',
    user: { name: 'Organizer User', email: 'organizer@freeday.com' },
    resource: 'Event Management',
    details: 'Created event "Summer Music Festival"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'Info',
    ipAddress: '192.168.1.2'
  },
  {
    id: '3',
    action: 'User Banned',
    user: { name: 'Admin User', email: 'admin@freeday.com' },
    resource: 'User Management',
    details: 'Banned user "banned@freeday.com" for policy violation',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    severity: 'Warning',
    ipAddress: '192.168.1.1'
  },
  {
    id: '4',
    action: 'Failed Login Attempt',
    user: { name: 'Unknown', email: 'hacker@example.com' },
    resource: 'Authentication',
    details: 'Multiple failed login attempts detected',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    severity: 'Error',
    ipAddress: '192.168.1.100'
  },
  {
    id: '5',
    action: 'Settings Updated',
    user: { name: 'Admin User', email: 'admin@freeday.com' },
    resource: 'System Settings',
    details: 'Updated email notification settings',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    severity: 'Info',
    ipAddress: '192.168.1.1'
  },
];

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // In a real scenario, you would fetch audit logs from the API
        // const response = await api.get('/admin/audit-logs');
        // setLogs(response.data);

        // Using mock data for now
        setLogs(mockAuditLogs);

      } catch (err) {
        setError('Không thể tải nhật ký kiểm tra.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter);
    const matchesSeverity = severityFilter === 'all' || log.severity.toLowerCase() === severityFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const diffHours = (now - logDate) / (1000 * 60 * 60);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = diffHours < 24;
          break;
        case 'week':
          matchesDate = diffHours < 168; // 7 days
          break;
        case 'month':
          matchesDate = diffHours < 720; // 30 days
          break;
      }
    }
    
    return matchesSearch && matchesAction && matchesSeverity && matchesDate;
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Error': return <AlertCircle size={16} />;
      case 'Warning': return <AlertCircle size={16} />;
      case 'Info': return <Shield size={16} />;
      default: return <Shield size={16} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Error': return '#dc2626';
      case 'Warning': return '#d97706';
      case 'Info': return '#059669';
      default: return '#6b7280';
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('Login')) return <User size={16} />;
    if (action.includes('Event')) return <Calendar size={16} />;
    if (action.includes('Settings')) return <Settings size={16} />;
    return <Shield size={16} />;
  };

  if (loading) return <div className="ap-loading">Đang tải nhật ký kiểm tra...</div>;
  if (error) return <div className="ap-error">{error}</div>;

  return (
    <div className="ap-wrap">
      <div className="ap-toolbar">
        <div className="ap-toolbar__row">
          <h1 className="ap-title">Nhật Ký Kiểm Tra</h1>
          <div className="ap-toolbar__actions">
            <button className="ap-btn ap-btn--outline">
              <Download size={16} /> Xuất
            </button>
            <button className="ap-btn ap-btn--primary">
              <Filter size={16} /> Bộ Lọc Nâng Cao
            </button>
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card__header">
          <h3 className="ap-card__title">Hoạt Động Hệ Thống ({filteredLogs.length})</h3>
          <p className="ap-card__desc">Theo dõi tất cả hoạt động hệ thống và hành động của người dùng</p>
        </div>
        <div className="ap-card__body">
          <div className="ap-filters">
            <div className="ap-search">
              <Search size={16} className="ap-search__icon" />
              <input 
                placeholder="Tìm kiếm nhật ký..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Hành Động</label>
              <select 
                className="ap-filter-select"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="all">Tất Cả Hành Động</option>
                <option value="login">Đăng Nhập</option>
                <option value="event">Sự Kiện</option>
                <option value="user">Người Dùng</option>
                <option value="settings">Cài Đặt</option>
              </select>
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Mức Độ</label>
              <select 
                className="ap-filter-select"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="all">Tất Cả Mức Độ</option>
                <option value="error">Lỗi</option>
                <option value="warning">Cảnh Báo</option>
                <option value="info">Thông Tin</option>
              </select>
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Khoảng Thời Gian</label>
              <select 
                className="ap-filter-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Tất Cả Thời Gian</option>
                <option value="today">Hôm Nay</option>
                <option value="week">Tuần Này</option>
                <option value="month">Tháng Này</option>
              </select>
            </div>
          </div>

          <table className="ap-table">
            <thead>
              <tr>
                <th>Hành Động</th>
                <th>Người Dùng</th>
                <th>Chi Tiết</th>
                <th>Mức Độ</th>
                <th>Thời Gian</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getActionIcon(log.action)}
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                          {log.action}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          {log.resource}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {log.user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {log.user.email}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        IP: {log.ipAddress}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.details}
                    </div>
                  </td>
                  <td>
                    <span 
                      className="ap-badge" 
                      style={{ 
                        backgroundColor: `${getSeverityColor(log.severity)}20`,
                        color: getSeverityColor(log.severity),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {getSeverityIcon(log.severity)}
                      {log.severity}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </td>
                  <td>
                    <button className="ap-btn ap-btn--outline ap-btn--sm">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <caption>Hiển thị {filteredLogs.length} trong {logs.length} nhật ký kiểm tra</caption>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
