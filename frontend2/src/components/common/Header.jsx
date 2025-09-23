
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Menu, X } from 'lucide-react';

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
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AuthActions = () => {
    if (!isAuthenticated) {
      return (
        <Link to="/login" className="button-primary">
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
        </button>
        {isProfileMenuOpen && (
          <div className="profile-menu__dropdown">
            <div className="profile-menu__user-info">
              <p className="profile-menu__user-name">{user.name || user.email}</p>
              <p className="profile-menu__user-role">{user.role}</p>
            </div>
            <Link to="/profile" className="profile-menu__item" onClick={() => setIsProfileMenuOpen(false)}>
              Hồ sơ của tôi
            </Link>
            <Link to="/my-events" className="profile-menu__item" onClick={() => setIsProfileMenuOpen(false)}>
              Sự kiện của tôi
            </Link>
            {user.role === 'ORGANIZER' && (
              <Link to="/manage/events" className="profile-menu__item" onClick={() => setIsProfileMenuOpen(false)}>
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
      <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>About Us</NavLink>
      {isAuthenticated && user.role === 'PARTICIPANT' && (
        <NavLink to="/pricing" className="button-organizer">
          Trở thành Organizer
        </NavLink>
      )}
      {isAuthenticated && user.role === 'ORGANIZER' && (
        <NavLink to="/manage/events" className="button-organizer">
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
