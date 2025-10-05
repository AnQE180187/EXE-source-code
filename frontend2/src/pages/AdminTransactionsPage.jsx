
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getPendingTransactions, confirmTransaction } from '../services/transactionService';
import './EventManagerPage.css'; // Reuse styles for admin pages

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await getPendingTransactions();
        setTransactions(data);
      } catch (err) {
        setError('Không thể tải danh sách giao dịch. Vui lòng thử lại.');
        toast.error('Không thể tải danh sách giao dịch.');
      }
      setIsLoading(false);
    };

    fetchTransactions();
  }, []);

  const handleConfirm = async (transactionId) => {
    const toastId = toast.loading('Đang xác nhận giao dịch...');
    try {
      await confirmTransaction(transactionId);
      // Remove the confirmed transaction from the list
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      toast.success('Xác nhận giao dịch thành công!', { id: toastId });
    } catch (err) {
      toast.error('Xác nhận thất bại. Vui lòng thử lại.', { id: toastId });
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="event-manager-container">
      <h1>Xác nhận giao dịch thủ công</h1>
      <p>Danh sách các giao dịch nâng cấp vai trò đang chờ xác nhận.</p>

      {transactions.length === 0 ? (
        <p>Không có giao dịch nào đang chờ.</p>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Ngày tạo</th>
              <th>Email người dùng</th>
              <th>Mã giao dịch</th>
              <th>Số tiền</th>
              <th>Nội dung</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trans) => (
              <tr key={trans.id}>
                <td>{new Date(trans.createdAt).toLocaleString()}</td>
                <td>{trans.user?.email || 'N/A'}</td>
                <td>{trans.orderCode}</td>
                <td>{trans.amount.toLocaleString('vi-VN')} VND</td>
                <td>{trans.description}</td>
                <td>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleConfirm(trans.id)}
                  >
                    Xác nhận
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
