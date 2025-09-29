import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getEventById, deleteEvent } from '../services/eventService';
import { createRegistration, getRegistrationStatus, cancelRegistration } from '../services/registrationService';
import { toggleFavorite, getFavoriteStatus } from '../services/favoritesService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import './EventDetailPage.css';
import '../components/ui/Button.css';

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
      // If error (like 401), user is not registered
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
  }, [fetchEvent]);

  useEffect(() => {
    fetchRegistrationStatus();
  }, [fetchRegistrationStatus]);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [fetchFavoriteStatus]);

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
        ? 'Bạn có chắc chắn muốn hủy đặt cọc không? Tiền cọc sẽ được hoàn lại.'
        : 'Bạn có chắc chắn muốn hủy đăng ký không?'
    );
    
    if (!isConfirmed) return;
    
    try {
      setLoadingRegistration(true);
      await cancelRegistration(id);
      alert(
        registrationStatus.status === 'DEPOSITED' 
          ? 'Hủy đặt cọc thành công! Tiền sẽ được hoàn lại trong 3-5 ngày.'
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
    // Navigate to payment page with event info
    navigate('/payment', { state: { event } });
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

  if (loading) return <div className="loading-message">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <div className="no-results">Không tìm thấy sự kiện.</div>;

  const isOrganizer = user && user.sub === event.organizerId;
  const eventDate = new Date(event.startAt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const eventTime = new Date(event.startAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa sự kiện"
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</p>
      </Modal>

      <div className="event-detail-page">
        <div className="event-detail__main">
          <div className="event-header">
            <span className="event-status">{event.status}</span>
            <h1 className="event-title">{event.title}</h1>
            <div className="organizer-info">
              <img src={event.organizer.profile?.avatarUrl || `https://i.pravatar.cc/150?u=${event.organizer.id}`} alt={event.organizer.name} className="organizer-avatar" />
              <span>Tổ chức bởi <strong>{event.organizer.name}</strong></span>
            </div>
          </div>
          
          <div className="event-description">
            <h3>Chi tiết sự kiện</h3>
            <p>{event.description}</p>
          </div>
        </div>

        <aside className="event-detail__sidebar">
          <div className="sidebar-card">
            <img src={event.imageUrl} alt={event.title} className="sidebar-card__image" />
            <div className="sidebar-card__content">
              <div className="info-grid">
                <div className="info-item">
                  <strong>Ngày</strong>
                  <span>{eventDate}</span>
                </div>
                <div className="info-item">
                  <strong>Thời gian</strong>
                  <span>{eventTime}</span>
                </div>
                <div className="info-item">
                  <strong>Địa điểm</strong>
                  <span>{event.locationText}</span>
                </div>
                <div className="info-item">
                  <strong>Giá vé</strong>
                  <span>{event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}</span>
                </div>
              </div>

              {/* Favorite Button */}
              {isAuthenticated && (
                <button
                  className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                  onClick={handleToggleFavorite}
                  disabled={loadingFavorite}
                  title={isFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                >
                  <Heart 
                    size={20} 
                    fill={isFavorited ? '#e74c3c' : 'none'} 
                    color={isFavorited ? '#e74c3c' : '#666'}
                  />
                  {loadingFavorite ? '...' : (isFavorited ? 'Đã yêu thích' : 'Yêu thích')}
                </button>
              )}

              {isAuthenticated ? (
                <>
                  {registrationStatus?.isRegistered ? (
                    <>
                      {registrationStatus.status === 'DEPOSITED' ? (
                        <>
                          <button className="button button--success" disabled>
                            ✓ Đã đặt cọc
                          </button>
                          <Link 
                            to={`/events/${id}/ticket`}
                            className="button button--secondary"
                          >
                            Xem vé của tôi
                          </Link>
                          <button 
                            className="button button--ghost" 
                            onClick={handleCancelRegistration}
                            disabled={loadingRegistration}
                          >
                            {loadingRegistration ? 'Đang hủy...' : 'Hủy đặt cọc'}
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="button button--success" disabled>
                            ✓ Đã đăng ký
                          </button>
                          {event.price > 0 && (
                            <button className="button" onClick={handleDeposit}>
                              Đặt cọc
                            </button>
                          )}
                          <button 
                            className="button button--ghost" 
                            onClick={handleCancelRegistration}
                            disabled={loadingRegistration}
                          >
                            {loadingRegistration ? 'Đang hủy...' : 'Hủy đăng ký'}
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <button 
                      className="button button--secondary" 
                      onClick={handleRegistration}
                      disabled={loadingRegistration}
                    >
                      {loadingRegistration ? 'Đang đăng ký...' : 'Đăng ký ngay'}
                    </button>
                  )}
                </>
              ) : (
                <Link to={`/login?redirect=/events/${id}`} className="button button--secondary">
                  Đăng nhập để tham gia
                </Link>
              )}
            </div>
             {isOrganizer && (
                <div className="sidebar-card__footer">
                  <Link to={`/events/${id}/edit`} className="button">Chỉnh sửa</Link>
                  <button 
                    className="button button--ghost" 
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={loadingDelete}
                  >
                    {loadingDelete ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default EventDetailPage;