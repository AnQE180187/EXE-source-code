import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Effect to handle clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/'); // Navigate to homepage after logout
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Icon Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
      >
        {user ? (
          <span>{user.name?.charAt(0).toUpperCase() || 'A'}</span>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-slide-up-fast z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {user ? (
              // --- Menu for logged-in users ---
              <>
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-neutral-800">{user.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  onClick={() => setIsOpen(false)}
                >
                  Hồ sơ của tôi
                </Link>
                <Link
                  to="/my-events"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  onClick={() => setIsOpen(false)}
                >
                  Sự kiện của tôi
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              // --- Menu for logged-out users ---
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
