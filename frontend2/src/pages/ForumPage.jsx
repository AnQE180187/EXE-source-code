
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, createPost, updatePost, deletePost } from '../services/forumService';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ThumbsUp, Plus, Edit } from 'lucide-react';
import { Trash } from 'lucide-react';
import ForumDetailModal from './ForumDetailModal';
import PostModal from './PostModal';
import './ForumPage.css';

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

const ForumPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [detailPostId, setDetailPostId] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTag) params.tag = activeTag;
      let data = await getPosts(params);
      if (activeTag) {
        const at = activeTag.toLowerCase();
        data = data.filter(p => (p.forumTags || []).some(ft => (ft.tag?.name || '').toLowerCase() === at));
      }
      setPosts(data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  }, [activeTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, sortOrder]);

  const handleTagClick = (tagName) => {
    setActiveTag(tagName === activeTag ? null : tagName);
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setIsPostModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setIsPostModalOpen(true);
  };

  const handleModalClose = () => {
    setIsPostModalOpen(false);
    setEditingPost(null);
  };

  const handleFormSubmit = async (data, postId) => {
    try {
      if (postId) {
        await updatePost(postId, data);
      } else {
        await createPost(data);
      }
      fetchPosts();
    } catch (err) {
      setError(err.toString());
    }
  };

  const handleDeleteClick = (postId) => {
    setDeletePostId(postId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(deletePostId);
      fetchPosts();
      setShowDeleteModal(false);
      setDeletePostId(null);
    } catch (err) {
      setError(err.toString());
      setShowDeleteModal(false);
      setDeletePostId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePostId(null);
  };

  return (
    <>
      {detailPostId && <ForumDetailModal postId={detailPostId} onClose={() => setDetailPostId(null)} />}
      <PostModal 
        isOpen={isPostModalOpen}
        onClose={handleModalClose}
        onComplete={handleFormSubmit}
        initialData={editingPost}
      />

      <div className="forum-page-container">
        <div className="fp-header">
          <h1>Diễn đàn cộng đồng</h1>
          <p>Nơi chia sẻ, hỏi đáp và tìm bạn đồng hành cho các sự kiện sắp tới.</p>
        </div>

        <div className="fp-controls">
          <div className="fp-sort-buttons">
              <button className={sortOrder === 'newest' ? 'active' : ''} onClick={() => setSortOrder('newest')}>Mới nhất</button>
              <button className={sortOrder === 'popular' ? 'active' : ''} onClick={() => setSortOrder('popular')}>Phổ biến</button>
              {activeTag && (
                <button className="fp-active-tag" onClick={() => setActiveTag(null)}>Tag: {activeTag} ×</button>
              )}
          </div>
          <button onClick={handleOpenCreateModal} className="fp-create-button">
              <Plus size={20}/>
              <span>Tạo bài viết</span>
          </button>
        </div>

        <div className="fp-post-list">
          {loading ? (
            <p className="fp-message">Đang tải bài viết...</p>
          ) : error ? (
            <p className="fp-message fp-message--error">{error}</p>
          ) : posts.length > 0 ? (
            posts.map(post => ( 
              <PostCard 
                key={post.id} 
                post={post} 
                onPostSelect={setDetailPostId} 
                onEditSelect={handleOpenEditModal}
                currentUserId={user?.sub}
                onDelete={handleDeleteClick}
                onTagClick={handleTagClick}
              />
            ))
          ) : (
            <div className="fp-no-results">
              <h3>Chưa có bài viết nào</h3>
              <p>Hãy là người đầu tiên bắt đầu một cuộc thảo luận mới!</p>
            </div>
          )}
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fp-modal-overlay">
              <div className="fp-modal">
                <h2>Xác nhận xóa bài viết</h2>
                <p>Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
                <div className="fp-modal-actions">
                  <button className="fp-btn fp-btn--danger" onClick={handleConfirmDelete}>Xóa</button>
                  <button className="fp-btn fp-btn--secondary" onClick={handleCancelDelete}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// PostCard component
const PostCard = ({ post, onPostSelect, onEditSelect, currentUserId, onDelete, onTagClick }) => {
  return (
    <div className="fp-card">
      <div className="fp-card-author">
        <img 
          src={post.author?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${post.author?.email}`}
          alt={post.author?.profile?.displayName || 'Avatar'}
          className="fp-author-avatar"
        />
      </div>
      <div className="fp-card-main" onClick={() => onPostSelect(post.id)}>
        <h3 className="fp-card-title">{post.title}</h3>
        <div className="fp-card-meta">
          <p className="fp-author-info">
            <span className="fp-author-name">{post.author?.profile?.displayName || 'Người dùng'}</span>
            <span className="fp-time-ago">· {timeSince(post.createdAt)}</span>
          </p>
          <div className="fp-card-tags">
            {post.forumTags?.map(({ tag }) => (
              <button key={tag.id} className="fp-tag" onClick={(e) => { e.stopPropagation(); onTagClick?.(tag.name); }}>{tag.name}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="fp-card-stats">
        <div className="fp-stat-item">
          <ThumbsUp size={16} />
          <span>0</span>
        </div>
        <div className="fp-stat-item">
          <MessageSquare size={16} />
          <span>{post._count?.comments || 0}</span>
        </div>
        {currentUserId === post.authorId && (
          <>
            <button className="fp-edit-btn" onClick={() => onEditSelect(post)}><Edit size={16}/></button>
            <button className="fp-delete-btn" onClick={() => onDelete(post.id)} style={{marginLeft: 8, color: 'red', background: 'none', border: 'none', cursor: 'pointer'}} title="Xóa bài viết">
              <Trash size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForumPage;