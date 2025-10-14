import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { getRegistrationStatus } from '../services/registrationService';
import { getProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import './TicketPage.css';

const TicketPage = () => {
  const { id: eventId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const [eventData, regStatus, profileData] = await Promise.all([
          getEventById(eventId),
          getRegistrationStatus(eventId),
          getProfile()
        ]);

        if (!regStatus.isRegistered || regStatus.status !== 'DEPOSITED') {
          navigate(`/events/${eventId}`);
          return;
        }

        setEvent(eventData);
        setRegistrationStatus(regStatus);
        setUserProfile(profileData);
      } catch {
        setError('Không thể tải thông tin vé.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, isAuthenticated, navigate]);

  if (loading) return <div className="loading-message">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event || !registrationStatus || !userProfile) return <div className="error-message">Không tìm thấy thông tin vé.</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Calculate deposit amount (30% of event price)
  const depositAmount = Math.round(event.price);

  return (
    <div className="ticket-page">
      <div className="ticket-container">
        <div className="ticket-header">
          <h1 className="ticket-title">Vé Đặt Chỗ Sự Kiện</h1>
        </div>

        <div className="ticket-content">
          {/* Event Info Section */}
          <div className="event-info-section">
            <h2 className="event-name">{event.title}</h2>
            <div className="event-details">
              <div className="detail-row">
                <span className="detail-label">Thời gian:</span>
                <span className="detail-value">{formatTime(event.startAt)} - {formatDate(event.startAt)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Địa điểm:</span>
                <span className="detail-value">{event.locationText}</span>
              </div>
            </div>
          </div>

          {/* Combined Info Section */}
          <div className="combined-info-section">
            <div className="deposit-info">
              <div className="deposit-amount">
                <span className="deposit-label">Số tiền đã đặt cọc:</span>
                <span className="deposit-value">{formatCurrency(depositAmount)}</span>
              </div>
              <div className="deposit-date">
                <span className="date-label">Ngày đặt:</span>
                <span className="date-value">{formatDate(registrationStatus.registeredAt)}</span>
              </div>
            </div>

            <div className="customer-info">
              <div className="info-row">
                <span className="info-label">Người đặt:</span>
                <span className="info-value">{userProfile.profile?.displayName || userProfile.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{userProfile.email}</span>
              </div>
              {userProfile.profile?.phone && (
                <div className="info-row">
                  <span className="info-label">SĐT:</span>
                  <span className="info-value">{userProfile.profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="ticket-actions">
            <Link
              to={`/events/${eventId}`}
              className="button button--primary"
            >
              Xem chi tiết sự kiện
            </Link>
          </div>

          {/* Compact Notes */}
          <div className="ticket-notes">
            <p><strong>Lưu ý:</strong> Số tiền cọc sẽ được trừ vào tổng giá vé khi thanh toán tại sự kiện. Liên hệ ban tổ chức nếu có thắc mắc.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;