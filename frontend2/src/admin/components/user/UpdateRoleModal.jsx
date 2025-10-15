import React, { useState } from 'react';
import api from '../../../services/api';

const UpdateRoleModal = ({ user, onClose, onRoleUpdated }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: selectedRole });
      onRoleUpdated(user.id, selectedRole);
      onClose();
    } catch (err) {
      alert(`Lỗi khi cập nhật vai trò: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ap-modal-overlay">
      <div className="ap-modal">
        <div className="ap-modal__header">
          <h3>Thay Đổi Vai Trò cho {user.profile.displayName}</h3>
          <button onClick={onClose} className="ap-modal__close">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="ap-modal__body">
            <p>Chọn vai trò mới cho người dùng. Thao tác này sẽ thay đổi quyền truy cập của họ.</p>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Vai Trò</label>
              <select 
                className="ap-filter-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="PARTICIPANT">Participant</option>
                <option value="ORGANIZER">Organizer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div className="ap-modal__footer">
            <button type="button" onClick={onClose} className="ap-btn ap-btn--outline">Hủy</button>
            <button type="submit" className="ap-btn ap-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRoleModal;