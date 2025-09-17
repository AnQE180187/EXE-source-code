import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

// Assuming the event objects have at least these properties
interface SimpleEvent {
  id: string;
  title: string;
  startAt: string;
}

const RegisteredEvents: React.FC = () => {
  const { user } = useAuthStore();
  const [registeredEvents, setRegisteredEvents] = useState<SimpleEvent[]>([]);
  const [favoritedEvents, setFavoritedEvents] = useState<SimpleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('registered');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await userAPI.getEvents();
        // Assuming the API returns an object with these two keys
        setRegisteredEvents(res.data.registered || []);
        setFavoritedEvents(res.data.favorited || []);
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

  const EventList: React.FC<{ events: SimpleEvent[] }> = ({ events }) => {
    if (events.length === 0) {
      return <div className="text-neutral-500 text-center py-8">Không có sự kiện nào.</div>;
    }
    return (
      <ul className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Link to={`/events/${event.id}`} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-primary-800">{event.title}</p>
                <p className="text-sm text-neutral-500">{new Date(event.startAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">Sự kiện của tôi</h1>
      
      <div className="mb-4 border-b border-neutral-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('registered')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registered'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Đã đăng ký
          </button>
          <button
            onClick={() => setActiveTab('favorited')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'favorited'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Đã yêu thích
          </button>
        </nav>
      </div>

      <div>
        {loading ? (
          <div className="text-center py-10">Đang tải...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          activeTab === 'registered' ? <EventList events={registeredEvents} /> : <EventList events={favoritedEvents} />
        )}
      </div>
    </div>
  );
};

export default RegisteredEvents;
