import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot } from 'lucide-react'; // Using an icon for the AI
import './ChatList.css';

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  return sameDay
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
};

const getOtherUser = (convo, user) => {
  if (!user) return convo?.organizer || convo?.participant;
  return convo?.organizerId === user.sub ? convo?.participant : convo?.organizer;
};

const ChatList = ({ conversations = [], onSelectConversation, selectedConversation }) => {
  const { user } = useAuth();
  const [q, setQ] = useState('');

  const items = useMemo(() => {
    const norm = conversations.map((c) => {
      if (c.isAi) {
        return {
          ...c,
          __name: 'Trợ lý AI FreeDay',
          __avatar: null, // We will render the Bot icon directly
          __last: c.messages?.[0]?.content || 'Sẵn sàng trả lời...',
          __lastAt: c.updatedAt,
        };
      }

      const other = getOtherUser(c, user);
      const lastMsg = c?.messages?.[0] || null;
      const name = other?.profile?.displayName || 'Người dùng';
      const avatar =
        other?.profile?.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=08BAA1&color=fff`;
      
      return {
        ...c,
        __other: other,
        __name: name,
        __avatar: avatar,
        __last: lastMsg?.content || '',
        __lastAt: lastMsg?.createdAt || c.updatedAt,
        __unread: c?.unreadCount || 0,
        __online: !!other?.isOnline,
      };
    });

    const filtered = q.trim()
      ? norm.filter(
          (c) =>
            c.__name.toLowerCase().includes(q.trim().toLowerCase()) ||
            c.__last.toLowerCase().includes(q.trim().toLowerCase())
        )
      : norm;

    // Separate AI and sort the rest
    const aiChat = filtered.find(c => c.isAi);
    const userChats = filtered.filter(c => !c.isAi);

    userChats.sort((a, b) => {
      const ta = a.__lastAt ? new Date(a.__lastAt).getTime() : 0;
      const tb = b.__lastAt ? new Date(b.__lastAt).getTime() : 0;
      return tb - ta;
    });

    return aiChat ? [aiChat, ...userChats] : userChats;

  }, [conversations, user, q]);

  return (
    <div className="chat-list">
      <div className="cl-header">
        <h2>Chats</h2>
        <div className="cl-search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm tên hoặc nội dung…"
            aria-label="Search conversations"
          />
          <svg viewBox="0 0 24 24" className="cl-search-icon" aria-hidden="true">
            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="cl-empty">
          <p>Không có đoạn chat nào.</p>
        </div>
      ) : (
        <ul className="cl-list" role="listbox" aria-label="Conversation list">
          {items.map((c) => {
            const isSelected = selectedConversation?.id === c.id;
            return (
              <li
                key={c.id}
                className={`chat-list-item ${isSelected ? 'selected' : ''}`}
                aria-selected={isSelected}
                onClick={() => onSelectConversation?.(c)}
                role="option"
              >
                <div className="avatar-wrap">
                  {c.isAi ? (
                    <div className="ai-avatar"><Bot size={24} /></div>
                  ) : (
                    <img src={c.__avatar} alt={c.__name} className="avatar" />
                  )}
                  {c.__online && <span className="status-dot" aria-label="Online" />}
                </div>

                <div className="conversation-details">
                  <div className="cl-name-row">
                    <span className="conversation-name">{c.__name}</span>
                    <time className="cl-time" dateTime={c.__lastAt || ''}>
                      {formatTime(c.__lastAt)}
                    </time>
                  </div>
                  <div className="cl-preview-row">
                    <span className="last-message" title={c.__last}>
                      {c.__last || '…'}
                    </span>
                    {c.__unread > 0 && <span className="badge">{c.__unread > 99 ? '99+' : c.__unread}</span>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
