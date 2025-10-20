import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot } from 'lucide-react';
import { postQuery } from '../services/chatbotService';
import './ChatBox.css'; // Reusing some styles from ChatBox for consistency

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là trợ lý AI của FreeDay. Bạn cần tìm sự kiện gì?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await postQuery(input);
      const botMessage = { sender: 'bot', text: response.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to parse the text and render links more naturally
  const renderMessageText = (text) => {
    const linkRegex = /(.*?)\s*\[EVENT_URL:(\/events\/[^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add the text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const linkText = match[1].trim(); // The text right before the placeholder
      const url = match[2];

      // Add the link component
      parts.push(
        <Link key={match.index} to={url} className="chat-event-link">
          {linkText}
        </Link>
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last link
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="chat-box">
      <div className="chat-box__header">
        <Bot size={24} />
        <h3>Trợ lý AI FreeDay</h3>
      </div>
      <div className="chat-box__messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble message-bubble--${msg.sender}`}>
            {renderMessageText(msg.text)}
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble message-bubble--bot is-typing">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-box__input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Hỏi về các sự kiện..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
