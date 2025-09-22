import React, { useEffect, useState } from 'react';
import { getMyEvents } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, Heart, MapPin, Tag, Ticket } from 'lucide-react';
import './MyEventsPage.css';

const EventCard = ({ event }) => {
  const { status, title, startAt, locationText, imageUrl, id, price } = event;

  const statusInfo = {
    PUBLISHED: { text: 'Đang diễn ra', className: 'published' },
    CLOSED: { text: 'Đã đóng', className: 'closed' },
    CANCELLED: { text: 'Đã hủy', className: 'cancelled' },
    DRAFT: { text: 'Bản nháp', className: 'draft' },
  };

  return (
    <Link to={`/events/${id}`} className="me-event-card">
      <div className="me-card-image-wrapper">
        <img src={imageUrl || 'https://via.placeholder.com/400x225?text=FreeDay'} alt={title} className="me-card-image" />
        <div className={`me-card-status-badge ${statusInfo[status]?.className || ''}`}>
          {statusInfo[status]?.text || status}
        </div>
      </div>
      <div className="me-card-content">
        <h3 className="me-card-title">{title}</h3>
        <div className="me-card-info">
          <span className="me-card-info-item">
            <Calendar size={14} />
            {new Date(startAt).toLocaleDateString('vi-VN')}
          </span>
          <span className="me-card-info-item">
            <MapPin size={14} />
            {locationText}
          </span>
        </div>
      </div>
      <div className="me-card-footer">
        <span className="me-card-price">
            {price > 0 ? `${price.toLocaleString('vi-VN')} VND` : 'Miễn phí'}
        </span>
        <button className="me-card-action-btn">Xem chi tiết</button>
      </div>
    </Link>
  );
};

const MyEventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState({ registered: [], favorited: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('registered');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        const data = await getMyEvents();
        setEvents({ registered: data.registered || [], favorited: data.favorited || [] });
      } catch (err) {
        setError('Không thể tải dữ liệu sự kiện của bạn.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  const renderContent = () => {
    if (loading) return <p className="me-message">Đang tải danh sách sự kiện...</p>;
    if (error) return <p className="me-message me-message--error">{error}</p>;
    
    const eventList = events[activeTab] || [];

    if (eventList.length === 0) {
      return <p className="me-message">Bạn chưa có sự kiện nào trong mục này.</p>;
    }

    return (
      <div className="me-grid">
        {eventList.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <div className="me-header">
        <h1>Sự kiện của tôi</h1>
        <p>Tất cả các sự kiện bạn đã đăng ký hoặc quan tâm.</p>
      </div>
      <div className="me-tabs">
        <button 
          className={`me-tab-trigger ${activeTab === 'registered' ? 'active' : ''}`}
          onClick={() => setActiveTab('registered')}
        >
          <Ticket size={18} /> Đã đăng ký ({events.registered.length})
        </button>
        <button 
          className={`me-tab-trigger ${activeTab === 'favorited' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorited')}
        >
          <Heart size={18} /> Đã yêu thích ({events.favorited.length})
        </button>
      </div>
      <div className="me-tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default MyEventsPage;
