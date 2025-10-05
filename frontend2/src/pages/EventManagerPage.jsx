import React, { useEffect, useState, useCallback } from 'react';
import { getMyEvents } from '../services/userService';
import { getRegistrationsForEvent } from '../services/registrationService';
import { createEvent, updateEvent, deleteEvent } from '../services/eventService';
import { PlusCircle, Edit, Trash2, Users, BarChart2, Info, Calendar, MapPin } from 'lucide-react';
import EventModal from './EventModal'; // Import the modal
import './EventManagerPage.css';

const EventManagerPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchManagedEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const data = await getMyEvents();
      setEvents(data.organized || []);
    } catch {
      setError('Không thể tải danh sách sự kiện của bạn.');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchManagedEvents();
  }, [fetchManagedEvents]);

  const handleSelectEvent = useCallback(async (event) => {
    if (selectedEvent?.id === event.id) {
        setSelectedEvent(null);
        setRegistrations([]);
        return;
    }
    setSelectedEvent(event);
    setLoadingDetails(true);
    try {
      const registrationData = await getRegistrationsForEvent(event.id);
      setRegistrations(registrationData || []);
    } catch {
      setError('Không thể tải chi tiết sự kiện.');
      setRegistrations([]);
    } finally {
      setLoadingDetails(false);
    }
  }, [selectedEvent]);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleFormSubmit = async (data, eventId) => {
    try {
        if (eventId) { // If ID exists, it's an update
            await updateEvent(eventId, data);
        } else { // Otherwise, it's a create
            await createEvent(data);
        }
        fetchManagedEvents(); // Refetch events on success
    } catch (err) {
        setError(err.toString());
    }
  };

  const handleOpenDeleteModal = (event) => {
    setDeletingEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingEvent(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;

    try {
      setLoadingDelete(true);
      await deleteEvent(deletingEvent.id);
      
      // Reset selected event if it's the one being deleted
      if (selectedEvent?.id === deletingEvent.id) {
        setSelectedEvent(null);
        setRegistrations([]);
      }
      
      // Refresh events list
      await fetchManagedEvents();
      setIsDeleteModalOpen(false);
      setDeletingEvent(null);
      
      // Show success message
      setError(null);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoadingDelete(false);
    }
  };

  const statusBadge = (status) => {
    const statusClasses = {
      PUBLISHED: 'badge--published',
      DRAFT: 'badge--draft',
      CANCELLED: 'badge--cancelled',
      CLOSED: 'badge--closed',
    };
    return <span className={`badge ${statusClasses[status] || 'badge--default'}`}>{status}</span>;
  };

  const registrationStatusBadge = (status) => {
    const statusConfig = {
      REGISTERED: { 
        class: 'badge--registered', 
        text: 'Đăng ký', 
        icon: '📝' 
      },
      DEPOSITED: { 
        class: 'badge--deposited', 
        text: 'Đã cọc', 
        icon: '💰' 
      },
    };
    const config = statusConfig[status] || { 
      class: 'badge--default', 
      text: status, 
      icon: '❓' 
    };
    return (
      <span className={`badge ${config.class}`}>
        <span className="badge-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  // Calculate registration statistics
  const getRegistrationStats = () => {
    if (!registrations.length) return null;
    
    const total = registrations.length;
    const deposited = registrations.filter(reg => reg.status === 'DEPOSITED').length;
    const registered = registrations.filter(reg => reg.status === 'REGISTERED').length;
    
    return { total, deposited, registered };
  };

  return (
    <>
      <EventModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onComplete={handleFormSubmit}
        initialData={editingEvent}
      />
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="delete-modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận xóa sự kiện</h3>
            <p>Bạn có chắc chắn muốn xóa sự kiện <strong>"{deletingEvent?.title}"</strong>?</p>
            <p className="delete-warning-text">Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.</p>
            <div className="delete-modal-actions">
              <button 
                onClick={handleCloseDeleteModal} 
                className="delete-button delete-button--secondary"
                disabled={loadingDelete}
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmDelete} 
                className="delete-button delete-button--danger"
                disabled={loadingDelete}
              >
                {loadingDelete ? 'Đang xóa...' : 'Xóa sự kiện'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="event-manager-page">
        <div className="manager-header">
          <h1 className="manager-title">Quản lý sự kiện</h1>
          <button onClick={handleOpenCreateModal} className="create-event-button">
            <PlusCircle size={20} />
            <span>Tạo sự kiện mới</span>
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="manager-content">
          {/* Left Column: Event List */}
          <div className="event-list-column">
            {loadingEvents ? (
              <p>Đang tải danh sách sự kiện...</p>
            ) : events.length > 0 ? (
              <ul className="event-list">
                {events.map(event => (
                  <li 
                    key={event.id} 
                    className={`event-list-item ${selectedEvent?.id === event.id ? 'event-list-item--selected' : ''}`}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="event-list-item__info">
                      <p className="event-list-item__title">{event.title}</p>
                      <p className="event-list-item__date">
                        {new Date(event.startAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="event-list-item__meta">
                      {statusBadge(event.status)}
                      <span className="event-list-item__registrations">
                        <Users size={14} />
                        {event._count.registrations} / {event.capacity || '∞'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Bạn chưa tạo sự kiện nào.</p>
            )}
          </div>

          {/* Right Column: Event Details */}
          <div className="event-details-column">
            {selectedEvent ? (
              loadingDetails ? (
                <p>Đang tải chi tiết...</p>
              ) : (
                <div className="details-card">
                  <div className="details-header">
                      <img src={selectedEvent.imageUrl || 'https://via.placeholder.com/400x200?text=Event'} alt={selectedEvent.title} className="details-header__image" />
                      <div className="details-header__overlay">
                          <h2 className="details-title">{selectedEvent.title}</h2>
                          <div className="details-actions">
                              <button onClick={() => handleOpenEditModal(selectedEvent)} className="action-button"><Edit size={16}/> Sửa</button>
                              <button 
                                onClick={() => handleOpenDeleteModal(selectedEvent)} 
                                className="action-button action-button--danger"
                                disabled={loadingDelete}
                              >
                                <Trash2 size={16}/> {loadingDelete ? 'Đang xóa...' : 'Xóa'}
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div className="details-content">
                      {/* Basic Info & Stats */}
                      <div className="stats-grid">
                          <div className="stat-item"><BarChart2 size={20}/> <span>{statusBadge(selectedEvent.status)}</span></div>
                          <div className="stat-item"><Users size={20}/> <span>{registrations.length} / {selectedEvent.capacity || '∞'} đã đăng ký</span></div>
                          <div className="stat-item"><Calendar size={20}/> <span>{new Date(selectedEvent.startAt).toLocaleString('vi-VN')}</span></div>
                          <div className="stat-item"><MapPin size={20}/> <span>{selectedEvent.locationText}</span></div>
                      </div>

                      {/* Registration Statistics */}
                      {registrations.length > 0 && (
                        <div className="registration-stats">
                          <h3 className="stats-title">Thống kê đăng ký</h3>
                          <div className="stats-summary">
                            <div className="stat-card stat-card--total">
                              <span className="stat-number">{getRegistrationStats().total}</span>
                              <span className="stat-label">Tổng số</span>
                            </div>
                            <div className="stat-card stat-card--registered">
                              <span className="stat-number">{getRegistrationStats().registered}</span>
                              <span className="stat-label">Đăng ký</span>
                            </div>
                            <div className="stat-card stat-card--deposited">
                              <span className="stat-number">{getRegistrationStats().deposited}</span>
                              <span className="stat-label">Đã cọc</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Participant List */}
                      <div className="participants-section">
                          <h3 className="section-title">Danh sách người tham gia</h3>
                          <div className="participants-list-wrapper">
                              {registrations.length > 0 ? (
                                  <ul className="participants-list">
                                      <li className="participants-list__header">
                                          <span>Tên người tham gia</span>
                                          <span>Email</span>
                                          <span>Trạng thái</span>
                                      </li>
                                      {registrations.map(reg => (
                                          <li key={reg.id} className="participants-list__item">
                                              <span className="participant-name">
                                                {reg.user.profile?.displayName || 'N/A'}
                                              </span>
                                              <span className="participant-email">
                                                {reg.user.email}
                                              </span>
                                              <span className="participant-status">
                                                {registrationStatusBadge(reg.status)}
                                              </span>
                                          </li>
                                      ))}
                                  </ul>
                              ) : (
                                  <div className="no-participants">
                                    <Users size={48} />
                                    <p>Chưa có ai đăng ký sự kiện này.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
                </div>
              )
            ) : (
              <div className="placeholder-card">
                <Info size={40} />
                <p>Chọn một sự kiện để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventManagerPage;