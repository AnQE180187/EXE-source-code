import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPostById } from '../services/forumService';
import { createComment } from '../services/commentService';
import { X, Send } from 'lucide-react';
import './ForumDetailModal.css';

// Time-ago utility
const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "vài giây trước";
    const intervals = {
        năm: 31536000,
        tháng: 2592000,
        ngày: 86400,
        giờ: 3600,
        phút: 60,
    };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = seconds / secondsInUnit;
        if (interval > 1) return Math.floor(interval) + ` ${unit} trước`;
    }
    return Math.floor(seconds) + " giây trước";
};

const Comment = ({ comment }) => (
    <div className="fdm-comment">
        <img 
            src={comment.author.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${comment.author.profile?.displayName}`}
            alt={comment.author.profile?.displayName}
            className="fdm-comment-avatar"
        />
        <div className="fdm-comment-body">
            <p className="fdm-comment-author">
                {comment.author.profile?.displayName}
                <span className="fdm-comment-time">{timeSince(comment.createdAt)}</span>
            </p>
            <p className="fdm-comment-content">{comment.content}</p>
        </div>
    </div>
);

const ForumDetailModal = ({ postId, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPostDetails = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const postData = await getPostById(postId);
      setPost(postData);
      setComments(postData.comments || []);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
        const createdComment = await createComment(postId, { content: newComment });
        setComments(prev => [createdComment, ...prev]);
        setNewComment('');
    } catch (err) {
        setError('Không thể gửi bình luận.');
    } finally {
        setIsSubmitting(false);
    }
  }

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fdm-overlay" onClick={onClose}>
      <div className="fdm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fdm-close-btn" onClick={onClose}><X size={24} /></button>
        
        {loading ? (
            <p>Đang tải...</p>
        ) : error ? (
            <p>{error}</p>
        ) : post && (
            <div className="fdm-content">
                {/* Header */}
                <div className="fdm-header">
                    <h1 className="fdm-title">{post.title}</h1>
                    <div className="fdm-author-info">
                        <img 
                            src={post.author.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${post.author.profile?.displayName}`}
                            alt={post.author.profile?.displayName}
                            className="fdm-author-avatar"
                        />
                        <div>
                            <p className="fdm-author-name">{post.author.profile?.displayName}</p>
                            <p className="fdm-post-time">Đăng vào {new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="fdm-tags" style={{ marginTop: '8px', marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {post.forumTags?.map(({ tag }) => (
                        <span key={tag.id} className="fp-tag">{tag.name}</span>
                    ))}
                </div>

                {/* Content */}
                <div className="fdm-post-body" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />

                {/* Comments */}
                <div className="fdm-comments-section">
                    <h2 className="fdm-section-title">Bình luận ({comments.length})</h2>
                    {isAuthenticated ? (
                        <form className="fdm-comment-form" onSubmit={handlePostComment}>
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                rows="3"
                            />
                            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang gửi...' : <Send size={18}/>}</button>
                        </form>
                    ) : (
                        <p className="fdm-login-prompt">Vui lòng <Link to={`/login?redirect=/forum`}>đăng nhập</Link> để bình luận.</p>
                    )}
                    <div className="fdm-comment-list">
                        {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ForumDetailModal;
