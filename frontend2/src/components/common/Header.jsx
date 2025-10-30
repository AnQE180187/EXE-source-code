

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Menu, X, ChevronDown, Bell } from 'lucide-react';
import DropdownMenu, { DropdownMenuItem } from '../ui/DropdownMenu';
import { getMyNotifications } from '../../services/api';
import api from '../../services/api';
import io from 'socket.io-client';
import { SOCKET_URL } from '../../services/api';

import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMembershipMenuOpen, setIsMembershipMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const socketRef = useRef(null);

  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link--active' : ''}`;

  const handleLogout = () => {
    logout();
    closeAllMenus(); // Đóng tất cả menus
    navigate('/');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsMembershipMenuOpen(false);
  };

  useEffect(() => {
    let polling;
    const fetchNoti = async () => {
      if (!isAuthenticated) return;
      try {
        const noti = await getMyNotifications();
        setNotifications(noti);
        setUnreadCount(noti.filter(n => !n.isRead).length);
      } catch {}
    };
    fetchNoti();
    if (isAuthenticated) {
      polling = setInterval(fetchNoti, 10000); // Poll mỗi 10s
    }
    return () => polling && clearInterval(polling);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user && user.userId) {
      socketRef.current = io(`${SOCKET_URL}/notifications`, {
        auth: {
          token: localStorage.getItem('token')
        }
      });
      socketRef.current.on('notification', handleNotificationSocket);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  // eslint-disable-next-line
  }, [isAuthenticated, user?.userId]);

  const handleBellClick = async () => {
    setShowDropdown((v) => !v);
    // Refresh noti khi mở dropdown
    if (!showDropdown && isAuthenticated) {
      try {
        const noti = await getMyNotifications();
        setNotifications(noti);
        setUnreadCount(noti.filter(n => !n.isRead).length);
      } catch {}
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/me/read');
      const noti = await getMyNotifications();
      setNotifications(noti);
      setUnreadCount(0);
    } catch {}
  };

  // (Chuẩn bị cho socket push realtime)
  const handleNotificationSocket = newNotification => {
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(u => u + 1);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.header__nav--mobile') && !event.target.closest('.header__mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
      
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }

      if (isMembershipMenuOpen && !event.target.closest('.membership-menu')) {
        setIsMembershipMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isProfileMenuOpen, isMembershipMenuOpen]);

  const AuthActions = () => {
    if (!isAuthenticated) {
      return (
        <Link 
          to="/login" 
          className="button-primary"
          onClick={closeMobileMenu}
        >
          <LogIn size={18} />
          <span>Đăng nhập / Đăng ký</span>
        </Link>
      );
    }
    return (
      <div className="profile-menu">
        <button
          className="profile-menu__trigger"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
            alt="User Avatar"
            className="profile-menu__avatar"
          />
          <ChevronDown 
            size={16} 
            className={`profile-menu__arrow ${isProfileMenuOpen ? 'profile-menu__arrow--open' : ''}`}
          />
        </button>
        {isProfileMenuOpen && (
          <div className="profile-menu__dropdown">
            <div className="profile-menu__user-info">
              <p className="profile-menu__user-name">{user.name || user.email}</p>
              <p className="profile-menu__user-role">{user.role}</p>
            </div>
            <Link to="/profile" className="profile-menu__item" onClick={closeAllMenus}>
              Hồ sơ của tôi
            </Link>
            <Link to="/change-password" className="profile-menu__item" onClick={closeAllMenus}>
              Đổi mật khẩu
            </Link>
            <Link to="/my-events" className="profile-menu__item" onClick={closeAllMenus}>
              Sự kiện của tôi
            </Link>
            {user.role === 'ORGANIZER' && (
              <Link to="/manage/events" className="profile-menu__item" onClick={closeAllMenus}>
                Quản lý sự kiện
              </Link>
            )}
            {user.role !== 'ORGANIZER' && (
                <Link to="/pricing/user" className="profile-menu__item" onClick={closeAllMenus}>
                    Nâng cấp tài khoản
                </Link>
            )}
            <div className="profile-menu__divider"></div>
            <button onClick={handleLogout} className="profile-menu__item profile-menu__item--logout">
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    );
  };

  const navLinks = (
    <>
      <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>Trang chủ</NavLink>
      <NavLink to="/events" className={navLinkClass} onClick={closeMobileMenu}>Sự kiện</NavLink>
      <NavLink to="/forum" className={navLinkClass} onClick={closeMobileMenu}>Diễn đàn</NavLink>
      {isAuthenticated && (
        <NavLink to="/chat" className={navLinkClass} onClick={closeMobileMenu}>
          Chat
        </NavLink>
      )}
      <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>About Us</NavLink>
      {isAuthenticated && (
        <div className="profile-menu membership-menu">
          <button 
            className="button-organizer"
            onClick={() => setIsMembershipMenuOpen(!isMembershipMenuOpen)}
          >
            Gói thành viên 
            <ChevronDown 
              size={16} 
              className={`profile-menu__arrow ${isMembershipMenuOpen ? 'profile-menu__arrow--open' : ''}`}
            />
          </button>
          {isMembershipMenuOpen && (
            <div className="profile-menu__dropdown">
              <Link to="/pricing" className="profile-menu__item" onClick={closeAllMenus}>
                Tổ chức sự kiện
              </Link>
              <Link to="/pricing/user" className="profile-menu__item" onClick={closeAllMenus}>
                Premium
              </Link>
            </div>
          )}
        </div>
      )}
      {isAuthenticated && user.role === 'ORGANIZER' && (
        <NavLink 
          to="/manage/events" 
          className="button-organizer"
          onClick={closeMobileMenu}
        >
          Quản lý sự kiện
        </NavLink>
      )}

    </>
  );

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__content">
        <Link to="/" className="header__logo">
          <img src="/logofreeday.png" alt="FreeDay Logo" className="header__logo-img" />

          <span className="header__logo-text">FreeDay</span>
        </Link>

        <nav className="header__nav--desktop">
          {navLinks}
        </nav>

        <div className="header__actions">
          <div className="desktop-actions" style={{display:'flex',alignItems:'center',gap:16}}>
            {isAuthenticated && (
              <div className="notification-bell-wrapper">
                <DropdownMenu
                  trigger={
                    <div className="notification-bell-btn" style={{cursor:'pointer', position:'relative'}} onClick={handleBellClick}>
                      <Bell size={24} color={unreadCount>0?'#08BAA1':'#222'} fill={unreadCount>0?"#08BAA1":"none"}/>
                      {unreadCount > 0 && <span className="notification-dot"></span>}
                    </div>
                  }
                >
                  <div style={{ padding: '0.5rem 1rem', minWidth: 260 }}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontWeight:600}}>Thông báo</span>
                      {unreadCount ? (
                        <button className="mark-read-btn" onClick={e => { e.stopPropagation(); markAllAsRead(); }} style={{fontSize:'0.92rem',color:'#08BAA1',background:'none',border:'none',cursor:'pointer'}}>Đánh dấu đã đọc</button>) : null}
                    </div>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.length === 0 && (
                      <DropdownMenuItem>
                        <span style={{ color: '#888', fontStyle: 'italic', fontSize: '.97rem' }}>Chưa có thông báo nào</span>
                      </DropdownMenuItem>
                    )}
                    {Array.isArray(notifications) && notifications.filter(Boolean).map((n) => (
                      <DropdownMenuItem key={n.id}>
                        <Link to={n.href || n.link || '#'} style={{
                          textDecoration: 'none', color: n.isRead ? '#444' : '#08BAA1', fontWeight: n.isRead ? 500 : 700,
                          display: 'flex', alignItems: 'center', gap: 8, width:'100%'}}>
                          {n.type === 'like' && <span style={{color:'#e255a0'}}>❤️</span>}
                          {n.type === 'comment' && <span style={{color:'#09b'}}>💬</span>}
                          {n.type === 'favorite' && <span style={{color:'#edb602'}}>★</span>}
                          <span>{n.content}</span>
                          <span style={{fontSize:'.86em', color:'#aaa', marginLeft:'auto'}}>{n.time}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuItem>
                  </DropdownMenuItem>
                </DropdownMenu>
              </div>
            )}
            <AuthActions />
          </div>
          <button
            className="header__mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="header__nav--mobile">
            <nav>{navLinks}</nav>
            <div className="mobile-actions">
              <AuthActions />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;