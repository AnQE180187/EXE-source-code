import React, { useState, useEffect, useRef } from 'react';
import { getMessages } from '../services/chatService';
import ChatInput from './ChatInput';
import { useAuth } from '../context/AuthContext';
import './ChatBox.css';

const ChatBox = ({ conversation, socket }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(conversation.id);
        setMessages(data);
      } catch (err) {
        setError('Could not fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const messageReceiveHandler = (message) => {
      if (message.conversationId === conversation.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on('message.receive', messageReceiveHandler);

    return () => {
      socket.off('message.receive', messageReceiveHandler);
    };
  }, [conversation, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content) => {
    socket.emit('message.send', {
      conversationId: conversation.id,
      content,
    });
  };

  const otherUser = 
    user && conversation.organizerId === user.sub
      ? conversation.participant
      : conversation.organizer;

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>{otherUser?.profile?.displayName || 'Unknown User'}</h3>
      </div>
      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-item ${
              msg.senderId === user.sub ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">{msg.content}</div>
            <div className="message-timestamp">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBox;
