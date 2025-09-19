import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import Button from '@/components/common/Button';

// Define the shape of an organized event
interface OrganizedEvent {
  id: string;
  title: string;
  status: 'Draft' | 'Published' | 'Closed' | 'Cancelled';
  startAt: string;
  _count: {
    registrations: number;
  };
}

const EventManagement: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [events, setEvents] = useState<OrganizedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let eventsData: OrganizedEvent[] = [];
        if (user?.role === 'admin') {
          // Admin lấy toàn bộ sự kiện
          const res = await userAPI.getAllEvents(); // cần API trả về toàn bộ events
          eventsData = res.data.data.events || [];
        } else if (user?.role === 'organizer') {
          // Organizer chỉ lấy sự kiện mình tổ chức
          const res = await userAPI.getEvents();
          eventsData = res.data.data.organized || [];
        }
        setEvents(eventsData);
      } catch (err) {
        setError('Không thể tải danh sách sự kiện.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const getStatusBadge = (status: OrganizedEvent['status']) => {
    switch (status) {
      case 'Published': return 'badge-primary';
      case 'Draft': return 'badge-secondary';
      case 'Closed': return 'badge-accent';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  if (loading) {
    return <div className="text-center py-20">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Quản lý sự kiện</h1>
          <p className="text-neutral-500 mt-1">{user?.role === 'admin' ? 'Quản lý toàn bộ sự kiện trong hệ thống.' : 'Xem, sửa và quản lý các sự kiện bạn đã tạo.'}</p>
        </div>
        {(user?.role === 'organizer' || user?.role === 'admin') && (
          <Button onClick={() => navigate('/events/new')}>Tạo sự kiện mới</Button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-700">Bạn chưa tạo sự kiện nào</h3>
          <p className="text-neutral-500 my-2">Hãy bắt đầu tạo sự kiện đầu tiên của bạn!</p>
          <Button onClick={() => navigate('/events/new')} className="mt-4">Bắt đầu tạo</Button>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Sự kiện</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Lượt đăng ký</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-900">{event.title}</div>
                    <div className="text-sm text-neutral-500">{new Date(event.startAt).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(event.status)}`}>{event.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {event._count?.registrations ?? 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link to={`/events/${event.id}`} className="text-primary-600 hover:text-primary-900">Xem trang</Link>
                    {(user?.role === 'admin' || user?.role === 'organizer') && (
                      <Link to={`/events/edit/${event.id}`} className="text-indigo-600 hover:text-indigo-900">Sửa</Link>
                    )}
                    {(user?.role === 'admin' || user?.role === 'organizer') && (
                      <Button variant="danger" size="sm" onClick={() => {/* TODO: handleDelete(event.id) */}}>
                        Xóa
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventManagement; 