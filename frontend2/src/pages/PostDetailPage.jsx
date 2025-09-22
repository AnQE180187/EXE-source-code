import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPostById, deletePost } from '../services/forumService';
import Modal from '../components/ui/Modal';
import CommentForm from '../components/common/CommentForm';
import CommentList from '../components/common/CommentList';
import './PostDetailPage.css';
import '../components/ui/Button.css';

const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const postData = await getPostById(id);
      setPost(postData);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate('/forum');
    } catch (err) {
      setError('Không thể xóa bài viết.');
      setIsDeleteModalOpen(false);
    }
  };

  const handleCommentPosted = (newComment) => {
    setPost(prevPost => ({
      ...prevPost,
      comments: [newComment, ...(prevPost.comments || [])]
    }));
  };

  if (loading) return <div className="loading-message">Đang tải bài viết...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="no-results">Không tìm thấy bài viết.</div>;

  const isAuthor = user && user.sub === post.authorId;

  return (
    <>
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa bài viết"
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</p>
      </Modal>

      <div className="post-detail-page">
        <div className="post-detail__header">
          <h1 className="post-detail__title">{post.title}</h1>
          <div className="post-detail__meta">
            <img 
              src={post.author.profile?.avatarUrl || `https://i.pravatar.cc/150?u=${post.author.id}`}
              alt={post.author.profile?.displayName}
              className="author-avatar"
            />
            <div>
              <span className="author-name">{post.author.profile?.displayName}</span>
              <span className="post-date">{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
            </div>
            {isAuthor && (
              <div className="post-actions">
                <Link to={`/forum/${id}/edit`} className="button button--ghost">Chỉnh sửa</Link>
                <button onClick={() => setIsDeleteModalOpen(true)} className="button button--danger">Xóa</button>
              </div>
            )}
          </div>
        </div>

        <div className="post-detail__content">
          {post.content}
        </div>

        <div className="post-detail__comments">
          <h2>Bình luận ({post.comments?.length || 0})</h2>
          <CommentForm postId={id} onCommentPosted={handleCommentPosted} />
          <CommentList comments={post.comments} />
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;