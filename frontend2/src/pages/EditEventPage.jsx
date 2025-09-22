import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from './EventForm';
import { getEventById, updateEvent } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const EditEventPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const fetchEventData = useCallback(async () => {
    try {
      const event = await getEventById(id);
      if (user.sub !== event.organizerId) {
        navigate('/manage/events'); // Redirect if not owner
        return;
      }
      setInitialData(event);
    } catch (error) {
      setApiError('Không thể tải dữ liệu sự kiện.');
    } finally {
      setIsLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleUpdateEvent = async (data) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await updateEvent(id, data);
      navigate(`/manage/events`); // Navigate back to manager page
    } catch (error) {
      setApiError(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Đang tải trình chỉnh sửa...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Chỉnh sửa sự kiện</h1>
      {apiError && <p className="text-sm text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{apiError}</p>}
      {initialData ? (
        <EventForm 
          initialData={initialData}
          onSubmit={handleUpdateEvent}
          isSubmitting={isSubmitting}
          submitButtonText="Lưu thay đổi"
        />
      ) : (
        !apiError && <p>Không tìm thấy dữ liệu sự kiện.</p>
      )}
    </div>
  );
};

export default EditEventPage;