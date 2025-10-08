import React from 'react';
import { useAuth } from '../context/AuthContext';
import './ChatList.css';

const ChatList = ({ conversations, onSelectConversation, selectedConversation }) => {
  const { user } = useAuth();

  return (
    <div className="chat-list">
      <h2>Conversations</h2>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul>
          {conversations.map((convo) => {
            const otherUser =
              user && convo.organizerId === user.sub
                ? convo.participant
                : convo.organizer;

            return (
              <li
                key={convo.id}
                className={`chat-list-item ${
                  selectedConversation?.id === convo.id ? 'selected' : ''
                }`}
                onClick={() => onSelectConversation(convo)}
              >
                <img
                  src={
                    otherUser?.profile?.avatarUrl ||
                    'https://via.placeholder.com/40'
                  }
                  alt="avatar"
                  className="avatar"
                />
                <div className="conversation-details">
                  <div className="conversation-name">
                    {otherUser?.profile?.displayName || 'Unknown User'}
                  </div>
                  <div className="last-message">
                    {convo.messages[0]?.content}
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
