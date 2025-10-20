import api from './api';

/**
 * Sends a user's query to the chatbot API.
 * @param {string} message - The user's message.
 * @returns {Promise<object>} The chatbot's reply.
 */
export const postQuery = async (message) => {
  try {
    const response = await api.post('/chatbot/query', { message });
    return response.data; // { reply: "..." }
  } catch (error) {
    console.error('Error querying chatbot:', error);
    throw error.response?.data?.message || 'Lỗi khi gửi tin nhắn đến chatbot.';
  }
};
