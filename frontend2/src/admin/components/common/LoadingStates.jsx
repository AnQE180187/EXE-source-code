import React from 'react';

// Skeleton Loading Components
export const SkeletonCard = () => (
  <div className="ap-card">
    <div className="ap-card__body">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div 
          className="ap-loading"
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '16px',
            background: 'var(--border)'
          }}
        />
        <div style={{ flex: 1 }}>
          <div 
            className="ap-loading"
            style={{ 
              height: '16px', 
              width: '60%', 
              marginBottom: '0.5rem',
              background: 'var(--border)',
              borderRadius: '4px'
            }}
          />
          <div 
            className="ap-loading"
            style={{ 
              height: '24px', 
              width: '40%',
              background: 'var(--border)',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="ap-card">
    <div className="ap-card__body">
      <div className="ap-table" style={{ border: 'none' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Table Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${columns}, 1fr)`, 
            gap: '1rem',
            padding: '0.75rem 1rem',
            background: 'var(--primary-50)',
            borderRadius: '8px'
          }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div 
                key={i}
                className="ap-loading"
                style={{ 
                  height: '12px', 
                  background: 'var(--border)',
                  borderRadius: '4px'
                }}
              />
            ))}
          </div>
          
          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div 
              key={rowIndex}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${columns}, 1fr)`, 
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--border)'
              }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={colIndex}
                  className="ap-loading"
                  style={{ 
                    height: '16px', 
                    background: 'var(--border)',
                    borderRadius: '4px',
                    width: colIndex === 0 ? '80%' : colIndex === columns - 1 ? '60%' : '100%'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonForm = () => (
  <div className="ap-card">
    <div className="ap-card__body">
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div 
              className="ap-loading"
              style={{ 
                height: '16px', 
                width: '30%',
                background: 'var(--border)',
                borderRadius: '4px'
              }}
            />
            <div 
              className="ap-loading"
              style={{ 
                height: '40px', 
                width: '100%',
                background: 'var(--border)',
                borderRadius: '8px'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Loading Spinner
export const LoadingSpinner = ({ size = 24, color = 'var(--primary)' }) => (
  <div 
    style={{
      width: size,
      height: size,
      border: `2px solid ${color}20`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}
  />
);

// Loading States for different components
export const LoadingStates = {
  Card: SkeletonCard,
  Table: SkeletonTable,
  Form: SkeletonForm,
  Spinner: LoadingSpinner
};

// Add spin animation to CSS
const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject the keyframes into the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}
