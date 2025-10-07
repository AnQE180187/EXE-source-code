import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '220px', background: '#f4f4f4', padding: '20px', minHeight: '100vh' }}>
        <h3>Admin Panel</h3>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/admin/users">User Management</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/admin/moderation">Content Moderation</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/admin/transactions">Transactions</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/admin/events">Event Management</Link>
            </li>
            {/* Add other admin links here */}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
