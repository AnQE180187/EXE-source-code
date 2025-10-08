import api from './api';

export const getConversations = async () => {
  try {
    const response = await api.get('/chat/conversations');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not fetch conversations.';
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not fetch messages.';
  }
};

export const createMessage = async (conversationId, content) => {
  try {
    const response = await api.post('/chat/messages', { conversationId, content });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not send message.';
  }
};

export const findOrCreateConversation = async (eventId, participantId, organizerId) => {
  try {
    const response = await api.post('/chat/conversations/find-or-create', { eventId, participantId, organizerId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Could not find or create conversation.';
  }
};
