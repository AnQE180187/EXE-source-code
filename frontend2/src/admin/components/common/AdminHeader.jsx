import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, ChevronRight, ChevronDown, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const getPageTitle = (pathname) => {
    const pathMap = {
      '/admin/dashboard': 'Dashboard',
      '/admin/users': 'User Management',
      '/admin/events': 'Event Management',
      '/admin/moderation': 'Content Moderation',
      '/admin/reports': 'Report Management',
      '/admin/audit-logs': 'Audit Logs',
      '/admin/payments': 'Payment Management',
      '/admin/settings': 'Settings'
    };
    return pathMap[pathname] || 'Admin Panel';
  };

  const getBreadcrumb = (pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    return pathSegments.map((segment, index) => ({
      name: segment === 'admin' ? 'Admin' : getPageTitle(pathname),
      path: '/' + pathSegments.slice(0, index + 1).join('/')
    }));
  };

  const breadcrumb = getBreadcrumb(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.admin-header__user')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <h1 className="admin-header__title">{getPageTitle(location.pathname)}</h1>
        <nav className="admin-header__breadcrumb">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={item.path}>
              <span>{item.name}</span>
              {index < breadcrumb.length - 1 && (
                <ChevronRight size={16} className="admin-header__breadcrumb-separator" />
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      <div className="admin-header__actions">
        <button className="admin-header__action-btn admin-header__action-btn--notification">
          <Bell size={20} />
        </button>
        <div className="admin-header__user" onClick={toggleUserDropdown}>
          <div className="admin-header__user-avatar">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.displayName || 'Admin'}
                className="admin-header__avatar-img"
              />
            ) : (
              user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'
            )}
          </div>
          <div className="admin-header__user-info">
            <div className="admin-header__user-name">
              {user?.displayName || user?.name || 'Admin User'}
              <ChevronDown size={16} className={`admin-header__dropdown-icon ${isUserDropdownOpen ? 'admin-header__dropdown-icon--open' : ''}`} />
            </div>
            <div className="admin-header__user-role">Administrator</div>
          </div>

          {isUserDropdownOpen && (
            <div className="admin-header__user-dropdown">
              <div className="admin-header__dropdown-header">
                <div className="admin-header__dropdown-avatar">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user?.displayName || 'Admin'}
                      className="admin-header__dropdown-avatar-img"
                    />
                  ) : (
                    user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'
                  )}
                </div>
                <div className="admin-header__dropdown-info">
                  <div className="admin-header__dropdown-name">
                    {user?.displayName || user?.name || 'Admin User'}
                  </div>
                  <div className="admin-header__dropdown-email">
                    {user?.email || 'admin@example.com'}
                  </div>
                  <div className="admin-header__dropdown-role">
                    <Shield size={14} />
                    Administrator
                  </div>
                </div>
              </div>

              <div className="admin-header__dropdown-divider"></div>

              <div className="admin-header__dropdown-menu">
                <button
                  className="admin-header__dropdown-item"
                  onClick={() => {
                    navigate('/admin/settings');
                    closeUserDropdown();
                  }}
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  className="admin-header__dropdown-item admin-header__dropdown-item--logout"
                  onClick={() => {
                    handleLogout();
                    closeUserDropdown();
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="admin-header__action-btn" onClick={handleLogout}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;