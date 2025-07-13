import React, { useEffect, useState } from 'react';
import { userAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const RegisteredEvents: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await userAPI.getEvents();
        setEvents(res.data.events || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8">
      <div className="font-semibold text-2xl mb-4 text-primary-700">Sự kiện đã đăng ký</div>
      <div className="bg-neutral-50 rounded-xl p-4 min-h-[60px] shadow-inner">
        {loading ? (
          <div className="flex items-center gap-2 text-neutral-500">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Đang tải...
          </div>
        ) : events.length === 0 ? (
          <div className="text-neutral-400">Chưa có sự kiện nào.</div>
        ) : (
          <ul className="space-y-2">
            {events.map((ev, idx) => (
              <li key={ev._id || idx} className="flex items-center gap-2 text-base text-neutral-700">
                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                </svg>
                {ev.name || 'Sự kiện không tên'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RegisteredEvents;
