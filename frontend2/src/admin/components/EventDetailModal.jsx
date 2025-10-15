import React from 'react';
import './EventDetailModal.css';

const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{event.title}</h2>
          <button onClick={onClose} className="modal-close-btn">X</button>
        </div>
        <div className="modal-body">
          <p><strong>Người tổ chức:</strong> {event.organizer.profile?.displayName || 'N/A'}</p>
          <p><strong>Email:</strong> {event.organizer.email}</p>
          <p><strong>Ngày bắt đầu:</strong> {new Date(event.startAt).toLocaleString()}</p>
          <p><strong>Ngày kết thúc:</strong> {new Date(event.endAt).toLocaleString()}</p>
          <p><strong>Địa điểm:</strong> {event.locationText}</p>
          <p><strong>Trạng thái:</strong> {event.status}</p>
          <p><strong>Người tham gia:</strong> {event.registeredCount}</p>
          <p><strong>Mô tả:</strong></p>
          <div dangerouslySetInnerHTML={{ __html: event.description }} />
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
