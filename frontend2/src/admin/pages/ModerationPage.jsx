import React, { useEffect, useState } from 'react';
import { Search, Filter, Flag, CheckCircle, X, Eye, AlertTriangle, MessageSquare, Calendar, User } from 'lucide-react';
import './AdminPages.css';

// Mock data for initial UI development
const mockReports = [
  {
    id: '1',
    contentType: 'Event',
    reportedItem: { id: 'evt1', title: 'Pool Party - Summer Vibes', content: 'Join us for an amazing pool party with live music and drinks!' },
    reason: 'Spam or misleading content',
    reportedBy: { id: 'usr5', email: 'reporter1@example.com', name: 'John Doe' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    priority: 'High'
  },
  {
    id: '2',
    contentType: 'Post',
    reportedItem: { id: 'post1', title: 'Looking for a partner for the concert', content: 'Anyone want to go to the Taylor Swift concert with me?' },
    reason: 'Harassment or hate speech',
    reportedBy: { id: 'usr6', email: 'reporter2@example.com', name: 'Jane Smith' },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'Pending',
    priority: 'Medium'
  },
  {
    id: '3',
    contentType: 'Comment',
    reportedItem: { id: 'cmt1', content: 'This is an inappropriate comment with offensive language.' },
    reason: 'Inappropriate content',
    reportedBy: { id: 'usr7', email: 'reporter3@example.com', name: 'Mike Johnson' },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'Resolved',
    priority: 'Low'
  },
];

const ModerationPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // In a real scenario, you would fetch reports from the API
        // const response = await api.get('/admin/moderation/reports');
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
    const matchesSearch = report.reportedItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedItem.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContentType = contentTypeFilter === 'all' || report.contentType.toLowerCase() === contentTypeFilter;
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority.toLowerCase() === priorityFilter;
    
    return matchesSearch && matchesContentType && matchesStatus && matchesPriority;
  });

  const handleReportAction = (reportId, action) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'dismiss' ? 'Dismissed' : 'Resolved' }
        : report
    ));
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case 'Event': return <Calendar size={16} />;
      case 'Post': return <MessageSquare size={16} />;
      case 'Comment': return <MessageSquare size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#dc2626';
      case 'Medium': return '#d97706';
      case 'Low': return '#059669';
      default: return '#6b7280';
    }
  };

  if (loading) return <div className="ap-loading">Đang tải báo cáo...</div>;
  if (error) return <div className="ap-error">{error}</div>;

  return (
    <div className="ap-wrap">
      <div className="ap-toolbar">
        <div className="ap-toolbar__row">
          <h1 className="ap-title">Kiểm Duyệt Nội Dung</h1>
          <div className="ap-toolbar__actions">
            <button className="ap-btn ap-btn--outline">
              <Filter size={16} /> Xuất
            </button>
            <button className="ap-btn ap-btn--primary">
              <Flag size={16} /> Hành Động Hàng Loạt
            </button>
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card__header">
          <h3 className="ap-card__title">Báo Cáo ({filteredReports.length})</h3>
          <p className="ap-card__desc">Xem xét và kiểm duyệt nội dung được báo cáo</p>
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
              <label className="ap-filter-label">Loại Nội Dung</label>
              <select 
                className="ap-filter-select"
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
              >
                <option value="all">Tất Cả Loại</option>
                <option value="event">Sự Kiện</option>
                <option value="post">Bài Viết</option>
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
                <th>Nội Dung Báo Cáo</th>
                <th>Lý Do</th>
                <th>Người Báo Cáo</th>
                <th>Độ Ưu Tiên</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        {getContentIcon(report.contentType)}
                        <span className={`ap-badge ap-badge--${report.contentType.toLowerCase()}`}>
                          {report.contentType}
                        </span>
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--ink)', marginBottom: '0.25rem' }}>
                        {report.reportedItem.title || 'Comment'}
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
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {report.reportedBy.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {report.reportedBy.email}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {new Date(report.createdAt).toLocaleString()}
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
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="ap-btn ap-btn--outline ap-btn--sm">
                        <Eye size={14} />
                      </button>
                      {report.status === 'Pending' && (
                        <>
                          <button 
                            className="ap-btn ap-btn--success ap-btn--sm"
                            onClick={() => handleReportAction(report.id, 'resolve')}
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button 
                            className="ap-btn ap-btn--danger ap-btn--sm"
                            onClick={() => handleReportAction(report.id, 'dismiss')}
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

export default ModerationPage;
