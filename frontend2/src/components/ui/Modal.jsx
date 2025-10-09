import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button onClick={onClose} className="modal-close" aria-label="Đóng">&times;</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button className="button button--secondary" onClick={onClose}>Hủy</button>
          <button className="button button--danger" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
