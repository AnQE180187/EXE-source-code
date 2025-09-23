import React from 'react';
import PostForm from './PostForm';
import { X } from 'lucide-react';
import './Modal.css'; // Re-use generic modal styles

const PostModal = ({ isOpen, onClose, onComplete, initialData }) => {
  if (!isOpen) return null;

  const mode = initialData ? 'edit' : 'create';
  const title = mode === 'edit' ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới';

  const handleSubmit = async (data) => {
    await onComplete(data, initialData?.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={24} /></button>
        </div>
        <div className="modal-content">
          <PostForm 
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={false} // Parent component will handle submitting state
            submitButtonText={mode === 'edit' ? 'Lưu thay đổi' : 'Đăng bài'}
          />
        </div>
      </div>
    </div>
  );
};

export default PostModal;
