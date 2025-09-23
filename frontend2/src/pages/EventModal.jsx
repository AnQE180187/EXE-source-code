import React from 'react';
import EventForm from './EventForm';
import { X } from 'lucide-react';
import './Modal.css'; // Generic modal styles

const EventModal = ({ isOpen, onClose, onComplete, initialData }) => {
  if (!isOpen) return null;

  const mode = initialData ? 'edit' : 'create';
  const title = mode === 'edit' ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới';

  const handleSubmit = async (data) => {
    // The onSubmit logic will be passed from the parent
    await onComplete(data, initialData?.id);
    onClose(); // Close modal on success
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={24} /></button>
        </div>
        <div className="modal-content">
          <EventForm 
            initialData={initialData}
            onSubmit={handleSubmit}
            submitButtonText={mode === 'edit' ? 'Lưu thay đổi' : 'Tạo sự kiện'}
          />
        </div>
      </div>
    </div>
  );
};

export default EventModal;
