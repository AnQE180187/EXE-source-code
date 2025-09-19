import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { forumService } from '@/services/forumService';

// Define a type for the post object, can be expanded later
interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    email: string;
    profile?: {
      displayName?: string;
      avatarUrl?: string;
    };
  };
  tags: { tag: { id: string; name: string; } }[];
  createdAt: string;
  _count: {
    comments: number;
    likes: number;
  };
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Pass params to the service for backend filtering
        const response = await forumService.getPosts({ search: searchTerm });
        setPosts(response.data);
      } catch (err) {
        setError('Không thể tải bài viết.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search input
    const timerId = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const PostCard: React.FC<{ post: Post }> = ({ post }) => (
    <div className="card p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start space-x-4">
        {post.author?.profile?.avatarUrl ? (
          <img
            src={post.author.profile.avatarUrl}
            alt={post.author.profile.displayName || post.author.email}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
            <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                <Link to={`/forum/${post.id}`} className="hover:text-primary-600 transition-colors">
                  {post.title}
                </Link>
              </h3>
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <span>{post.author?.profile?.displayName || post.author?.email}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
          <p className="text-neutral-600 mb-4 line-clamp-2">
            {post.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-sm text-neutral-600">
                <svg className="w-4 h-4" fill='none' stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post._count?.likes ?? 0}</span>
              </span>
              <Link to={`/forum/${post.id}`} className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post._count?.comments ?? 0}</span>
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tagJoin) => (
                <span key={tagJoin.tag.id} className="badge badge-neutral text-xs">
                  #{tagJoin.tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Diễn đàn kết nối
        </h1>
        <p className="text-lg text-neutral-600">
          Tìm bạn đồng hành và chia sẻ trải nghiệm
        </p>
      </div>

      <div className="lg:col-span-3">
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
            <Link to="/forum/create">
              <Button className="w-full md:w-auto">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Đăng bài mới
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <p>Đang tải bài viết...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-neutral-600">Không có bài viết nào khớp với tìm kiếm của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum; 