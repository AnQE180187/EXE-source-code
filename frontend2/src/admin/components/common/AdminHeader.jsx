import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';

const AdminHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <div className="flex items-center">
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring">
          <Bell size={20} />
        </button>
        <div className="relative ml-4">
          <button className="flex items-center p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring">
            <User size={20} />
          </button>
        </div>
        <button className="ml-4 p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;