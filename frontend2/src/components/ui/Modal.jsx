import React from 'react';
import { Button } from './Button';

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div>{children}</div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button variant="destructive" onClick={onConfirm}>Xác nhận</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
