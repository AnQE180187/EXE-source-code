import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { eventsAPI } from '@/services/api';
import { useDebounce } from '../hooks/useDebounce';

// Define types for consistency
interface Event {
  id: string;
  title: string;
  description: string;
  startAt: string;
  image: string;
  price: number;
  _count: {
    registeredCount?: number;
    favoritesCount?: number;
  };
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Khám phá sự kiện
        </h1>
        <p className="text-lg text-neutral-600">Tìm kiếm và tham gia các sự kiện thú vị</p>
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900 truncate">{event.title}</h3>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-neutral-700">
                    <span className="font-bold text-primary-600">{typeof event.price === 'number' ? (event.price === 0 ? 'Miễn phí' : `${event.price.toLocaleString()}đ`) : 'Thương lượng'}</span>
                    <span>{new Date(event.startAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </Link>
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
