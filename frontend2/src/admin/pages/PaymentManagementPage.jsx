import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './PaymentManagementPage.css'; // 👈 thêm dòng này

const PaymentManagementPage = () => {
  const [activeTab, setActiveTab] = useState('withdrawals');
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/withdrawals?status=PENDING');
      setWithdrawals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch withdrawal requests:', error);
      toast.error('Failed to fetch withdrawal requests: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions');
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to fetch transactions: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/wallets');
      setWallets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
      toast.error('Failed to fetch wallets: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'withdrawals') fetchWithdrawals();
    if (activeTab === 'transactions') fetchTransactions();
    if (activeTab === 'wallets') fetchWallets();
  }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/withdrawals/${id}/approve`);
      toast.success('Withdrawal request approved');
      fetchWithdrawals();
    } catch (error) {
      toast.error('Failed to approve withdrawal request');
    }
  };

  const handleReject = async (id) => {
    const notes = prompt('Reason for rejection:');
    if (notes) {
      try {
        await api.patch(`/admin/withdrawals/${id}/reject`, { notes });
        toast.success('Withdrawal request rejected');
        fetchWithdrawals();
      } catch (error) {
        toast.error('Failed to reject withdrawal request');
      }
    }
  };

  return (
    <div className="payment-mgmt">
      <h1 className="page-title">Payment Management</h1>

      <div className="tabs" role="tablist" aria-label="Payment tabs">
        <button
          className={`tab-btn ${activeTab === 'withdrawals' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdrawals')}
          role="tab"
          aria-selected={activeTab === 'withdrawals'}
        >
          Withdrawal Requests
        </button>
        <button
          className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
          role="tab"
          aria-selected={activeTab === 'transactions'}
        >
          Transactions
        </button>
        <button
          className={`tab-btn ${activeTab === 'wallets' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallets')}
          role="tab"
          aria-selected={activeTab === 'wallets'}
        >
          User Wallets
        </button>
      </div>

      {loading && (
        <div className="loading" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <span>Loading...</span>
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <section>
          <h2 className="section-title">Pending Withdrawal Requests</h2>
          {withdrawals.length === 0 ? (
            <div className="empty-state">No pending withdrawal requests.</div>
          ) : (
            <div className="table-wrap">
              <table className="fd-table">
                <thead>
                  <tr>
                    <th>Organizer</th>
                    <th>Amount</th>
                    <th>Bank Name</th>
                    <th>Account Name</th>
                    <th>Account Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr key={w.id}>
                      <td>{w.organizer?.profile?.displayName}</td>
                      <td>{w.amount}</td>
                      <td>{w.payoutAccount?.bankName}</td>
                      <td>{w.payoutAccount?.accountName}</td>
                      <td>{w.payoutAccount?.accountNumber}</td>
                      <td>
                        <div className="action-cell">
                          <button
                            className="btn btn-approve"
                            onClick={() => handleApprove(w.id)}
                            disabled={loading}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => handleReject(w.id)}
                            disabled={loading}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === 'transactions' && (
        <section>
          <h2 className="section-title">Transactions</h2>
          {transactions.length === 0 ? (
            <div className="empty-state">No transactions found.</div>
          ) : (
            <div className="table-wrap">
              <table className="fd-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Tổ chức</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.user?.profile?.displayName || 'N/A'}</td>
                      <td>{t.registration?.event?.organizer?.profile?.displayName || 'N/A'}</td>
                      <td>{t.amount}</td>
                      <td>{t.description}</td>
                      <td>
                        <span className={`badge ${String(t.status || '').toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === 'wallets' && (
        <section>
          <h2 className="section-title">User Wallets</h2>
          {wallets.length === 0 ? (
            <div className="empty-state">No wallets found.</div>
          ) : (
            <div className="table-wrap">
              <table className="fd-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((w) => (
                    <tr key={w.id}>
                      <td>{w.user?.profile?.displayName}</td>
                      <td>{w.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default PaymentManagementPage;
