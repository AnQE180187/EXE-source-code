import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Đóng menu khi click ra ngoài
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Nếu chưa đăng nhập, hiển thị icon dẫn tới trang đăng ký
  if (!user) {
    return (
      <Link to="/register" className="flex items-center space-x-2 focus:outline-none">
        <span className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
      </Link>
    );
  }

  // Nếu đã đăng nhập, nhấp vào icon sẽ chuyển sang trang chi tiết profile
  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
      >
        <span className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </span>
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
            onClick={() => setOpen(false)}
          >
            Xem Profile
          </Link>
          <Link
            to="/registered-events"
            className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
            onClick={() => setOpen(false)}
          >
            Sự kiện đã đăng ký
          </Link>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            onClick={() => {
              setOpen(false);
              logout?.();
              navigate('/login');
            }}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
