import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMessages } from '../services/chatService';
import { postQuery } from '../services/chatbotService';
import ChatInput from './ChatInput';
import { useAuth } from '../context/AuthContext';
import { Bot } from 'lucide-react';
import './ChatBox.css';

const NEAR_BOTTOM_PX = 120; // ngưỡng “đang gần cuối”

const ChatBox = ({ conversation, socket }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  useEffect(() => {
    // Reset state when conversation changes
    setMessages(conversation?.messages || []);
    setError(null);
    justLoadedRef.current = true;

    // If it's a regular chat, fetch messages and listen to socket
    if (!conversation.isAi) {
      let isMounted = true;
      const fetchMessages = async () => {
        try {
          setLoading(true);
          const data = await getMessages(conversation.id);
          if (isMounted) setMessages(data || []);
        } catch (err) {
          if (isMounted) setError('Could not fetch messages.');
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchMessages();

      const onReceive = (message) => {
        if (String(message.conversationId) === String(conversation.id)) {
          setMessages((prev) => [...prev, message]);
        }
      };
      socket?.on?.('message.receive', onReceive);

      return () => {
        isMounted = false;
        socket?.off?.('message.receive', onReceive);
      };
    } else {
      // For AI chat, loading is immediately false
      setLoading(false);
    }
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

  const handleSendMessage = async (content) => {
    if (!content?.trim()) return;

    if (conversation.isAi) {
      const userMessage = { senderId: 'user', content, createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, userMessage]);
      setIsAiLoading(true);
      try {
        const response = await postQuery(content);
        const botMessage = { senderId: 'bot', content: response.reply, createdAt: new Date().toISOString() };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        const errorMessage = { senderId: 'bot', content: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.', createdAt: new Date().toISOString() };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsAiLoading(false);
      }
    } else {
      socket.emit('message.send', {
        conversationId: conversation.id,
        content: content.trim(),
      });
    }
  };

  const renderMessageText = (text) => {
    const linkRegex = /(.*?)\s*\[EVENT_URL:(\/events\/[^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    // Use a standard while loop for exec
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const linkText = match[1].trim().replace(/\*\*/g, ''); // Remove markdown bold
      const url = match[2];
      parts.push(
        <Link key={match.index} to={url} className="chat-event-link">
          <strong>{linkText}</strong>
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  const otherUser =
    !conversation.isAi && user && conversation.organizerId === user.sub
      ? conversation.participant
      : conversation.organizer;

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="chat-box">
      <div className="chat-header">
        {conversation.isAi ? (
            <><Bot size={20} /> <h3>{conversation.event.title}</h3></>
        ) : (
            <h3>{otherUser?.profile?.displayName || 'Unknown User'}</h3>
        )}
      </div>

      <div className="messages-container" ref={containerRef}>
        {messages.map((msg, index) => {
          const isSent = conversation.isAi 
            ? msg.senderId === 'user' 
            : msg.senderId === user?.sub;

          return (
            <div
              key={msg.id || `msg-${index}`}
              className={`message-item ${isSent ? 'sent' : 'received'}`}
            >
              <div className="message-content">{renderMessageText(msg.content)}</div>
              <div className="message-timestamp">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          );
        })}
        {isAiLoading && (
            <div className="message-item received">
                 <div className="message-content is-typing"><span></span><span></span><span></span></div>
            </div>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isAiLoading} />
    </div>
  );
};

export default ChatBox;