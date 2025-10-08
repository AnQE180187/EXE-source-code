import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Shield, MessageSquare, Flag, List, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold">FreeDay Admin</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink to="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
          <Home size={20} className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
          <Users size={20} className="mr-3" />
          User Management
        </NavLink>
        <NavLink to="/admin/events" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
          <Shield size={20} className="mr-3" />
          Event Moderation
        </NavLink>
        <NavLink to="/admin/moderation" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
          <MessageSquare size={20} className="mr-3" />
          Forum Moderation
        </NavLink>
        <NavLink to="/admin/reports" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
          <Flag size={20} className="mr-3" />
          Report Management
        </NavLink>
        <NavLink to="/admin/audit-logs" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
          <List size={20} className="mr-3" />
          Audit Logs
        </NavLink>
        <NavLink to="/admin/settings" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
          <Settings size={20} className="mr-3" />
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;