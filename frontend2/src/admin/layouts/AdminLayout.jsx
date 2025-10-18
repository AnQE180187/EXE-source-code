import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import AdminHeader from '../components/common/AdminHeader';
import { ToastProvider } from '../components/common/Toast';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ToastProvider>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <AdminHeader />
          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;