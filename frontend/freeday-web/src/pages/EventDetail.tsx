import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@/components/common/Button';

const MOCK_EVENT = {
  id: 'e1',
  title: 'Hiking Bà Nà',
  description: 'Cùng nhau khám phá Bà Nà Hills cuối tuần này! Đăng ký ngay để tham gia hành trình thú vị, kết nối bạn mới và tận hưởng thiên nhiên.',
  type: 'outdoor',
  vibe: 'khám phá',
  location: { address: 'Bà Nà Hills, Đà Nẵng', lat: 16.021, lng: 108.031 },
  startTime: '2024-06-10T07:00:00Z',
  endTime: '2024-06-10T18:00:00Z',
  price: 0,
  capacity: 20,
  availableSlots: 5,
  imageUrls: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb'],
  organizer: { id: 'u1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/100?img=5' },
  isFeatured: true,
  tags: ['miễn phí', 'khám phá', 'outdoor'],
  weatherTip: 'Mang theo áo mưa, nước uống.',
  participants: [
    { id: 'u2', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: 'u3', name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/100?img=3' }
  ]
};

const MOCK_COMMENTS = [
  { id: 'c1', author: { name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/100?img=2' }, content: 'Sự kiện này tuyệt quá!', createdAt: '2024-06-01T12:00:00Z' },
  { id: 'c2', author: { name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/100?img=3' }, content: 'Mình đã đăng ký, hẹn gặp mọi người!', createdAt: '2024-06-01T13:30:00Z' }
];

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = () => {
    setRegistered(true);
  };

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
    <main className="flex-1 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-8 border border-neutral-100">
        {/* Ảnh bìa */}
        <div className="w-full h-56 rounded-2xl overflow-hidden mb-4">
          <img src={MOCK_EVENT.imageUrls[0]} alt={MOCK_EVENT.title} className="w-full h-full object-cover" />
        </div>
        {/* Thông tin sự kiện */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">{MOCK_EVENT.title}</h1>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="badge badge-primary">{MOCK_EVENT.type}</span>
            <span className="badge badge-accent">{MOCK_EVENT.vibe}</span>
            {MOCK_EVENT.isFeatured && <span className="badge badge-warning">Nổi bật</span>}
            {MOCK_EVENT.tags.map(tag => <span key={tag} className="badge badge-neutral">{tag}</span>)}
          </div>
          <div className="text-neutral-700 mb-2">{MOCK_EVENT.description}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600 mb-2">
            <div><b>Địa điểm:</b> {MOCK_EVENT.location.address}</div>
            <div><b>Thời gian:</b> {new Date(MOCK_EVENT.startTime).toLocaleString()} - {new Date(MOCK_EVENT.endTime).toLocaleString()}</div>
            <div><b>Giá vé:</b> {MOCK_EVENT.price === 0 ? 'Miễn phí' : MOCK_EVENT.price + '₫'}</div>
            <div><b>Số chỗ còn lại:</b> {MOCK_EVENT.availableSlots}/{MOCK_EVENT.capacity}</div>
            {MOCK_EVENT.weatherTip && <div className="md:col-span-2"><b>Lưu ý thời tiết:</b> {MOCK_EVENT.weatherTip}</div>}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <img src={MOCK_EVENT.organizer.avatar} alt={MOCK_EVENT.organizer.name} className="w-8 h-8 rounded-full" />
            <span className="text-sm">Tổ chức bởi <b>{MOCK_EVENT.organizer.name}</b></span>
          </div>
          <Button className="btn-primary w-full mt-2" onClick={handleRegister} disabled={registered || MOCK_EVENT.availableSlots === 0}>
            {registered ? 'Đã đăng ký' : MOCK_EVENT.availableSlots === 0 ? 'Đã đủ người' : 'Đăng ký tham gia'}
          </Button>
        </div>
        {/* Danh sách người tham gia */}
        <div>
          <div className="font-semibold mb-2 text-primary-700">Người tham gia ({MOCK_EVENT.participants.length})</div>
          <div className="flex flex-wrap gap-3">
            {MOCK_EVENT.participants.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-neutral-100 rounded-full px-3 py-1">
                <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full" />
                <span className="text-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Bình luận */}
        <div>
          <div className="font-semibold mb-2 text-primary-700">Bình luận ({comments.length})</div>
          <div className="space-y-4 mb-4">
            {comments.map(c => (
              <div key={c.id} className="flex items-start gap-3">
                <img src={c.author.avatar} alt={c.author.name} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="font-medium">{c.author.name}</div>
                  <div className="text-neutral-600 text-xs mb-1">{new Date(c.createdAt).toLocaleString()}</div>
                  <div className="text-neutral-800">{c.content}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleComment} className="flex items-center gap-3">
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
  );
};

export default EventDetail; 