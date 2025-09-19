import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '@/services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/common/useToast';

// Define types for consistency
interface Event {
  id: string;
  title: string;
  description: string;
  startAt: string;
  image: string;
  price: number;
  organizerId: string;
  organizer?: {
    id: string;
    name: string;
  };
  _count: {
    registeredCount?: number;
    favoritesCount?: number;
  };
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const toast = useToast();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('all');
  // Note: Type and Vibe filters are not supported by backend yet, so they are for UI only for now.
  const [selectedType, setSelectedType] = useState('all');
  const [selectedVibe, setSelectedVibe] = useState('all');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }
      if (selectedPrice !== 'all') {
        params.price = selectedPrice;
      }
      // Not sending type/vibe as backend does not support them yet.

      const response = await eventsAPI.getAll(params);
      setEvents(response.data);
    } catch (err) {
      setError('Không thể tải danh sách sự kiện.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedPrice]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sự kiện "${eventTitle}"?`)) {
      return;
    }
    
    try {
      await eventsAPI.delete(eventId);
      toast.showToast('Xóa sự kiện thành công!', 'success');
      // Refresh the events list
      fetchEvents();
    } catch (error) {
      toast.showToast('Xóa sự kiện thất bại!', 'error');
      console.error('Error deleting event:', error);
    }
  };

  // Check if user can manage an event (either owner or admin)
  const canManageEvent = (event: Event): boolean => {
    if (!user) return false;
    return user.role === 'admin' || event.organizerId === user.id;
  };

  // Hardcoded filters for UI, as before
  const eventTypes = [{ id: 'all', name: 'Tất cả' }, { id: 'music', name: 'Âm nhạc' }];
  const vibes = [{ id: 'all', name: 'Tất cả' }, { id: 'energetic', name: 'Năng động' }];
  const priceRanges = [
    { id: 'all', name: 'Tất cả' },
    { id: 'free', name: 'Miễn phí' },
    { id: 'low', name: 'Dưới 100k' },
    { id: 'medium', name: '100k - 500k' },
    { id: 'high', name: 'Trên 500k' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
              Khám phá sự kiện
            </h1>
            <p className="text-lg text-neutral-600">Tìm kiếm và tham gia các sự kiện thú vị</p>
          </div>
          
          {user && (user.role === 'organizer' || user.role === 'admin') && (
            <div className="flex gap-2">
              <Link 
                to="/events/create" 
                className="btn btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo sự kiện
              </Link>
              {user.role === 'organizer' && (
                <Link 
                  to="/events/manage" 
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Quản lý
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Tìm kiếm</label>
            <input
              type="text"
              placeholder="Tìm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Loại sự kiện</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="input">
              {eventTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Vibe</label>
            <select value={selectedVibe} onChange={(e) => setSelectedVibe(e.target.value)} className="input">
              {vibes.map((vibe) => <option key={vibe.id} value={vibe.id}>{vibe.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Mức giá</label>
            <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} className="input">
              {priceRanges.map((range) => <option key={range.id} value={range.id}>{range.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div key={event.id} className="card card-hover overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <Link to={`/events/${event.id}`} className="block">
                <div className="h-48 relative overflow-hidden">
                  <img src={event.image || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23e2e8f0'/%3E%3C/svg%3E`} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                </div>
              </Link>
              
              <div className="p-6">
                <Link to={`/events/${event.id}`} className="block mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900 truncate hover:text-primary-600 transition-colors">{event.title}</h3>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-neutral-700">
                    <span className="font-bold text-primary-600">{typeof event.price === 'number' ? (event.price === 0 ? 'Miễn phí' : `${event.price.toLocaleString()}đ`) : 'Thương lượng'}</span>
                    <span>{new Date(event.startAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </Link>
                
                {/* Management buttons for ORGANIZER/ADMIN */}
                {canManageEvent(event) && (
                  <div className="flex gap-2 pt-4 border-t border-neutral-200">
                    <Link 
                      to={`/events/${event.id}/edit`}
                      className="flex-1 btn btn-secondary btn-sm flex items-center justify-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Sửa
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event.id, event.title);
                      }}
                      className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-1 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      { !loading && events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Không tìm thấy sự kiện</h3>
          <p className="text-neutral-600">Vui lòng thử lại với bộ lọc khác.</p>
        </div>
      )}
    </div>
  );
};

export default Events;
