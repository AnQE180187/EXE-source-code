import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import { Bell, MessageSquare, Heart, CalendarPlus, Check } from 'lucide-react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.readAt).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBellClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      fetchNotifications(); // Refresh notifications when opening
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const NotificationIcon = ({ type }) => {
    switch (type) {
      case 'POST_LIKED': return <Heart className="h-5 w-5 text-red-500" />;
      case 'NEW_COMMENT': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'NEW_EVENT': return <CalendarPlus className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderNotificationContent = (notification) => {
    const { type, payload } = notification;
    const linkClass = "font-semibold text-indigo-600 hover:underline";
    switch (type) {
      case 'POST_LIKED':
        return <p>Your post "<Link to={`/posts/${payload.postId}`} className={linkClass}>{payload.postTitle}</Link>" was liked.</p>;
      case 'NEW_COMMENT':
        return <p>You have a new comment on your post "<Link to={`/posts/${payload.postId}`} className={linkClass}>{payload.postTitle}</Link>".</p>;
      case 'NEW_EVENT':
        return <p>A new event "<Link to={`/events/${payload.eventId}`} className={linkClass}>{payload.eventTitle}</Link>" has been created.</p>;
      default:
        return <p>You have a new notification.</p>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleBellClick} className="relative">
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 flex justify-between items-center border-b">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <button onClick={handleMarkAllAsRead} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Mark all as read</button>
          </div>
          <ul className="max-h-96 overflow-y-auto divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <li key={notification.id} className={`p-3 transition-colors duration-200 ${!notification.readAt ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1">
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1 text-sm">
                      {renderNotificationContent(notification)}
                      <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    {!notification.readAt && (
                      <button onClick={() => handleMarkAsRead(notification.id)} title="Mark as read" className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600">
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <Bell className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-base font-medium text-gray-900">No new notifications</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later.</p>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
