import React from 'react';
import './Avatar.css';

const Avatar = ({ src, alt, fallback }) => {
  return (
    <div className="avatar">
      {src ? (
        <img src={src} alt={alt} className="avatar__image" />
      ) : (
        <span className="avatar__fallback">{fallback}</span>
      )}
    </div>
  );
};

export default Avatar;
