import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import { getConversations } from '../services/chatService';
import io from 'socket.io-client';
import { SOCKET_URL } from '../services/api';
import './ChatPage.css';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);

        const conversationId = searchParams.get('conversationId');
        if (conversationId) {
          const conversation = data.find((c) => c.id === conversationId);
          if (conversation) {
            setSelectedConversation(conversation);
          }
        }
      } catch (err) {
        setError('Could not fetch conversations.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    socketRef.current = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketRef.current.on('connect_error', (err) => {
      setError('Cannot connect to chat server.');
      console.error(err);
    });

    socketRef.current.on('message.receive', (newMessage) => {
      setConversations((prevConversations) =>
        prevConversations.map((convo) =>
          convo.id === newMessage.conversationId
            ? { ...convo, messages: [newMessage] }
            : convo
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [searchParams]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    socketRef.current.emit('joinRoom', conversation.id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="chat-page">
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
            <h2>Select a conversation to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
