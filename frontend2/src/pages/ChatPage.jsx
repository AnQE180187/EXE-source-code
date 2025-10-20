import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import { getConversations } from '../services/chatService';
import io from 'socket.io-client';
import { SOCKET_URL } from '../services/api';
import './ChatPage.css';
import { Bot } from 'lucide-react';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const socketRef = useRef(null);
  const THEME = 'messenger';

  const aiAssistantConversation = {
    id: 'ai-assistant',
    event: { title: 'Trợ lý AI FreeDay' },
    participant: { profile: { displayName: 'Hỏi đáp & Gợi ý sự kiện' } },
    messages: [{ content: 'Tôi có thể giúp gì cho bạn?' }],
    updatedAt: new Date().toISOString(),
    isAi: true, // Flag to identify the AI chat
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setConversations([aiAssistantConversation, ...sortedData]);

        const conversationId = searchParams.get('conversationId');
        if (conversationId) {
          const conversation = data.find((c) => String(c.id) === String(conversationId));
          if (conversation) setSelectedConversation(conversation);
        }
      } catch (err) {
        setError('Could not fetch conversations.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    socketRef.current = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current.on('connect_error', (err) => {
      setError('Cannot connect to chat server.');
      console.error(err);
    });

    socketRef.current.on('message.receive', (newMessage) => {
      setConversations((prev) => {
        const otherConversations = prev.filter(c => !c.isAi);
        const updatedConversations = otherConversations.map((cv) =>
          String(cv.id) === String(newMessage.conversationId)
            ? { ...cv, messages: [newMessage], updatedAt: newMessage.createdAt }
            : cv
        );
        const sorted = updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return [aiAssistantConversation, ...sorted];
      });
    });

    return () => socketRef.current?.disconnect();
  }, [searchParams]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (!conversation.isAi) {
        socketRef.current?.emit('joinRoom', conversation.id);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={`chat-page chat--${THEME}`}>
      <div className="chat-list-container">
        <ChatList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversation={selectedConversation}
        />
      </div>
      <div className="chat-box-container">
        {selectedConversation ? (
          <ChatBox
            conversation={selectedConversation}
            socket={socketRef.current}
          />
        ) : (
          <div className="no-conversation-selected">
            <Bot size={48} strokeWidth={1.5} />
            <h2>Trợ lý AI FreeDay</h2>
            <p>Chọn Trợ lý AI để bắt đầu hỏi đáp và nhận gợi ý sự kiện thông minh!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
