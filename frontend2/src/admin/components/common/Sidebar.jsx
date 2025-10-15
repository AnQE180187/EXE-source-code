import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, MessageSquare, Flag, List, Settings, CreditCard } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar__header">
        <a href="/admin/dashboard" className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-icon">F</div>
          <div>
            <div className="admin-sidebar__logo-text">FreeDay Admin</div>
            <div className="admin-sidebar__tagline">Event Management System</div>
          </div>
        </a>
      </div>
      <nav className="admin-sidebar__nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `admin-sidebar__nav-item ${isActive ? 'active' : ''}`
          }
          title="Admin dashboard overview"
        >
          <Home size={20} className="admin-sidebar__nav-icon" />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `admin-sidebar__nav-item ${isActive ? 'active' : ''}`
          }
          title="Manage user accounts and roles"
        >
          <Users size={20} className="admin-sidebar__nav-icon" />
          User Management
        </NavLink>
        <NavLink
          to="/admin/events"
          className={({ isActive }) =>
            `admin-sidebar__nav-item ${isActive ? 'active' : ''}`
          }
          title="Manage and moderate events"
        >
          <Calendar size={20} className="admin-sidebar__nav-icon" />
          Event Management
        </NavLink>
        <NavLink
          to="/admin/moderation"
          className={({ isActive }) =>
            `admin-sidebar__nav-item ${isActive ? 'active' : ''}`
          }
          title="Moderate forum content and posts"
        >
          <MessageSquare size={20} className="admin-sidebar__nav-icon" />
          Content Moderation
        </NavLink>
        {/* <NavLink 
          to="/admin/reports" 
          className={({ isActive }) => 
            `admin-sidebar__nav-item ${isActive ? 'active' : ''}`
          }
          title="Review and manage user reports"
        >
          <Flag size={20} className="admin-sidebar__nav-icon" />
          Report Management
        </NavLink> */}
        {/* <NavLink 
          to="/admin/audit-logs" 
          className={({ isActive }) => 
            `admin-sidebar__nav-item ${isActive ? 'active' : ''}`
          }
          title="View system activity logs"
        >
          <List size={20} className="admin-sidebar__nav-icon" />
          Audit Logs
        </NavLink> */}
        <NavLink
          to="/admin/payments"
          className={({ isActive }) =>
            `admin-sidebar__nav-item ${isActive ? 'active' : ''}`
          }
          title="Manage payment transactions"
        >
          <CreditCard size={20} className="admin-sidebar__nav-icon" />
          Payment Management
        </NavLink>
        {/* <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => 
            `admin-sidebar__nav-item ${isActive ? 'active' : ''}`
          }
          title="Configure system settings"
        >
          <Settings size={20} className="admin-sidebar__nav-icon" />
          Settings
        </NavLink> */}
      </nav>
    </div>
  );
};

export default Sidebar;