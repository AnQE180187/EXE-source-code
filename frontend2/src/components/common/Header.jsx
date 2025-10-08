
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Menu, X, ChevronDown } from 'lucide-react';

import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const handleClickOutside = (event) => {
      // Close mobile menu when clicking outside
      if (isMobileMenuOpen && !event.target.closest('.header__nav--mobile') && !event.target.closest('.header__mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
      
      // Close profile dropdown when clicking outside
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isProfileMenuOpen]);

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
      {isAuthenticated && user.role === 'PARTICIPANT' && (
        <NavLink 
          to="/pricing" 
          className="button-organizer"
          onClick={closeMobileMenu}
        >
          Trở thành Organizer
        </NavLink>
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
          <div className="desktop-actions">
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
