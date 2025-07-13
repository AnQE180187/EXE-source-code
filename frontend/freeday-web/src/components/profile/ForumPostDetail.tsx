import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@/components/common/Button';

// Mock data
const mockPost = {
  id: '1',
  title: 'Tìm bạn đi hiking Bà Nà cuối tuần',
  content: 'Mình muốn tìm 2-3 bạn cùng đi hiking Bà Nà vào thứ 7 tuần này. Ai hứng thú join nhé! Mang theo nước và đồ ăn nhẹ.',
  author: {
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/100?img=1',
  },
  createdAt: '2024-06-01T10:00:00Z',
};

const mockComments = [
  {
    id: 'c1',
    author: { name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/100?img=2' },
    content: 'Cho mình join với nhé!',
    createdAt: '2024-06-01T12:00:00Z',
  },
  {
    id: 'c2',
    author: { name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/100?img=3' },
    content: 'Mình cũng muốn tham gia, inbox mình nhé.',
    createdAt: '2024-06-01T13:30:00Z',
  },
];

const ForumPostDetail: React.FC = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState(mockComments);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setComments([
        ...comments,
        {
          id: `c${comments.length + 1}`,
          author: { name: 'Bạn', avatar: 'https://i.pravatar.cc/100?img=4' },
          content: comment,
          createdAt: new Date().toISOString(),
        },
      ]);
      setComment('');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <main className="flex-1 flex flex-col items-center py-10 px-2">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-8 border border-neutral-100">
          {/* Post info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 text-primary-700">{mockPost.title}</h1>
            <div className="flex items-center mb-4 gap-3">
              <img src={mockPost.author.avatar} alt={mockPost.author.name} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-semibold">{mockPost.author.name}</div>
                <div className="text-neutral-500 text-sm">{new Date(mockPost.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="text-neutral-700 leading-relaxed mb-2">{mockPost.content}</div>
          </div>
          {/* Comments */}
          <div className="bg-neutral-50 rounded-xl shadow-soft p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Bình luận ({comments.length})</h2>
            <div className="space-y-6 mb-6">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start space-x-3">
                  <img src={c.author.avatar} alt={c.author.name} className="w-9 h-9 rounded-full" />
                  <div>
                    <div className="font-medium">{c.author.name}</div>
                    <div className="text-neutral-600 text-sm mb-1">{new Date(c.createdAt).toLocaleString()}</div>
                    <div className="text-neutral-800">{c.content}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Comment form */}
            <form onSubmit={handleComment} className="flex items-center space-x-3">
              <input
                type="text"
                className="flex-1 border border-neutral-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder="Viết bình luận..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" className="btn-primary" disabled={loading || !comment.trim()}>
                {loading ? 'Đang gửi...' : 'Gửi'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForumPostDetail; 