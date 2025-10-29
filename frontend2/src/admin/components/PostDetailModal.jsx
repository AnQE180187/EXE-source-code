import React, { useEffect, useState, useCallback } from 'react';
import { getPostById } from '../../services/forumService';
import { X, User, Calendar } from 'lucide-react';
import './PostDetailModal.css';

const PostDetailModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPostById(postId);
      setPost(data);
    } catch (err) {
      setError('Không thể tải chi tiết bài viết.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  if (!postId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container post-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi Tiết Bài Viết</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={24} /></button>
        </div>
        <div className="modal-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p>{error}</p>
          ) : post && (
            <>
              <div className="post-author-section">
                <img src={post.author?.profile?.avatarUrl || 'https://via.placeholder.com/48'} alt="author avatar" />
                <div className="post-author-info">
                  <strong>{post.author?.profile?.displayName || 'N/A'}</strong>
                  <span>Đăng vào {new Date(post.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>

              <div className="post-full-content">
                <h1>{post.title}</h1>
                <p>{post.content}</p>
              </div>

              <div className="comments-section">
                <h3>Bình luận ({post.comments?.length || 0})</h3>
                {post.comments?.length > 0 ? (
                  post.comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <img src={comment.author?.profile?.avatarUrl || 'https://via.placeholder.com/36'} alt="commenter avatar" />
                      <div className="comment-body">
                        <p>{comment.content}</p>
                        <div className="comment-meta">
                          <strong>{comment.author?.profile?.displayName || 'N/A'}</strong>
                          <span> · {new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Chưa có bình luận nào.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
