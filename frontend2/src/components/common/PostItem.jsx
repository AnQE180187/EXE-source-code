import React from 'react';
import { Link } from 'react-router-dom';
import './PostItem.css';

const PostItem = ({ post }) => {
  const { id, title, content, author } = post;
  const excerpt = content.substring(0, 150) + '...';

  return (
    <div className="post-item">
      <div className="post-item__avatar">
        <img src={author.avatarUrl} alt={author.name} />
      </div>
      <div className="post-item__content">
        <h3 className="post-item__title">
          <Link to={`/forum/${id}`}>{title}</Link>
        </h3>
        <p className="post-item__excerpt">{excerpt}</p>
        <div className="post-item__meta">
          <span>Đăng bởi <strong>{author.name}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
