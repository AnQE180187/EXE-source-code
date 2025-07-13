import React from 'react';
import type { Toast } from './useToast';

const toastColors: Record<string, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => (
  <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`min-w-[220px] px-4 py-2 rounded shadow text-white flex items-center justify-between ${toastColors[toast.type] || 'bg-blue-500'} animate-fade-in`}
      >
        <span>{toast.message}</span>
        <button className="ml-3 text-white/80 hover:text-white" onClick={() => removeToast(toast.id)}>
          ×
        </button>
      </div>
    ))}
  </div>
);

export default ToastContainer;
