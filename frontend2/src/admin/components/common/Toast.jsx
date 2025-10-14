import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

// Individual Toast Item
const ToastItem = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
          borderColor: '#10b981',
          color: '#065f46'
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
          borderColor: '#ef4444',
          color: '#991b1b'
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderColor: '#f59e0b',
          color: '#92400e'
        };
      case 'info':
      default:
        return {
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          borderColor: '#3b82f6',
          color: '#1e40af'
        };
    }
  };

  return (
    <div 
      className="toast-item"
      style={{
        ...getStyles(),
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        marginBottom: '0.75rem',
        minWidth: '320px',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1, fontWeight: '500' }}>
        {toast.message}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Toast CSS (to be added to AdminPages.css)
export const toastStyles = `
.toast-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  backdrop-filter: blur(10px);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .toast-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
  
  .toast-item {
    min-width: auto;
    max-width: none;
  }
}
`;
