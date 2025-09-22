import React from 'react';
import './Comment.css';

const CommentItem = ({ comment }) => (
  <div className="comment-item">
    <img 
      src={comment.author.profile?.avatarUrl || `https://i.pravatar.cc/150?u=${comment.author.id}`}
      alt={comment.author.profile?.displayName}
      className="comment-avatar"
    />
    <div className="comment-content">
      <div className="comment-header">
        <span className="comment-author">{comment.author.profile?.displayName || 'Người dùng ẩn danh'}</span>
        <span className="comment-date">{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
      </div>
      <p className="comment-body">{comment.content}</p>
    </div>
  </div>
);

export default CommentItem;
