import React, { useEffect, useState } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, Heart, CalendarPlus, Check } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, readAt: new Date() } : n));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, readAt: new Date() })));
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  };

  const NotificationIcon = ({ type }) => {
    switch (type) {
      case 'POST_LIKED':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'NEW_COMMENT':
        return <MessageSquare className="h-6 w-6 text-blue-500" />;
      case 'NEW_EVENT':
        return <CalendarPlus className="h-6 w-6 text-green-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const renderNotificationContent = (notification) => {
    const { type, payload } = notification;
    const linkClass = "font-semibold text-indigo-600 hover:underline";
    switch (type) {
      case 'POST_LIKED':
        return (
          <p>
            Your post "<Link to={`/posts/${payload.postId}`} className={linkClass}>{payload.postTitle}</Link>" was liked.
          </p>
        );
      case 'NEW_COMMENT':
        return (
          <p>
            You have a new comment on your post "<Link to={`/posts/${payload.postId}`} className={linkClass}>{payload.postTitle}</Link>".
          </p>
        );
      case 'NEW_EVENT':
        return (
          <p>
            A new event "<Link to={`/events/${payload.eventId}`} className={linkClass}>{payload.eventTitle}</Link>" has been created.
          </p>
        );
      default:
        return <p>You have a new notification.</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Notifications</h1>
            <button onClick={handleMarkAllAsRead} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Mark all as read
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {notifications.map(notification => (
                  <li key={notification.id} className={`p-4 transition-colors duration-200 ${!notification.readAt ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 pt-1">
                        <NotificationIcon type={notification.type} />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-700">
                          {renderNotificationContent(notification)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.readAt && (
                        <button onClick={() => handleMarkAsRead(notification.id)} title="Mark as read" className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600">
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16 px-4">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No new notifications</h3>
                <p className="mt-1 text-sm text-gray-500">When you get notifications, they'll show up here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
