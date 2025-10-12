import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getEventById, deleteEvent, updateEvent } from '../services/eventService';
import { createRegistration, getRegistrationStatus, cancelRegistration } from '../services/registrationService';
import { toggleFavorite, getFavoriteStatus } from '../services/favoritesService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import EventModal from './EventModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleEditSubmit = async (data) => {
    try {
      await updateEvent(id, data);
      await fetchEvent();
      setIsEditModalOpen(false);
    } catch (error) {
      alert(error);
    }
  };

  // Gallery helpers
  const images = React.useMemo(() => {
    if (!event) return [];
    // Normalize to array<string> of URLs
    if (Array.isArray(event.images) && event.images.length > 0) {
      return event.images.map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean);
    }
    if (Array.isArray(event.imageUrls) && event.imageUrls.length > 0) return event.imageUrls;
    return event.imageUrl ? [event.imageUrl] : [];
  }, [event]);

  const openLightboxAt = (idx) => {
    setCurrentImageIndex(idx);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const showPrev = (e) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const showNext = (e) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  if (loading) return <div className="loading-message">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <div className="no-results">Không tìm thấy sự kiện.</div>;

  const isOrganizer = user && user.sub === event.organizerId;
  const eventDate = new Date(event.startAt).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const eventTime = new Date(event.startAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <EventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onComplete={handleEditSubmit}
        initialData={event}
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa sự kiện"
      >
        <p>Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.</p>
      </Modal>

      <div className="event-detail-page">
        <div className="event-detail__main">
          <div className="event-header">
            <span className="event-status">{event.status}</span>
            <h1 className="event-title">{event.title}</h1>
            <div className="organizer-info">
              <img src={event.organizer.avatarUrl || `https://i.pravatar.cc/150?u=${event.organizer.id}`} alt={event.organizer.name} className="organizer-avatar" />
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
            {images.length > 0 && (
              <div className="sidebar-gallery">
                <img
                  src={images[0]}
                  alt={event.title}
                  className="sidebar-card__image sidebar-card__image--zoomable"
                  onClick={() => openLightboxAt(0)}
                  title="Nhấn để phóng to"
                />
                {images.length > 1 && (
                  <div className="sidebar-thumbs">
                    {images.slice(1, 4).map((url, idx) => (
                      <img key={idx} src={url} alt={`thumb ${idx+2}`} className="sidebar-thumb" onClick={() => openLightboxAt(idx + 1)} />
                    ))}
                    {images.length > 4 && (
                      <button className="thumb-more" onClick={() => openLightboxAt(4)}>+{images.length - 4}</button>
                    )}
                  </div>
                )}
              </div>
            )}
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
                    fill={isFavorited ? '#fff' : 'none'} 
                    color={isFavorited ? '#fff' : '#666'}
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
                  <button onClick={() => setIsEditModalOpen(true)} className="button">Chỉnh sửa</button>
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

      {/* Lightbox */}
      {isLightboxOpen && images.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Đóng">×</button>
            {images.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-nav--prev" onClick={showPrev} aria-label="Ảnh trước">‹</button>
                <button className="lightbox-nav lightbox-nav--next" onClick={showNext} aria-label="Ảnh sau">›</button>
              </>
            )}
            <img src={images[currentImageIndex]} alt={`${event.title} ${currentImageIndex + 1}`} className="lightbox-img" />
            {images.length > 1 && (
              <div className="lightbox-counter">{currentImageIndex + 1} / {images.length}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailPage;