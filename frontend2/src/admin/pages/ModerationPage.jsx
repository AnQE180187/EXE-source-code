import React, { useEffect, useState, useCallback } from 'react';
import { Search, Filter, Eye, EyeOff, MessageSquare, User, Clock, Trash2 } from 'lucide-react';
import { getAdminPosts, updateAdminPostStatus, deleteAdminPost } from '../../services/postAdminService';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../components/common/Toast';
import PostDetailModal from '../components/PostDetailModal'; // Import the new modal
import './AdminPages.css';

const ModerationPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const toast = useToast();

  // State for detail modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingPostId, setViewingPostId] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchTerm || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      };
      const response = await getAdminPosts(params);
      setPosts(response.data || []);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (err) {
      setError('Không thể tải danh sách bài viết.');
      toast.error(err.message || 'Lỗi không xác định.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchTerm, statusFilter, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleStatusUpdate = async (postId, newStatus) => {
    const originalPosts = [...posts];
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: newStatus } : post
    ));

    try {
      await updateAdminPostStatus(postId, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      setError('Cập nhật trạng thái thất bại. Đang hoàn tác...');
      setPosts(originalPosts);
      toast.error(error.message || 'Lỗi không xác định.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này? Hành động này không thể hoàn tác.')) {
      return;
    }

    try {
      await deleteAdminPost(postId);
      setPosts(posts.filter(p => p.id !== postId));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      toast.success('Bài viết đã được xóa thành công!');
    } catch (error) {
      toast.error(error.message || 'Xóa bài viết thất bại.');
    }
  };

  const handleViewDetails = (postId) => {
    setViewingPostId(postId);
    setIsDetailModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (totalPages <= 1) return null;

    return (
      <div className="ap-pagination">
        <button 
          onClick={() => handlePageChange(pagination.page - 1)} 
          disabled={pagination.page <= 1}
        >
          Trước
        </button>
        <span>Trang {pagination.page} / {totalPages}</span>
        <button 
          onClick={() => handlePageChange(pagination.page + 1)} 
          disabled={pagination.page >= totalPages}
        >
          Sau
        </button>
      </div>
    );
  };

  if (error && !posts.length) return <div className="ap-error">{error}</div>;

  return (
    <>
      <PostDetailModal 
        postId={viewingPostId} 
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingPostId(null);
        }}
      />
      <div className="ap-wrap">
        <div className="ap-toolbar">
          <h1 className="ap-title">Quản Lý Bài Viết Diễn Đàn</h1>
        </div>

        <div className="ap-card">
          <div className="ap-card__header">
            <h3 className="ap-card__title">Tất cả bài viết ({pagination.total})</h3>
            <p className="ap-card__desc">Xem xét và quản lý các bài viết trên diễn đàn.</p>
          </div>
          <div className="ap-card__body">
            <div className="ap-filters">
              <div className="ap-search">
                <Search size={16} className="ap-search__icon" />
                <input 
                  placeholder="Tìm kiếm theo tiêu đề, nội dung, tác giả..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="ap-filter-group">
                <label className="ap-filter-label">Trạng Thái</label>
                <select 
                  className="ap-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất Cả</option>
                  <option value="VISIBLE">Hiển Thị</option>
                  <option value="HIDDEN">Đã Ẩn</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="ap-loading">Đang tải bài viết...</div>
            ) : (
              <>
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>Bài Viết</th>
                      <th>Tác Giả</th>
                      <th>Ngày Đăng</th>
                      <th>Trạng Thái</th>
                      <th>Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <MessageSquare size={20} style={{ flexShrink: 0, color: 'var(--muted)' }}/>
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--ink)', marginBottom: '0.25rem' }}>
                                {post.title}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {post.content}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={16} style={{color: 'var(--muted)'}}/>
                            <div>
                              <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                                {post.author?.profile?.displayName || 'N/A'}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                                {post.author?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={14} style={{color: 'var(--muted)'}}/>
                            <span>{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`ap-badge ${post.status === 'VISIBLE' ? 'ap-badge--success' : 'ap-badge--warning'}`}>
                            {post.status === 'VISIBLE' ? 'Hiển Thị' : 'Đã Ẩn'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="ap-btn ap-btn--outline ap-btn--sm"
                              onClick={() => handleViewDetails(post.id)}
                              title="Xem chi tiết bài viết"
                            >
                              <Eye size={14} />
                            </button>
                            {post.status === 'VISIBLE' ? (
                              <button 
                                className="ap-btn ap-btn--warning ap-btn--sm"
                                onClick={() => handleStatusUpdate(post.id, 'HIDDEN')}
                                title="Ẩn bài viết"
                              >
                                <EyeOff size={14} />
                              </button>
                            ) : (
                              <button 
                                className="ap-btn ap-btn--success ap-btn--sm"
                                onClick={() => handleStatusUpdate(post.id, 'VISIBLE')}
                                title="Hiển thị bài viết"
                              >
                                <Eye size={14} />
                              </button>
                            )}
                            <button 
                              className="ap-btn ap-btn--danger ap-btn--sm"
                              onClick={() => handleDeletePost(post.id)}
                              title="Xóa vĩnh viễn bài viết"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModerationPage;

