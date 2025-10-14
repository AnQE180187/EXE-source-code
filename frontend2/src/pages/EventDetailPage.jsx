import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, CheckCircle, AlertCircle, X } from 'lucide-react';
import { getEventById, deleteEvent, updateEvent } from '../services/eventService';
import { createRegistration, getRegistrationStatus, cancelRegistration } from '../services/registrationService';
import { toggleFavorite, getFavoriteStatus } from '../services/favoritesService';
import { findOrCreateConversation } from '../services/chatService';
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

  // Popups & lightbox
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [isCancelSuccessOpen, setIsCancelSuccessOpen] = useState(false);
  const [cancelKind, setCancelKind] = useState('REGISTER');
  const [isImageOpen, setIsImageOpen] = useState(false);

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
      setIsFavorited(!!status.isFavorited);
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
      setTimeout(() => setIsSuccessPopupOpen(false), 7000);
    } catch (error) {
      alert(error?.message || String(error));
    } finally {
      setLoadingRegistration(false);
    }
  };

  // ---- CANCEL ----
  const handleCancelRegistration = async () => {
    if (!isAuthenticated) return;

    const willCancelDeposit = registrationStatus?.status === 'DEPOSITED';
    const isConfirmed = window.confirm(
      willCancelDeposit
        ? 'Bạn có chắc chắn muốn hủy đặt cọc không? Tiền cọc sẽ được hoàn lại.'
        : 'Bạn có chắc chắn muốn hủy đăng ký không?'
    );
    if (!isConfirmed) return;

    try {
      setLoadingRegistration(true);
      await cancelRegistration(id);
      setCancelKind(willCancelDeposit ? 'DEPOSIT' : 'REGISTER');
      setIsCancelSuccessOpen(true);
      await Promise.all([fetchEvent(), fetchRegistrationStatus()]);
      setTimeout(() => setIsCancelSuccessOpen(false), 7000);
    } catch (error) {
      alert(error?.message || String(error));
    } finally {
      setLoadingRegistration(false);
    }
  };

  // ---- DEPOSIT ----
  const handleDeposit = () => {
    if (!isAuthenticated) return navigate(`/login?redirect=/events/${id}`);
    navigate('/payment', { state: { event } });
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return navigate(`/login?redirect=/events/${id}`);
    try {
      setLoadingFavorite(true);
      const result = await toggleFavorite(id);
      setIsFavorited(!!result.isFavorited);
    } catch (error) {
      alert(error?.message || String(error));
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
      setError('Không thể xóa sự kiện: ' + (error?.message || String(error)));
    } finally {
      setLoadingDelete(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleChatWithOrganizer = async () => {
    if (!isAuthenticated) return navigate(`/login?redirect=/events/${id}`);
    try {
      const conversation = await findOrCreateConversation(
        event.id,
        user.sub,
        event.organizerId,
      );
      navigate(`/chat?conversationId=${conversation.id}`);
    } catch {
      alert('Không thể bắt đầu cuộc trò chuyện với người tổ chức.');
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      await updateEvent(id, data);
      await fetchEvent();
      setIsEditModalOpen(false);
    } catch (error) {
      alert(error?.message || String(error));
    }
  };

  const openImage = () => setIsImageOpen(true);
  const closeImage = () => setIsImageOpen(false);

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

      {/* Popup đăng ký thành công */}
      {isSuccessPopupOpen && (
        <div className="success-popup">
          <div className="success-popup-content">
            <h2>Đăng ký thành công 🎉</h2>
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <p>Bạn đã đăng ký sự kiện <b>{event.title}</b>.</p>
            <div className="popup-buttons">
              <button onClick={() => setIsSuccessPopupOpen(false)} className="button button--outline">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup hủy thành công */}
      {isCancelSuccessOpen && (
        <div className="success-popup">
          <div className="success-popup-content">
            <h2>Hủy {cancelKind === 'DEPOSIT' ? 'đặt cọc' : 'đăng ký'} thành công 🎉</h2>
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <p>Bạn đã hủy {cancelKind === 'DEPOSIT' ? 'đặt cọc' : 'đăng ký'} cho sự kiện <b>{event.title}</b>.</p>
            <div className="popup-buttons">
              <button onClick={() => setIsCancelSuccessOpen(false)} className="button button--outline">Đóng</button>
            </div>
          </div>
        </div>
      )}

      <div className="event-detail-page">
        {/* ===== HERO ===== */}
        <div className="event-hero">
          {event.imageUrl && (
            <img
              className="event-hero__image"
              src={event.imageUrl}
              alt={event.title}
              onClick={openImage}
              role="button"
            />
          )}
          <div className="event-hero__overlay">
            <div className="event-hero__content">
              <div className="event-hero__breadcrumb">
                <button className="back-button" onClick={() => navigate(-1)}>
                  <ArrowLeft size={20} /> Quay lại
                </button>
              </div>

              <div className="event-hero__status">
                <span className={`status-badge status-${String(event.status || '').toLowerCase()}`}>
                  {event.status === 'ACTIVE' && <CheckCircle size={16} />}
                  {event.status === 'ENDED' && <AlertCircle size={16} />}
                  {event.status}
                </span>
              </div>

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

              <div className="hero-actions">
                {isAuthenticated ? (
                  registrationStatus?.isRegistered ? (
                    registrationStatus.status === 'DEPOSITED' ? (
                      <>
                        <button className="button button--success" disabled>✓ Đã đặt cọc</button>
                        <Link to={`/events/${id}/ticket`} className="button button--secondary">Xem vé của tôi</Link>
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
                        <button className="button button--success" disabled>✓ Đã đăng ký</button>
                        {event.price > 0 && (
                          <button className="button" onClick={handleDeposit}>Đặt cọc</button>
                        )}
                        <button
                          className="button button--ghost"
                          onClick={handleCancelRegistration}
                          disabled={loadingRegistration}
                        >
                          {loadingRegistration ? 'Đang hủy...' : 'Hủy đăng ký'}
                        </button>
                      </>
                    )
                  ) : (
                    <button
                      className="button button--secondary"
                      onClick={handleRegistration}
                      disabled={loadingRegistration}
                    >
                      {loadingRegistration ? 'Đang đăng ký...' : 'Đăng ký ngay'}
                    </button>
                  )
                ) : (
                  <Link to={`/login?redirect=/events/${id}`} className="button button--secondary">
                    Đăng nhập để tham gia
                  </Link>
                )}
              </div>

              <div className="hero-organizer-actions">
                <button className="button button--ghost" onClick={handleChatWithOrganizer}>Nhắn với người tổ chức</button>
                {isOrganizer && (
                  <>
                    <button onClick={() => setIsEditModalOpen(true)} className="button">Chỉnh sửa</button>
                    <button
                      className="button button--ghost"
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={loadingDelete}
                    >
                      {loadingDelete ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN ===== */}
        <div className="event-detail__main">
          <div className="event-header">
            <h1 className="event-title">{event.title}</h1>
            <div className="organizer-info">
              <img
                src={event.organizer?.avatarUrl || `https://i.pravatar.cc/150?u=${event.organizerId}`}
                alt={event.organizer?.name || 'Organizer'}
                className="organizer-avatar"
              />
              <span>
                Tổ chức bởi <strong>{event.organizer?.name || 'Ẩn danh'}</strong> • {eventDate} • {eventTime}
              </span>
            </div>
          </div>

          <div className="event-description">
            <h3>Chi tiết sự kiện</h3>
            <p>{event.description}</p>
          </div>
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
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
