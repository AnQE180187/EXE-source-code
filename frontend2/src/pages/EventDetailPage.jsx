import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, Calendar, Clock, MapPin, Tag, X } from 'lucide-react';
import { getEventById, deleteEvent, updateEvent } from '../services/eventService';
import { createRegistration, getRegistrationStatus, cancelRegistration, initiateDeposit } from '../services/registrationService';
import { toggleFavorite, getFavoriteStatus } from '../services/favoritesService';
import { findOrCreateConversation } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import EventModal from './EventModal';
import DepositModal from './DepositModal';
import './EventDetailPage.css';
import MapEmbed from '../components/MapEmbed';

const EventDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // State for deposit flow
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await getEventById(id);
      setEvent(eventData);
    } catch (err) {
      setError('Không thể tải thông tin sự kiện. Có thể sự kiện không tồn tại hoặc đã bị xóa.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRegistrationStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setRegistrationStatus(null);
      return;
    }
    try {
      const status = await getRegistrationStatus(id);
      setRegistrationStatus(status);
    } catch {
      setRegistrationStatus({ isRegistered: false, status: null });
    }
  }, [id, isAuthenticated]);

  const fetchFavoriteStatus = useCallback(async () => {
    if (!isAuthenticated) {
      setIsFavorited(false);
      return;
    }
    try {
      const status = await getFavoriteStatus(id);
      setIsFavorited(status.isFavorited || false);
    } catch {
      setIsFavorited(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchEvent();
    fetchRegistrationStatus();
    fetchFavoriteStatus();
  }, [fetchEvent, fetchRegistrationStatus, fetchFavoriteStatus]);

  const handleRegistration = async () => {
    if (!isAuthenticated) return navigate(`/login?redirect=/events/${id}`);
    try {
      setLoadingRegistration(true);
      await createRegistration(id);
      alert('Đăng ký thành công!');
      await Promise.all([fetchEvent(), fetchRegistrationStatus()]);
    } catch (error) {
      alert(error);
    } finally {
      setLoadingRegistration(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!isAuthenticated) return;

    const isConfirmed = window.confirm(
      registrationStatus.status === 'DEPOSITED'
        ? 'Bạn có chắc chắn muốn hủy đặt cọc không? Tiền cọc sẽ KHÔNG ĐƯỢC hoàn lại.'
        : 'Bạn có chắc chắn muốn hủy đăng ký không?'
    );

    if (!isConfirmed) return;

    try {
      setLoadingRegistration(true);
      await cancelRegistration(id);
      alert(
        registrationStatus.status === 'DEPOSITED'
          ? 'Hủy đặt cọc thành công! Tiền cọc sẽ không được hoàn lại.'
          : 'Hủy đăng ký thành công!'
      );
      await Promise.all([fetchEvent(), fetchRegistrationStatus()]);
    } catch (error) {
      alert(error);
    } finally {
      setLoadingRegistration(false);
    }
  };

  const handleDeposit = () => {
    if (!isAuthenticated) return navigate(`/login?redirect=/events/${id}`);
    setIsDepositModalOpen(true);
  };

  const handleConfirmDeposit = async (phone) => {
    setDepositLoading(true);
    try {
      const qrData = await initiateDeposit(id, phone);
      const fullQrData = {
        ...qrData,
        qrUrl: `https://img.vietqr.io/image/${qrData.bankBin}-${qrData.accountNumber}-compact.png?amount=${qrData.amount}&addInfo=${qrData.description}&accountName=${qrData.accountName}`
      };
      setIsDepositModalOpen(false);
      navigate('/payment-qr', { state: { qrData: fullQrData } });
    } catch (error) {
      alert(error);
    } finally {
      setDepositLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return navigate(`/login?redirect=/events/${id}`);
    try {
      setLoadingFavorite(true);
      const result = await toggleFavorite(id);
      setIsFavorited(result.isFavorited);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      await deleteEvent(id);
      navigate('/events');
    } catch (error) {
      setError('Không thể xóa sự kiện: ' + (error.message || error));
    } finally {
      setLoadingDelete(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleChatWithOrganizer = async () => {
    if (!isAuthenticated) {
      return navigate(`/login?redirect=/events/${id}`);
    }
    try {
      const conversation = await findOrCreateConversation(event.id, user.sub, event.organizerId);
      navigate(`/chat?conversationId=${conversation.id}`);
    } catch (error) {
      alert('Could not start a conversation with the organizer.');
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      await updateEvent(id, data);
      await fetchEvent();
      setIsEditModalOpen(false);
    } catch (error) {
      alert(error);
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;

    const formatDateForGoogle = (date) => {
      return new Date(date).toISOString().replace(/-|:|\.\\d{3}/g, '');
    };

    const startTime = formatDateForGoogle(event.startAt);
    const endTime = event.endAt ? formatDateForGoogle(event.endAt) : startTime;

    const calendarUrl = [
      'https://www.google.com/calendar/render?action=TEMPLATE',
      `&text=${encodeURIComponent(event.title)}`,
      `&dates=${startTime}/${endTime}`,
      `&details=${encodeURIComponent(event.description)}`,
      `&location=${encodeURIComponent(event.locationText)}`,
    ].join('');

    window.open(calendarUrl, '_blank');
  };

  if (loading) return <div className="loading-message">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <div className="no-results">Không tìm thấy sự kiện.</div>;

  const isOrganizer = user && user.sub === event.organizerId;
  const startDate = new Date(event.startAt);
  const endDate = event.endAt ? new Date(event.endAt) : null;

  const isMultiDay = endDate && startDate.toDateString() !== endDate.toDateString();

  const formatDate = (date) => date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const eventDate = formatDate(startDate);
  const eventTime = formatTime(startDate);

  let timeDisplay;
  if (endDate) {
    const eventEndTime = formatTime(endDate);
    if (isMultiDay) {
      timeDisplay = (
        <>
          <span>Bắt đầu: {eventTime}, {eventDate}</span>
          <span>Kết thúc: {eventEndTime}, {formatDate(endDate)}</span>
        </>
      );
    } else {
      timeDisplay = `${eventTime} - ${eventEndTime}`;
    }
  } else {
    timeDisplay = eventTime;
  }

  return (
    <>
      <EventModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onComplete={handleEditSubmit} initialData={event} />
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Xác nhận xóa sự kiện">
        <p>Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.</p>
      </Modal>
      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} onConfirm={handleConfirmDeposit} loading={depositLoading} />

      {isImageModalOpen && (
        <div className="image-modal-backdrop" onClick={() => setIsImageModalOpen(false)}>
          <div className="image-modal-content">
            <img src={event.imageUrl} alt={event.title} />
            <button className="image-modal-close" onClick={() => setIsImageModalOpen(false)}><X size={30} /></button>
          </div>
        </div>
      )}

      <div className="event-detail-page">
        <div className="event-image-container">
          <img src={event.imageUrl} alt={event.title} className="event-image" onClick={() => setIsImageModalOpen(true)} />
        </div>

        <div className="event-detail-container">
          <main className="event-detail__main">
            <div className="event-main-header">
              <h1 className="event-title">{event.title}</h1>
              <span className="event-status">{event.status}</span>
            </div>

            <div className="detail-card event-description">
              <h3>Chi tiết sự kiện</h3>
              <p>{event.description}</p>
            </div>
            <div className="detail-card organizer-info">
              <img src={event.organizer.avatarUrl || `https://i.pravatar.cc/150?u=${event.organizer.id}`} alt={event.organizer.name} className="organizer-avatar" />
              <div className="organizer-details">
                <span>Tổ chức bởi</span>
                <strong>{event.organizer.name}</strong>
              </div>
              {isAuthenticated && !isOrganizer && (
                <button className="button button--ghost button--icon" onClick={handleChatWithOrganizer}>
                  <MessageSquare size={18} />
                  Nhắn tin
                </button>
              )}
            </div>

            {/* Google Map under organizer info (no API key) */}
            <div className="detail-card" style={{ padding: 0, overflow: 'hidden' }}>
              <MapEmbed lat={event.lat} lng={event.lng} />
            </div>
          </main>

          <aside className="event-detail__sidebar">
            <div className="sidebar-card">
              <div className="sidebar-card__content">
                <div className="info-grid">
                  <div className="info-item">
                    <Calendar className="icon" size={24} />
                    <div className="info-item-text">
                      <strong>Ngày</strong>
                      <span>{eventDate}</span>
                    </div>
                  </div>
                  <div className="info-item time-info-item">
                    <Clock className="icon" size={24} />
                    <div className="info-item-text">
                      <strong>Thời gian</strong>
                      {isMultiDay ? timeDisplay : <span>{timeDisplay}</span>}
                    </div>
                  </div>
                  <div className="info-item">
                    <MapPin className="icon" size={24} />
                    <div className="info-item-text">
                      <strong>Địa điểm</strong>
                      <span>{event.locationText}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <Tag className="icon" size={24} />
                    <div className="info-item-text">
                      <strong>Giá vé</strong>
                      <span>{event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}</span>
                    </div>
                  </div>
                </div>

                {isAuthenticated && (
                  <button className={`button favorite-button ${isFavorited ? 'favorited' : ''}`} onClick={handleToggleFavorite} disabled={loadingFavorite}>
                    <Heart size={20} />
                    {loadingFavorite ? '...' : (isFavorited ? 'Đã yêu thích' : 'Yêu thích')}
                  </button>
                )}

                {isAuthenticated ? (
                  registrationStatus?.isRegistered ? (
                    registrationStatus.status === 'DEPOSITED' ? (
                      <>
                        <button className="button button--success" disabled>✓ Đã đặt cọc</button>
                        <Link to={`/events/${id}/ticket`} className="button button--secondary">Xem vé của tôi</Link>
                        <button className="button add-to-calendar-button" onClick={handleAddToCalendar}>Thêm vào Lịch</button>
                        <button className="button button--ghost" onClick={handleCancelRegistration} disabled={loadingRegistration}>
                          {loadingRegistration ? 'Đang hủy...' : 'Hủy đặt cọc'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="button button--success" disabled>✓ Đã đăng ký</button>
                        <button className="button add-to-calendar-button" onClick={handleAddToCalendar}>Thêm vào Lịch</button>
                        <button className="button button--ghost" onClick={handleCancelRegistration} disabled={loadingRegistration}>
                          {loadingRegistration ? 'Đang hủy...' : 'Hủy đăng ký'}
                        </button>
                      </>
                    )
                  ) : (
                    event.price > 0 ? (
                      <button className="button button--primary" onClick={handleDeposit} disabled={loadingRegistration || depositLoading}>
                        {depositLoading || loadingRegistration ? 'Đang xử lý...' : 'Đặt cọc ngay'}
                      </button>
                    ) : (
                      <button className="button button--primary" onClick={handleRegistration} disabled={loadingRegistration}>
                        {loadingRegistration ? 'Đang đăng ký...' : 'Đăng ký ngay'}
                      </button>
                    )
                  )
                ) : (
                  <Link to={`/login?redirect=/events/${id}`} className="button button--primary">Đăng nhập để tham gia</Link>
                )}
              </div>
              {isOrganizer && (
                <div className="sidebar-card__footer">
                  <button onClick={() => setIsEditModalOpen(true)} className="button">Chỉnh sửa</button>
                  <button className="button button--ghost" onClick={() => setIsDeleteModalOpen(true)} disabled={loadingDelete}>
                    {loadingDelete ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;