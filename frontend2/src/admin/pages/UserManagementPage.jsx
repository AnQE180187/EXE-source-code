import React, { useEffect, useState } from 'react';
import api from '../../services/api';

// Mock data for initial UI development
const mockUsers = [
  { id: '1', profile: { displayName: 'Admin User' }, email: 'admin@freeday.com', role: 'Admin', status: 'Active' },
  { id: '2', profile: { displayName: 'Organizer User' }, email: 'organizer@freeday.com', role: 'Organizer', status: 'Active' },
  { id: '3', profile: { displayName: 'Participant User' }, email: 'participant@freeday.com', role: 'Participant', status: 'Active' },
  { id: '4', profile: { displayName: 'Banned User' }, email: 'banned@freeday.com', role: 'Participant', status: 'Banned' },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real scenario, you would fetch users from the API
        // const response = await api.get('/admin/users');
        // setUsers(response.data);
        
        // Using mock data for now
        setUsers(mockUsers);

      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>User Management</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Display Name</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{user.profile.displayName}</td>
              <td style={{ padding: '8px' }}>{user.email}</td>
              <td style={{ padding: '8px' }}>{user.role}</td>
              <td style={{ padding: '8px' }}>{user.status}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>Edit Role</button>
                <button>{user.status === 'Banned' ? 'Unban' : 'Ban'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementPage;
