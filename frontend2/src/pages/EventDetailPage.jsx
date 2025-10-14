import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Calendar, MapPin, Clock, Users, DollarSign, Edit, Trash2,
  ArrowLeft, CheckCircle, AlertCircle, Maximize2, X, PartyPopper, AlertTriangle
} from 'lucide-react';
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

  // Popups
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);  // đăng ký thành công
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false); // xác nhận hủy
  const [isCancelSuccessOpen, setIsCancelSuccessOpen] = useState(false); // hủy xong
  const [cancelKind, setCancelKind] = useState('REGISTER'); // 'REGISTER' | 'DEPOSIT'

  // Zoom image
  const [isImageOpen, setIsImageOpen] = useState(false);
  const openImage = () => setIsImageOpen(true);
  const closeImage = useCallback(() => setIsImageOpen(false), []);

  useEffect(() => {
    if (!isImageOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeImage(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isImageOpen, closeImage]);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await getEventById(id);
      setEvent(eventData);
    } catch {
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

  useEffect(() => { fetchEvent(); }, [fetchEvent]);
  useEffect(() => { fetchRegistrationStatus(); }, [fetchRegistrationStatus]);
  useEffect(() => { fetchFavoriteStatus(); }, [fetchFavoriteStatus]);

  // ---- REGISTER ----
  const handleRegistration = async () => {
    if (!isAuthenticated) return navigate(`/login?redirect=/events/${id}`);
    try {
      setLoadingRegistration(true);
      await createRegistration(id);
      setIsSuccessPopupOpen(true);
      await Promise.all([fetchEvent(), fetchRegistrationStatus()]);
      setTimeout(() => setIsSuccessPopupOpen(false), 7000); // auto close after 7s
    } catch (error) {
      alert(error);
    } finally {
      setLoadingRegistration(false);
    }
  };

  // ---- CANCEL (CONFIRM + SUCCESS POPUP) ----
  const openCancelConfirm = (kind = 'REGISTER') => {
    setCancelKind(kind);
    setIsCancelConfirmOpen(true);
  };

  const handleCancelRegistration = async () => {
    try {
      setLoadingRegistration(true);
      await cancelRegistration(id);
      setIsCancelConfirmOpen(false);
      setIsCancelSuccessOpen(true);
      await Promise.all([fetchEvent(), fetchRegistrationStatus()]);
      setTimeout(() => setIsCancelSuccessOpen(false), 7000); // auto close after 7s
    } catch (error) {
      alert(error);
    } finally {
      setLoadingRegistration(false);
    }
  };

  const handleDeposit = () => {
    if (!isAuthenticated) return navigate(`/login?redirect=/events/${id}`);
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

      {/* ✅ Popup Đăng ký thành công */}
      {isSuccessPopupOpen && (
        <div className="success-popup">
          <div className="success-popup-content">
            <h2>Đăng ký thành công 🎉</h2>
            <div className="success-icon">
              <PartyPopper size={48} color="#20CDA4" />
            </div>
            <p>Bạn đã đăng ký tham gia <b>{event.title}</b>.</p>
            <p>Hẹn gặp bạn tại sự kiện nhé!</p>
            <div className="popup-buttons">
              {event.price > 0 && (
                <button onClick={handleDeposit} className="button button--primary">Đặt cọc ngay</button>
              )}
              <button onClick={() => setIsSuccessPopupOpen(false)} className="button button--outline">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ Popup xác nhận hủy */}
      {isCancelConfirmOpen && (
        <div className="success-popup">
          <div className="success-popup-content">
            <h2>Xác nhận hủy đăng ký</h2>
            <div className="success-icon">
              <AlertTriangle size={48} color="#F87171" />
            </div>
            <p>
              {cancelKind === 'DEPOSIT'
                ? 'Bạn có chắc muốn hủy ĐẶT CỌC cho sự kiện này?'
                : 'Bạn có chắc muốn hủy đăng ký tham gia sự kiện này?'}
            </p>
            <div className="popup-buttons">
              <button
                className="button button--danger"
                onClick={handleCancelRegistration}
                disabled={loadingRegistration}
              >
                {loadingRegistration ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
              <button
                className="button button--outline"
                onClick={() => setIsCancelConfirmOpen(false)}
              >
                Giữ đăng ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Popup Hủy thành công */}
      {isCancelSuccessOpen && (
        <div className="success-popup">
          <div className="success-popup-content">
            <h2>Hủy đăng ký thành công 🎉</h2>
            <div className="success-icon">
              <CheckCircle size={48} color="#22C55E" />
            </div>
            <p>Bạn đã hủy {cancelKind === 'DEPOSIT' ? 'đặt cọc' : 'đăng ký'} sự kiện <b>{event.title}</b>.</p>
            <div className="popup-buttons">
              <button onClick={() => setIsCancelSuccessOpen(false)} className="button button--outline">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HERO ===== */}
      <div className="event-detail-page">
        <div className="event-hero">
          <div className="event-hero__overlay">
            <div className="event-hero__content">
              <div className="event-hero__breadcrumb">
                <button className="back-button" onClick={() => navigate(-1)}>
                  <ArrowLeft size={20} /> Quay lại
                </button>
              </div>
              <div className="event-hero__status">
                <span className={`status-badge status-${event.status.toLowerCase()}`}>
                  {event.status === 'ACTIVE' && <CheckCircle size={16} />}
                  {event.status === 'ENDED' && <AlertCircle size={16} />}
                  {event.status}
                </span>
              </div>
              <h1 className="event-hero__title">{event.title}</h1>
              <div className="event-hero__meta">
                <div className="event-hero__organizer">
                  <img 
                    src={event.organizer.avatarUrl || `https://i.pravatar.cc/150?u=${event.organizer.id}`} 
                    alt={event.organizer.name} 
                    className="organizer-avatar" 
                  />
                  <div className="organizer-details">
                    <span className="organizer-label">Tổ chức bởi </span>
                    <span className="organizer-name">{event.organizer.name}</span>
                  </div>
                </div>
                <div className="event-hero__actions">
                  {isAuthenticated && (
                    <button
                      className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                      onClick={handleToggleFavorite}
                      disabled={loadingFavorite}
                      title={isFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    >
                      <Heart 
                        size={20} 
                        fill={isFavorited ? '#EF4444' : 'none'}
                        color={isFavorited ? '#EF4444' : '#666'}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="event-hero__image">
            <img src={event.imageUrl} alt={event.title} className="click-zoom-image" onClick={openImage} />
            <button type="button" className="image-zoom-button" onClick={openImage}>
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        <div className="event-detail__content">
          <div className="event-detail__main">
            <section className="event-section">
              <h2 className="section-title">Về sự kiện</h2>
              <div className="event-description">
                <p>{event.description}</p>
              </div>
            </section>

            <section className="event-section">
              <h2 className="section-title">Chi tiết sự kiện</h2>
              <div className="event-details-grid">
                <div className="detail-card">
                  <div className="detail-card__icon">
                    <Calendar size={24} />
                  </div>
                  <div className="detail-card__content">
                    <h3>Ngày diễn ra</h3>
                    <p>{eventDate}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <div className="detail-card__icon">
                    <Clock size={24} />
                  </div>
                  <div className="detail-card__content">
                    <h3>Thời gian</h3>
                    <p>{eventTime}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <div className="detail-card__icon">
                    <MapPin size={24} />
                  </div>
                  <div className="detail-card__content">
                    <h3>Địa điểm</h3>
                    <p>{event.locationText}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <div className="detail-card__icon">
                    <DollarSign size={24} />
                  </div>
                  <div className="detail-card__content">
                    <h3>Giá vé</h3>
                    <p className="price-text">
                      {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="event-detail__sidebar">
            <div className="sidebar-card">
              <div className="sidebar-card__header">
                <h3>Tham gia sự kiện</h3>
                <div className="event-stats">
                  <div className="stat-item">
                    <Users size={16} />
                    <span>{event.registrations?.length || 0} người đã đăng ký</span>
                  </div>
                  {event.capacity && (
                    <div className="stat-item">
                      <Users size={16} />
                      <span>Còn {event.capacity - (event.registrations?.length || 0)} chỗ</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="sidebar-card__content">
                {isAuthenticated ? (
                  <>
                    {registrationStatus?.isRegistered ? (
                      <>
                        {registrationStatus.status === 'DEPOSITED' ? (
                          <div className="registration-status">
                            <div className="status-success">
                              <CheckCircle size={20} />
                              <span>Đã đặt cọc thành công</span>
                            </div>
                            <Link
                              to={`/events/${id}/ticket`}
                              className="button button--primary"
                            >
                              Xem vé của tôi
                            </Link>
                            <button
                              className="button button--outline"
                              onClick={() => openCancelConfirm('DEPOSIT')}
                              disabled={loadingRegistration}
                            >
                              Hủy đặt cọc
                            </button>
                          </div>
                        ) : (
                          <div className="registration-status">
                            <div className="status-success">
                              <CheckCircle size={20} />
                              <span>Đã đăng ký thành công</span>
                            </div>
                            {event.price > 0 && (
                              <button className="button button--primary" onClick={handleDeposit}>
                                Đặt cọc ngay
                              </button>
                            )}
                            <button
                              className="button button--outline"
                              onClick={() => openCancelConfirm('REGISTER')}
                              disabled={loadingRegistration}
                            >
                              Hủy đăng ký
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="registration-actions">
                        <button
                          className="button button--primary button--large"
                          onClick={handleRegistration}
                          disabled={loadingRegistration}
                        >
                          {loadingRegistration ? 'Đang đăng ký...' : 'Đăng ký ngay'}
                        </button>
                        <p className="registration-note">
                          Đăng ký miễn phí để tham gia sự kiện này
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="registration-actions">
                    <Link to={`/login?redirect=/events/${id}`} className="button button--primary button--large">
                      Đăng nhập để tham gia
                    </Link>
                    <p className="registration-note">
                      Đăng nhập để đăng ký tham gia sự kiện
                    </p>
                  </div>
                )}

                {isOrganizer && (
                  <div className="organizer-actions">
                    <h4>Quản lý sự kiện</h4>
                    <div className="action-buttons">
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="button button--outline"
                      >
                        <Edit size={16} />
                        Chỉnh sửa
                      </button>
                      <button
                        className="button button--danger"
                        onClick={() => setIsDeleteModalOpen(true)}
                        disabled={loadingDelete}
                      >
                        <Trash2 size={16} />
                        {loadingDelete ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== Lightbox ảnh ===== */}
      {isImageOpen && (
        <div className="image-lightbox-backdrop" onClick={closeImage}>
          <div
            className="image-lightbox-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh lớn"
          >
            <button className="image-lightbox-close" onClick={closeImage} aria-label="Đóng">
              <X size={20} />
            </button>
            <img src={event.imageUrl} alt={event.title} className="image-lightbox-img" />
            <div className="image-lightbox-caption">{event.title}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailPage;
