import React, { useEffect, useState } from 'react';

// Mock data for initial UI development
const mockEvents = [
  {
    id: 'evt_1',
    title: 'Summer Music Festival',
    organizer: { email: 'organizer@freeday.com' },
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Published',
  },
  {
    id: 'evt_2',
    title: 'Tech Conference 2025',
    organizer: { email: 'techcorp@example.com' },
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Published',
  },
  {
    id: 'evt_3',
    title: 'Local Charity Run - Draft',
    organizer: { email: 'charity@example.com' },
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Draft',
  },
    {
    id: 'evt_4',
    title: 'Cancelled Concert',
    organizer: { email: 'musicgroup@example.com' },
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Cancelled',
  },
];

const AdminEventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real scenario, you would fetch all events from an admin API endpoint
        // const response = await api.get('/admin/events');
        // setEvents(response.data);

        // Using mock data for now
        setEvents(mockEvents);

      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Event Management (Admin)</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Event Title</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Organizer</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Start Date</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{event.title}</td>
              <td style={{ padding: '8px' }}>{event.organizer.email}</td>
              <td style={{ padding: '8px' }}>{new Date(event.startDate).toLocaleDateString()}</td>
              <td style={{ padding: '8px' }}>{event.status}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>View</button>
                <button style={{ marginRight: '5px' }}>Hide</button>
                <button>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEventManagementPage;
