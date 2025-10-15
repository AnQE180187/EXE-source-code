import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, EyeOff, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import './AdminPages.css';
import EventDetailModal from '../components/EventDetailModal';

const AdminEventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [totalEvents, setTotalEvents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit,
        });
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter !== 'all') params.append('status', statusFilter);

        const response = await api.get(`/admin/events?${params.toString()}`);
        setEvents(response.data.data);
        setTotalEvents(response.data.total);
      } catch (err) {
        setError('Không thể tải danh sách sự kiện.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchEvents();
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [currentPage, limit, searchTerm, statusFilter]);

  const handleStatusChange = async (eventId, newStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn đổi trạng thái sự kiện thành ${newStatus}?`)) {
      return;
    }

    const originalEvents = [...events];
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, status: newStatus }
        : event
    ));
    setError(null);
    setSuccess(null);
    try {
      await api.patch(`/admin/events/${eventId}/status`, {
        status:
          newStatus
      });
      setSuccess('Cập nhật trạng thái sự kiện thành công.');
    } catch (err) {
      setEvents(originalEvents);
      setError(`Lỗi khi cập nhật trạng thái sự kiện: ${err.message}`);
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PUBLISHED': return <CheckCircle size={16} />;
      case 'DRAFT': return <Clock size={16} />;
      case 'CANCELLED': return <X size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const totalPages = Math.ceil(totalEvents / limit);

  return (
    <div className="ap-wrap">
      <div className="ap-toolbar">
        <div className="ap-toolbar__row">
          <h1 className="ap-title">Quản Lý Sự Kiện</h1>
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
          <h3 className="ap-card__title">Tất Cả Sự Kiện ({totalEvents})</h3>
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
                <option value="PUBLISHED">Đã Xuất Bản</option>
                <option value="DRAFT">Bản Nháp</option>
                <option value="CANCELLED">Đã Hủy</option>
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
              {loading ? (
                <tr><td colSpan="6" className="ap-loading">Đang tải...</td></tr>
              ) : events.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--ink)', marginBottom: '0.25rem' }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {event.locationText}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {event.organizer.profile?.displayName || 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {event.organizer.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {new Date(event.startAt).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                      {event.registeredCount}
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
                      <button className="ap-btn ap-btn--outline ap-btn--sm" onClick={() => setSelectedEvent(event)}>
                        <Eye size={14} />
                      </button>
                      {event.status === 'PUBLISHED' ? (
                        <button
                          className="ap-btn ap-btn--outline ap-btn--sm"
                          onClick={() => handleStatusChange(event.id, 'DRAFT')}
                        >
                          <EyeOff size={14} />
                        </button>
                      ) : event.status === 'DRAFT' ? (
                        <button
                          className="ap-btn ap-btn--success ap-btn--sm"
                          onClick={() => handleStatusChange(event.id, 'PUBLISHED')}
                        >
                          <CheckCircle size={14} />
                        </button>
                      ) : null}
                      <button
                        className="ap-btn ap-btn--danger ap-btn--sm"
                        onClick={() => handleStatusChange(event.id, 'CANCELLED')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <caption>Hiển thị {events.length} trong {totalEvents} sự kiện</caption>
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
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default AdminEventManagementPage;
