import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import AdminHeader from '../components/common/AdminHeader';
import { ToastProvider } from '../components/common/Toast';
import './AdminLayout.css';

const AdminLayout = () => {
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