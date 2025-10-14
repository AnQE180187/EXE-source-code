import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, X, Clock, Flag, AlertTriangle, User, MessageSquare, Calendar, FileText } from 'lucide-react';
import './AdminPages.css';

// Mock data for initial UI development
const mockReports = [
  {
    id: 'rep_001',
    type: 'USER',
    reportedItem: { 
      id: 'user_123', 
      title: 'John Doe', 
      content: 'User profile with inappropriate content',
      url: '/profile/user_123'
    },
    reason: 'Inappropriate profile content',
    description: 'User has uploaded inappropriate profile picture and bio content',
    reportedBy: { 
      id: 'user_456', 
      name: 'Jane Smith', 
      email: 'jane@example.com' 
    },
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    assignedTo: null,
    resolution: null
  },
  {
    id: 'rep_002',
    type: 'POST',
    reportedItem: { 
      id: 'post_789', 
      title: 'Spam Post in Tech Forum', 
      content: 'This is a spam post promoting fake products...',
      url: '/forum/post_789'
    },
    reason: 'Spam or misleading content',
    description: 'User is posting spam links and promoting fake products',
    reportedBy: { 
      id: 'user_789', 
      name: 'Mike Johnson', 
      email: 'mike@example.com' 
    },
    status: 'INVESTIGATING',
    priority: 'MEDIUM',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    assignedTo: { name: 'Admin User', email: 'admin@freeday.com' },
    resolution: null
  },
  {
    id: 'rep_003',
    type: 'EVENT',
    reportedItem: { 
      id: 'event_456', 
      title: 'Fake Music Concert', 
      content: 'Event details seem fraudulent with no venue confirmation',
      url: '/events/event_456'
    },
    reason: 'Fraudulent or misleading event',
    description: 'Event organizer cannot provide venue confirmation and ticket details seem fake',
    reportedBy: { 
      id: 'user_321', 
      name: 'Sarah Wilson', 
      email: 'sarah@example.com' 
    },
    status: 'RESOLVED',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    assignedTo: { name: 'Admin User', email: 'admin@freeday.com' },
    resolution: 'Event removed due to fraudulent information. Organizer account suspended.'
  },
  {
    id: 'rep_004',
    type: 'COMMENT',
    reportedItem: { 
      id: 'comment_654', 
      title: 'Offensive Comment', 
      content: 'This comment contains hate speech and offensive language...',
      url: '/events/event_123/comments/comment_654'
    },
    reason: 'Harassment or hate speech',
    description: 'Comment contains offensive language and personal attacks',
    reportedBy: { 
      id: 'user_987', 
      name: 'David Brown', 
      email: 'david@example.com' 
    },
    status: 'DISMISSED',
    priority: 'LOW',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    assignedTo: { name: 'Moderator User', email: 'moderator@freeday.com' },
    resolution: 'Comment reviewed and found to be within community guidelines.'
  },
  {
    id: 'rep_005',
    type: 'USER',
    reportedItem: { 
      id: 'user_999', 
      title: 'Suspicious Account', 
      content: 'Account appears to be impersonating a public figure',
      url: '/profile/user_999'
    },
    reason: 'Impersonation or fake account',
    description: 'User is claiming to be a celebrity and posting fake content',
    reportedBy: { 
      id: 'user_111', 
      name: 'Lisa Davis', 
      email: 'lisa@example.com' 
    },
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    assignedTo: null,
    resolution: null
  }
];

const ReportManagementPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // In a real scenario, you would fetch reports from the API
        // const response = await api.get('/admin/reports');
        // setReports(response.data);

        // Using mock data for now
        setReports(mockReports);

      } catch (err) {
        setError('Không thể tải danh sách báo cáo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportedItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type.toLowerCase() === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority.toLowerCase() === priorityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (reportId, newStatus) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: newStatus,
            updatedAt: new Date().toISOString()
          }
        : report
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} />;
      case 'INVESTIGATING': return <Eye size={16} />;
      case 'RESOLVED': return <CheckCircle size={16} />;
      case 'DISMISSED': return <X size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'USER': return <User size={16} />;
      case 'POST': return <MessageSquare size={16} />;
      case 'EVENT': return <Calendar size={16} />;
      case 'COMMENT': return <FileText size={16} />;
      default: return <Flag size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#dc2626';
      case 'MEDIUM': return '#d97706';
      case 'LOW': return '#059669';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Calculate statistics
  const pendingCount = reports.filter(r => r.status === 'PENDING').length;
  const investigatingCount = reports.filter(r => r.status === 'INVESTIGATING').length;
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length;
  const highPriorityCount = reports.filter(r => r.priority === 'HIGH').length;

  if (loading) return <div className="ap-loading">Đang tải báo cáo...</div>;
  if (error) return <div className="ap-error">{error}</div>;

  return (
    <div className="ap-wrap">
      <div className="ap-toolbar">
        <div className="ap-toolbar__row">
          <h1 className="ap-title">Quản Lý Báo Cáo</h1>
          <div className="ap-toolbar__actions">
            <button className="ap-btn ap-btn--outline">
              <Download size={16} /> Xuất
            </button>
            <button className="ap-btn ap-btn--primary">
              <Filter size={16} /> Hành Động Hàng Loạt
            </button>
          </div>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="ap-grid">
        <div className="ap-card">
          <div className="ap-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#92400e'
              }}>
                <Clock size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, fontWeight: '500' }}>
                  Báo Cáo Chờ Xử Lý
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--ink)', margin: '0.25rem 0', letterSpacing: '-.02em' }}>
                  {pendingCount}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#d97706', margin: 0 }}>
                  Chờ xem xét
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1e40af'
              }}>
                <Eye size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, fontWeight: '500' }}>
                  Đang Điều Tra
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--ink)', margin: '0.25rem 0', letterSpacing: '-.02em' }}>
                  {investigatingCount}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#1e40af', margin: 0 }}>
                  Đang được xem xét
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#065f46'
              }}>
                <CheckCircle size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, fontWeight: '500' }}>
                  Báo Cáo Đã Giải Quyết
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--ink)', margin: '0.25rem 0', letterSpacing: '-.02em' }}>
                  {resolvedCount}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#059669', margin: 0 }}>
                  Tháng này
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#991b1b'
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, fontWeight: '500' }}>
                  Độ Ưu Tiên Cao
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--ink)', margin: '0.25rem 0', letterSpacing: '-.02em' }}>
                  {highPriorityCount}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>
                  Cần chú ý khẩn cấp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card__header">
          <h3 className="ap-card__title">Tất Cả Báo Cáo ({filteredReports.length})</h3>
          <p className="ap-card__desc">Xem xét và quản lý báo cáo và khiếu nại của người dùng</p>
        </div>
        <div className="ap-card__body">
          <div className="ap-filters">
            <div className="ap-search">
              <Search size={16} className="ap-search__icon" />
              <input 
                placeholder="Tìm kiếm báo cáo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Loại</label>
              <select 
                className="ap-filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tất Cả Loại</option>
                <option value="user">Người Dùng</option>
                <option value="post">Bài Viết</option>
                <option value="event">Sự Kiện</option>
                <option value="comment">Bình Luận</option>
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
                <option value="pending">Chờ Xử Lý</option>
                <option value="investigating">Đang Điều Tra</option>
                <option value="resolved">Đã Giải Quyết</option>
                <option value="dismissed">Đã Bỏ Qua</option>
              </select>
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Độ Ưu Tiên</label>
              <select 
                className="ap-filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">Tất Cả Độ Ưu Tiên</option>
                <option value="high">Cao</option>
                <option value="medium">Trung Bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>

          <table className="ap-table">
            <thead>
              <tr>
                <th>Mục Báo Cáo</th>
                <th>Lý Do</th>
                <th>Người Báo Cáo</th>
                <th>Độ Ưu Tiên</th>
                <th>Trạng Thái</th>
                <th>Được Giao Cho</th>
                <th>Ngày</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        {getTypeIcon(report.type)}
                        <span className={`ap-badge ap-badge--${report.type.toLowerCase()}`}>
                          {report.type}
                        </span>
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--ink)', marginBottom: '0.25rem' }}>
                        {report.reportedItem.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {report.reportedItem.content}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                      {report.reason}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                      {report.description}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {report.reportedBy.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {report.reportedBy.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="ap-badge" 
                      style={{ 
                        backgroundColor: `${getPriorityColor(report.priority)}20`,
                        color: getPriorityColor(report.priority)
                      }}
                    >
                      {report.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`ap-badge ap-badge--${report.status.toLowerCase()}`}>
                      {getStatusIcon(report.status)}
                      {report.status}
                    </span>
                  </td>
                  <td>
                    {report.assignedTo ? (
                      <div>
                        <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                          {report.assignedTo.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          {report.assignedTo.email}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                        Chưa Giao
                      </span>
                    )}
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {formatDate(report.createdAt)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        Cập nhật: {formatDate(report.updatedAt)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="ap-btn ap-btn--outline ap-btn--sm">
                        <Eye size={14} />
                      </button>
                      {report.status === 'PENDING' && (
                        <>
                          <button 
                            className="ap-btn ap-btn--success ap-btn--sm"
                            onClick={() => handleStatusChange(report.id, 'INVESTIGATING')}
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="ap-btn ap-btn--danger ap-btn--sm"
                            onClick={() => handleStatusChange(report.id, 'DISMISSED')}
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      {report.status === 'INVESTIGATING' && (
                        <>
                          <button 
                            className="ap-btn ap-btn--success ap-btn--sm"
                            onClick={() => handleStatusChange(report.id, 'RESOLVED')}
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button 
                            className="ap-btn ap-btn--danger ap-btn--sm"
                            onClick={() => handleStatusChange(report.id, 'DISMISSED')}
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <caption>Hiển thị {filteredReports.length} trong {reports.length} báo cáo</caption>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportManagementPage;