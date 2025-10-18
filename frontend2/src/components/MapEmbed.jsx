import React from 'react';

// Keyless Google Maps embed. Accepts either address query or lat/lng
const buildSrc = ({ query, lat, lng, zoom = 15 }) => {
  if (lat != null && lng != null) {
    return `https://www.google.com/maps?q=${encodeURIComponent(lat + ',' + lng)}&z=${zoom}&output=embed`;
  }
  const q = query && query.trim().length > 0 ? query : '';
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;
};

const MapEmbed = ({ query, lat, lng, zoom = 15, className = '', style }) => {
  const src = buildSrc({ query, lat, lng, zoom });
  return (
    <div className={`map-embed ${className}`} style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 8, overflow: 'hidden', ...style }}>
      <iframe
        title="Google Map"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
};

export default MapEmbed;


