
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Use the centralized api instance
import toast from 'react-hot-toast';

const PaymentManagementPage = () => {
  const [activeTab, setActiveTab] = useState('withdrawals');
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      // Use api instance, remove /api prefix and withCredentials
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
      // Use api instance, remove /api prefix and withCredentials
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
      // Use api instance, remove /api prefix and withCredentials
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
    if (activeTab === 'withdrawals') {
      fetchWithdrawals();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    } else if (activeTab === 'wallets') {
      fetchWallets();
    }
  }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      // Use api instance
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
        // Use api instance
        await api.patch(`/admin/withdrawals/${id}/reject`, { notes });
        toast.success('Withdrawal request rejected');
        fetchWithdrawals();
      } catch (error) {
        toast.error('Failed to reject withdrawal request');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payment Management</h1>
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'withdrawals' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('withdrawals')}
        >
          Withdrawal Requests
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'transactions' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'wallets' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('wallets')}
        >
          User Wallets
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {activeTab === 'withdrawals' && (
        <div>
          <h2 className="text-xl font-bold mb-2">Pending Withdrawal Requests</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Organizer</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Bank Name</th>
                <th className="py-2">Account Name</th>
                <th className="py-2">Account Number</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id}>
                  <td className="border px-4 py-2">{w.organizer.profile.displayName}</td>
                  <td className="border px-4 py-2">{w.amount}</td>
                  <td className="border px-4 py-2">{w.payoutAccount.bankName}</td>
                  <td className="border px-4 py-2">{w.payoutAccount.accountName}</td>
                  <td className="border px-4 py-2">{w.payoutAccount.accountNumber}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleApprove(w.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleReject(w.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div>
          <h2 className="text-xl font-bold mb-2">Transactions</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">User</th>
                <th className="py-2">Tổ chức</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Description</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="border px-4 py-2">{t.user?.profile?.displayName || 'N/A'}</td>
                  <td className="border px-4 py-2">{t.registration?.event?.organizer?.profile?.displayName || 'N/A'}</td>
                  <td className="border px-4 py-2">{t.amount}</td>
                  <td className="border px-4 py-2">{t.description}</td>
                  <td className="border px-4 py-2">{t.status}</td>
                  <td className="border px-4 py-2">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'wallets' && (
        <div>
          <h2 className="text-xl font-bold mb-2">User Wallets</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">User</th>
                <th className="py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((w) => (
                <tr key={w.id}>
                  <td className="border px-4 py-2">{w.user.profile.displayName}</td>
                  <td className="border px-4 py-2">{w.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentManagementPage;
