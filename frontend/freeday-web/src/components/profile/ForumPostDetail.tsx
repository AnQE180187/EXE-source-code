import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import { forumService } from '@/services/forumService';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/common/useToast';

// Define types for Post and Comment
interface Author {
  name: string;
  avatar?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
}

const ForumPostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuthStore();
  const toast = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const [postRes, commentsRes] = await Promise.all([
        forumService.getPostById(postId),
        forumService.getCommentsByPostId(postId),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      setError('Không thể tải bài viết này.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !postId) return;

    setIsSubmitting(true);
    try {
      const response = await forumService.createComment(postId, { content: newComment });
      // Add the new comment to the list instantly
      setComments(prevComments => [response.data, ...prevComments]);
      setNewComment(''); // Clear the input
      toast.showToast('Đã gửi bình luận', 'success');
    } catch (err) {
      toast.showToast('Gửi bình luận thất bại', 'error');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Đang tải bài viết...</div>;
  }

  if (error || !post) {
    return <div className="text-center py-20 text-red-500">{error || 'Không tìm thấy bài viết.'}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Post Content */}
      <div className="card p-8 mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">{post.title}</h1>
        <div className="flex items-center mb-6 gap-3 text-sm">
          <img src={post.author.avatar || `https://i.pravatar.cc/150?u=${post.author.name}`} alt={post.author.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-neutral-700">{post.author.name}</p>
            <p className="text-neutral-500">Đăng vào {new Date(post.createdAt).toLocaleString('vi-VN')}</p>
          </div>
        </div>
        <div className="prose max-w-none text-neutral-700 leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Comments Section */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Bình luận ({comments.length})</h2>
        
        {/* Comment Form */}
        {user && (
          <form onSubmit={handleCommentSubmit} className="flex items-start gap-3 mb-8">
            <img src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <textarea
                rows={3}
                className="input w-full"
                placeholder="Viết bình luận của bạn..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-2">
                <Button type="submit" loading={isSubmitting} disabled={!newComment.trim()}>
                  Gửi bình luận
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <img src={comment.author.avatar || `https://i.pravatar.cc/150?u=${comment.author.name}`} alt={comment.author.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1 bg-neutral-100 rounded-lg p-3">
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold text-sm text-neutral-800">{comment.author.name}</p>
                  <p className="text-xs text-neutral-500">{new Date(comment.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                <p className="text-neutral-700">{comment.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-neutral-500 py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPostDetail; 