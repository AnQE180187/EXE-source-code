import React, { useState, useEffect, useRef } from 'react';
import { getMessages } from '../services/chatService';
import ChatInput from './ChatInput';
import { useAuth } from '../context/AuthContext';
import './ChatBox.css';

const NEAR_BOTTOM_PX = 120; // ngưỡng “đang gần cuối”

const ChatBox = ({ conversation, socket }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // container của list tin nhắn
  const containerRef = useRef(null);

  // flags cho logic cuộn
  const shouldStickRef = useRef(true);   // true nếu user đang gần cuối
  const justLoadedRef = useRef(false);   // vừa load/đổi phòng → kéo 1 lần

  // tiện ích cuộn
  const scrollToBottom = (behavior = 'auto') => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  // theo dõi cuộn để biết user có đang gần cuối không
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      shouldStickRef.current = distanceFromBottom < NEAR_BOTTOM_PX;
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // load tin khi đổi conversation
  useEffect(() => {
    let isMounted = true;
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(conversation.id);
        if (!isMounted) return;
        setMessages(data || []);
        // đánh dấu vừa load để effect dưới kéo xuống 1 lần
        justLoadedRef.current = true;
      } catch (err) {
        if (!isMounted) return;
        setError('Could not fetch messages.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
    fetchMessages();

    // lắng nghe socket
    const onReceive = (message) => {
      if (String(message.conversationId) === String(conversation.id)) {
        // KHÔNG cuộn ở đây — để effect dưới quyết định
        setMessages((prev) => [...prev, message]);
      }
    };

    socket?.on?.('message.receive', onReceive);

    return () => {
      isMounted = false;
      socket?.off?.('message.receive', onReceive);
    };
  }, [conversation, socket]);

  // quyết định cuộn sau mỗi lần messages thay đổi
  useEffect(() => {
    // vừa đổi phòng / load lần đầu → kéo xuống 1 lần
    if (justLoadedRef.current) {
      justLoadedRef.current = false;
      scrollToBottom('auto');
      return;
    }
    // nếu user đang gần cuối → kéo nhẹ xuống
    if (shouldStickRef.current) {
      scrollToBottom('smooth');
    }
    // còn lại: giữ nguyên vị trí
  }, [messages.length]); // chỉ cần length

  const handleSendMessage = (content) => {
    if (!content?.trim()) return;
    socket.emit('message.send', {
      conversationId: conversation.id,
      content: content.trim(),
    });
    // KHÔNG ép cuộn ở đây → để effect trên xử lý
  };

  const otherUser =
    user && conversation.organizerId === user.sub
      ? conversation.participant
      : conversation.organizer;

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>{otherUser?.profile?.displayName || 'Unknown User'}</h3>
      </div>

      <div className="messages-container" ref={containerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-item ${
              msg.senderId === user.sub ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">{msg.content}</div>
            <div className="message-timestamp">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBox;
