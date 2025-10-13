import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import './DepositModal.css';

const DepositModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [phone, setPhone] = useState('');

  const handleConfirm = () => {
    if (!phone || !/^\d{10,11}$/.test(phone)) {
      alert('Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).');
      return;
    }
    onConfirm(phone);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Xác nhận Đặt cọc" 
      onConfirm={handleConfirm} // Pass the handler to the parent modal
    >
      <div className="deposit-modal-content">
        <p>Để hoàn tất đặt cọc, vui lòng cung cấp số điện thoại của bạn để ban tổ chức có thể liên hệ và xác nhận khi bạn đến sự kiện.</p>
        <input
          type="tel"
          className="deposit-phone-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Nhập số điện thoại của bạn"
        />
        {/* The buttons are now rendered by the parent Modal component */}
      </div>
    </Modal>
  );
};

export default DepositModal;