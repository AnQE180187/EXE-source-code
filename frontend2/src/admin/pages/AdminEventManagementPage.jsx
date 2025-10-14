import React, { useEffect, useState } from 'react';
import { Search, Filter, Calendar, Eye, EyeOff, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import './AdminPages.css';

// Mock data for initial UI development
const mockEvents = [
  {
    id: 'evt_1',
    title: 'Summer Music Festival',
    organizer: { email: 'organizer@freeday.com', name: 'Music Events Co.' },
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Published',
    participants: 150,
    location: 'Central Park',
    category: 'Music'
  },
  {
    id: 'evt_2',
    title: 'Tech Conference 2025',
    organizer: { email: 'techcorp@example.com', name: 'Tech Corp' },
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Published',
    participants: 300,
    location: 'Convention Center',
    category: 'Technology'
  },
  {
    id: 'evt_3',
    title: 'Local Charity Run - Draft',
    organizer: { email: 'charity@example.com', name: 'Charity Foundation' },
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Draft',
    participants: 0,
    location: 'City Stadium',
    category: 'Sports'
  },
  {
    id: 'evt_4',
    title: 'Cancelled Concert',
    organizer: { email: 'musicgroup@example.com', name: 'Music Group' },
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Cancelled',
    participants: 0,
    location: 'Arena',
    category: 'Music'
  },
];

const AdminEventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real scenario, you would fetch all events from an admin API endpoint
        // const response = await api.get('/admin/events');
        // setEvents(response.data);

        // Using mock data for now
        setEvents(mockEvents);

      } catch (err) {
        setError('Không thể tải danh sách sự kiện.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || event.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (eventId, newStatus) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: newStatus }
        : event
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Published': return <CheckCircle size={16} />;
      case 'Draft': return <Clock size={16} />;
      case 'Cancelled': return <X size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) return <div className="ap-loading">Đang tải sự kiện...</div>;
  if (error) return <div className="ap-error">{error}</div>;

  return (
    <div className="ap-wrap">
      <div className="ap-toolbar">
        <div className="ap-toolbar__row">
          <h1 className="ap-title">Quản Lý Sự Kiện</h1>
          <div className="ap-toolbar__actions">
            <button className="ap-btn ap-btn--outline">
              <Filter size={16} /> Xuất
            </button>
            <button className="ap-btn ap-btn--primary">
              <Calendar size={16} /> Tạo Sự Kiện
            </button>
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card__header">
          <h3 className="ap-card__title">Tất Cả Sự Kiện ({filteredEvents.length})</h3>
          <p className="ap-card__desc">Quản lý và kiểm duyệt tất cả sự kiện trên nền tảng</p>
        </div>
        <div className="ap-card__body">
          <div className="ap-filters">
            <div className="ap-search">
              <Search size={16} className="ap-search__icon" />
              <input 
                placeholder="Tìm kiếm sự kiện..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Trạng Thái</label>
              <select 
                className="ap-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất Cả Trạng Thái</option>
                <option value="published">Đã Xuất Bản</option>
                <option value="draft">Bản Nháp</option>
                <option value="cancelled">Đã Hủy</option>
              </select>
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Danh Mục</label>
              <select 
                className="ap-filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Tất Cả Danh Mục</option>
                <option value="music">Âm Nhạc</option>
                <option value="technology">Công Nghệ</option>
                <option value="sports">Thể Thao</option>
                <option value="education">Giáo Dục</option>
              </select>
            </div>
          </div>

          <table className="ap-table">
            <thead>
              <tr>
                <th>Sự Kiện</th>
                <th>Người Tổ Chức</th>
                <th>Ngày & Giờ</th>
                <th>Người Tham Gia</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--ink)', marginBottom: '0.25rem' }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {event.category} • {event.location}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {event.organizer.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {event.organizer.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                      {event.participants}
                    </div>
                  </td>
                  <td>
                    <span className={`ap-badge ap-badge--${event.status.toLowerCase()}`}>
                      {getStatusIcon(event.status)}
                      {event.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="ap-btn ap-btn--outline ap-btn--sm">
                        <Eye size={14} />
                      </button>
                      {event.status === 'Published' ? (
                        <button 
                          className="ap-btn ap-btn--outline ap-btn--sm"
                          onClick={() => handleStatusChange(event.id, 'Draft')}
                        >
                          <EyeOff size={14} />
                        </button>
                      ) : event.status === 'Draft' ? (
                        <button 
                          className="ap-btn ap-btn--success ap-btn--sm"
                          onClick={() => handleStatusChange(event.id, 'Published')}
                        >
                          <CheckCircle size={14} />
                        </button>
                      ) : null}
                      <button 
                        className="ap-btn ap-btn--danger ap-btn--sm"
                        onClick={() => handleStatusChange(event.id, 'Cancelled')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <caption>Hiển thị {filteredEvents.length} trong {events.length} sự kiện</caption>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEventManagementPage;
