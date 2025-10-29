import React, { useEffect, useState, useCallback } from 'react';
import { getEventById } from '../../services/eventService';
import { getRegistrationsForEvent } from '../../services/registrationService';
import { X, Calendar, MapPin, Tag, DollarSign, Users, Heart, User, Info } from 'lucide-react';
import './EventDetailModal.css';

const EventDetailModal = ({ event: initialEvent, onClose }) => {
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEventDetails = useCallback(async () => {
    if (!initialEvent?.id) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch full event details and registrations in parallel
      const [eventData, registrationData] = await Promise.all([
        getEventById(initialEvent.id),
        getRegistrationsForEvent(initialEvent.id)
      ]);
      setEvent(eventData);
      setRegistrations(registrationData || []);
    } catch (err) {
      setError('Không thể tải chi tiết sự kiện.');
      console.error('Fetch Details Error:', err);
    } finally {
      setLoading(false);
    }
  }, [initialEvent?.id]);

  useEffect(() => {
    if (initialEvent) {
      fetchEventDetails();
    } else {
      // Reset state when modal is closed
      setEvent(null);
      setRegistrations([]);
    }
  }, [initialEvent, fetchEventDetails]);

  if (!initialEvent) return null;

  const statusBadge = (status) => {
    const statusClasses = {
      PUBLISHED: 'badge--published',
      DRAFT: 'badge--draft',
      CANCELLED: 'badge--cancelled',
      CLOSED: 'badge--closed',
    };
    return <span className={`badge ${statusClasses[status] || 'badge--default'}`}>{status}</span>;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container event-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi Tiết Sự Kiện</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={24} /></button>
        </div>
        <div className="modal-content">
          {loading ? (
            <div className="loading-indicator"><p>Đang tải chi tiết sự kiện...</p></div>
          ) : error ? (
            <div className="error-indicator"><p>{error}</p></div>
          ) : event ? (
            <div className="event-details-layout">
              {/* Left Column */}
              <div className="event-details-left">
                <img src={event.imageUrl || 'https://via.placeholder.com/400x250?text=Freeday'} alt={event.title} className="event-detail-image" />
                
                <h3 className="info-title">Thông tin chính</h3>
                <ul className="info-list">
                  <li><User size={16} /><strong>Người tổ chức:</strong> {event.organizer?.profile?.displayName || 'N/A'}</li>
                  <li><Calendar size={16} /><strong>Bắt đầu:</strong> {new Date(event.startAt).toLocaleString('vi-VN')}</li>
                  <li><Calendar size={16} /><strong>Kết thúc:</strong> {new Date(event.endAt).toLocaleString('vi-VN')}</li>
                  <li><MapPin size={16} /><strong>Địa điểm:</strong> {event.locationText}</li>
                  <li>
                    <Tag size={16} /><strong>Thể loại:</strong> 
                    {event.tags?.length > 0 ? event.tags.map(t => <span key={t.tag.id} className="tag-badge">{t.tag.name}</span>) : 'Không có'}
                  </li>
                  <li><DollarSign size={16} /><strong>Giá vé:</strong> {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}</li>
                </ul>

                <h3 className="info-title">Thống kê</h3>
                <ul className="info-list">
                  <li><Users size={16} /><strong>Đăng ký:</strong> {event._count?.registrations || 0} / {event.capacity > 0 ? event.capacity : '∞'}</li>
                  <li><Heart size={16} /><strong>Yêu thích:</strong> {event._count?.favorites || 0}</li>
                </ul>
              </div>

              {/* Right Column */}
              <div className="event-details-right">
                <div className="event-title-section">
                    <h1>{event.title}</h1>
                    {statusBadge(event.status)}
                </div>

                <h3 className="info-title">Mô tả sự kiện</h3>
                <p className="event-description">{event.description}</p>

                <h3 className="info-title">Người tham gia ({registrations.length})</h3>
                <div className="participants-list-wrapper">
                  {registrations.length > 0 ? (
                    <ul className="participants-list">
                      {registrations.map(reg => (
                        <li key={reg.id} className="participant-item">
                          <img src={reg.user.profile?.avatarUrl || 'https://via.placeholder.com/40'} alt="avatar" />
                          <div className="participant-info">
                            <strong>{reg.user.profile?.displayName || 'N/A'}</strong>
                            <span>{reg.user.email}</span>
                          </div>
                          <span className={`reg-status-badge reg-status--${reg.status.toLowerCase()}`}>{reg.status}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="no-data-placeholder">
                      <Info size={20} />
                      <p>Chưa có ai đăng ký sự kiện này.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-data-placeholder"><p>Không có dữ liệu để hiển thị.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
