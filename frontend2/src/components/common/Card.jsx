import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import '../ui/Button.css';

const Card = ({ event }) => {
  const { id, title, description, imageUrl } = event;
  const shortDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

  return (
    <div className="card">
      <img src={imageUrl} alt={title} className="card__image" />
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{shortDescription}</p>
        <Link to={`/events/${id}`} className="button button--secondary">
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default Card;
