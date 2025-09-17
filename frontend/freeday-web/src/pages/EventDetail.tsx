import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { eventsAPI } from '@/services/api';
import { registrationService } from '@/services/registrationService';
import { favoriteService } from '@/services/favoriteService';
import { useToast } from '@/components/common/useToast';

// Define a more detailed Event type for this page
interface EventDetailType {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  locationText: string;
  price: number | null;
  capacity: number | null;
  registeredCount: number;
  image: string; // Assuming a single primary image
  organizer: { id: string; name: string; };
  // These fields should be provided by the backend for the logged-in user
  currentUser: {
    isRegistered: boolean;
    isFavorited: boolean;
  };
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const toast = useToast();

  const [event, setEvent] = useState<EventDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await eventsAPI.getById(id);
      setEvent(response.data);
      // Initialize local state from the API response
      setIsRegistered(response.data.currentUser?.isRegistered || false);
      setIsFavorited(response.data.currentUser?.isFavorited || false);
    } catch (err) {
      setError('Không thể tải được thông tin sự kiện.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleToggleRegistration = async () => {
    if (!user || !id) {
      toast.showToast('Vui lòng đăng nhập để thực hiện hành động này', 'error');
      return;
    }
    setIsSubmitting(true);
    const originalState = isRegistered;
    setIsRegistered(!originalState); // Optimistic update

    try {
      if (originalState) {
        await registrationService.cancelRegistration(id);
        toast.showToast('Đã hủy đăng ký', 'success');
      } else {
        await registrationService.registerForEvent(id);
        toast.showToast('Đăng ký thành công!', 'success');
      }
      fetchEvent(); // Re-fetch to get the latest counts
    } catch (err) {
      setIsRegistered(originalState); // Revert on error
      toast.showToast('Thao tác thất bại, vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !id) {
      toast.showToast('Vui lòng đăng nhập để thực hiện hành động này', 'error');
      return;
    }
    const originalState = isFavorited;
    setIsFavorited(!originalState); // Optimistic update

    try {
      await favoriteService.toggleFavorite(id);
    } catch (err) {
      setIsFavorited(originalState); // Revert on error
      toast.showToast('Thao tác thất bại, vui lòng thử lại.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Đang tải sự kiện...</div>;
  }

  if (error || !event) {
    return <div className="text-center py-20 text-red-500">{error || 'Không tìm thấy sự kiện.'}</div>;
  }

  const displayPrice = typeof event.price === 'number' 
    ? (event.price === 0 ? 'Miễn phí' : `${event.price.toLocaleString('vi-VN')}đ`)
    : 'Thương lượng';

  return (
    <main className="flex-1 bg-neutral-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <img src={event.image || 'https://via.placeholder.com/800x400'} alt={event.title} className="w-full h-64 object-cover" />
        
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">{event.title}</h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <img src={`https://i.pravatar.cc/150?u=${event.organizer?.id}`} alt={event.organizer?.name || 'Organizer'} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm text-neutral-500">Tổ chức bởi</p>
                <p className="font-semibold text-neutral-800">{event.organizer?.name || 'Không rõ'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleToggleRegistration}
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full md:w-auto"
              >
                {isRegistered ? 'Đã đăng ký (Hủy)' : 'Đăng ký ngay'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleToggleFavorite}
                className={`!p-2 ${isFavorited ? 'text-red-500 border-red-500' : 'text-neutral-500'}`}
              >
                <svg className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-neutral-700 mb-6 p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-start gap-3">
              <p><b>Thời gian:</b> {new Date(event.startAt).toLocaleString('vi-VN')} - {new Date(event.endAt).toLocaleString('vi-VN')}</p>
            </div>
            <div className="flex items-start gap-3">
              <p><b>Địa điểm:</b> {event.locationText}</p>
            </div>
            <div className="flex items-start gap-3">
              <p><b>Giá vé:</b> {displayPrice}</p>
            </div>
            <div className="flex items-start gap-3">
              <p><b>Số người tham gia:</b> {event.registeredCount} / {event.capacity ?? 'Không giới hạn'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">Mô tả sự kiện</h3>
            <p className="text-neutral-600 whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Comment section can be developed later */}
        </div>
      </div>
    </main>
  );
};

export default EventDetail; 