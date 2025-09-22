import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { createComment } from '../../services/commentService';
import { Link } from 'react-router-dom';
import './Comment.css';
import '../../styles/form.css';
import '../ui/Button.css';

const CommentForm = ({ postId, onCommentPosted }) => {
  const { isAuthenticated, user } = useAuth();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setError(null);
    try {
      const newComment = await createComment(postId, data);
      reset();
      onCommentPosted(newComment);
    } catch (err) {
      setError(err.toString());
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="comments-login-prompt">
        <p>Vui lòng <Link to={`/login?redirect=/forum/${postId}`}>đăng nhập</Link> để để lại bình luận.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="comment-form">
       <img 
          src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.sub}`}
          alt={user.name}
          className="comment-avatar"
        />
      <div className="comment-form__content">
        <textarea 
          {...register('content', { required: true })}
          className="form-input"
          placeholder="Viết bình luận của bạn..."
          rows={3}
        />
        {error && <p className="form-error">{error}</p>}
        <div className="comment-form__actions">
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
