import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from './EventForm';
import { createEvent } from '../services/eventService';

const CreateEventPage = () => {
    const [apiError, setApiError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleCreateEvent = async (data) => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            const newEvent = await createEvent(data);
            navigate(`/manage/events`); // Navigate to manager page after creation
        } catch (error) {
            setApiError(error.toString());
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Tạo sự kiện mới</h1>
            {apiError && <p className="text-sm text-center text-red-500 bg-red-100 p-3 rounded-md mb-4">{apiError}</p>}
            <EventForm 
                onSubmit={handleCreateEvent} 
                isSubmitting={isSubmitting} 
                submitButtonText="Tạo sự kiện"
            />
        </div>
    );
};

export default CreateEventPage;
