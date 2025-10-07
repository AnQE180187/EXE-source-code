import React, { useEffect, useState } from 'react';

// Mock data for initial UI development
const mockReports = [
  {
    id: '1',
    contentType: 'Event',
    reportedItem: { id: 'evt1', title: 'Pool Party - Summer Vibes' },
    reason: 'Spam or misleading content',
    reportedBy: { id: 'usr5', email: 'reporter1@example.com' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    contentType: 'Post',
    reportedItem: { id: 'post1', title: 'Looking for a partner for the concert' },
    reason: 'Harassment or hate speech',
    reportedBy: { id: 'usr6', email: 'reporter2@example.com' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    contentType: 'Comment',
    reportedItem: { id: 'cmt1', content: 'This is an inappropriate comment.' },
    reason: 'Inappropriate content',
    reportedBy: { id: 'usr7', email: 'reporter3@example.com' },
    createdAt: new Date().toISOString(),
  },
];

const ModerationPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // In a real scenario, you would fetch reports from the API
        // const response = await api.get('/admin/moderation/reports');
        // setReports(response.data);

        // Using mock data for now
        setReports(mockReports);

      } catch (err) {
        setError('Failed to fetch reports.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Content Moderation</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Content Type</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Reported Item</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Reason</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Reported By</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{report.contentType}</td>
              <td style={{ padding: '8px' }}>{report.reportedItem.title || report.reportedItem.content}</td>
              <td style={{ padding: '8px' }}>{report.reason}</td>
              <td style={{ padding: '8px' }}>{report.reportedBy.email}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>Dismiss</button>
                <button>Hide Content</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModerationPage;
