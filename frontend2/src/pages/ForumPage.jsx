import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/forumService';
import { MessageSquare, ThumbsUp, Plus } from 'lucide-react';
import ForumDetailModal from './ForumDetailModal'; // Import the modal
import './ForumPage.css';

// Helper to format time since post was created
const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return Math.floor(seconds) + " giây trước";
};

const PostCard = ({ post, onPostSelect }) => (
    <div className="fp-card" onClick={() => onPostSelect(post.id)}>
        <div className="fp-card__stats">
            <div className="fp-stat">
                <span>{post._count?.comments || 0}</span>
                <MessageSquare size={20} />
            </div>
            {/* Placeholder for likes */}
            <div className="fp-stat">
                <span>0</span>
                <ThumbsUp size={20} />
            </div>
        </div>
        <div className="fp-card__main">
            <h3 className="fp-card__title">{post.title}</h3>
            <div className="fp-card__meta">
                <div className="fp-card__tags">
                    {post.tags?.map(({ tag }) => (
                        <span key={tag.id} className="fp-card__tag">{tag.name}</span>
                    ))}
                </div>
                <p className="fp-card__author-time">
                    đăng bởi <span className="author-name">{post.author?.profile?.displayName || 'Người dùng'}</span>
                    <span className="time-ago">{timeSince(post.createdAt)}</span>
                </p>
            </div>
        </div>
        <div className="fp-card__author-avatar">
            <img 
                src={post.author?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${post.author?.email}`}
                alt={post.author?.profile?.displayName || 'Avatar'}
            />
        </div>
    </div>
);

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sortOrder]);

  return (
    <>
      {selectedPostId && <ForumDetailModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />}
      <div className="forum-page-container">
        <div className="fp-header">
          <h1>Diễn đàn cộng đồng</h1>
          <p>Nơi chia sẻ, hỏi đáp và tìm bạn đồng hành cho các sự kiện sắp tới.</p>
        </div>

        <div className="fp-controls">
          <div className="fp-sort-buttons">
              <button className={sortOrder === 'newest' ? 'active' : ''} onClick={() => setSortOrder('newest')}>Mới nhất</button>
              <button className={sortOrder === 'popular' ? 'active' : ''} onClick={() => setSortOrder('popular')}>Phổ biến</button>
          </div>
          <Link to="/forum/create" className="fp-create-button">
              <Plus size={20}/>
              <span>Tạo bài viết</span>
          </Link>
        </div>

        <div className="fp-post-list">
          {loading ? (
            <p className="fp-message">Đang tải bài viết...</p>
          ) : error ? (
            <p className="fp-message fp-message--error">{error}</p>
          ) : posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} onPostSelect={setSelectedPostId} />)
          ) : (
            <div className="fp-no-results">
              <h3>Chưa có bài viết nào</h3>
              <p>Hãy là người đầu tiên bắt đầu một cuộc thảo luận mới!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForumPage;