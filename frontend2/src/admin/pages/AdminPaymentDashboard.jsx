import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, X, Clock, CreditCard, DollarSign, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import './AdminPages.css';

// Mock data for initial UI development
const mockPayments = [
  {
    id: 'pay_001',
    transactionId: 'txn_001',
    user: { name: 'John Doe', email: 'john@example.com' },
    amount: 500000,
    type: 'UPGRADE_ORGANIZER',
    status: 'COMPLETED',
    paymentMethod: 'Bank Transfer',
    orderCode: 'UPG12345678',
    description: 'Upgrade to Organizer Account',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    bankInfo: {
      bankName: 'Vietcombank',
      accountNumber: '1234567890',
      transactionId: 'VCB123456789'
    }
  },
  {
    id: 'pay_002',
    transactionId: 'txn_002',
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    amount: 300000,
    type: 'EVENT_DEPOSIT',
    status: 'PENDING',
    paymentMethod: 'Bank Transfer',
    orderCode: 'EVT87654321',
    description: 'Event Registration Deposit',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    bankInfo: null
  },
  {
    id: 'pay_003',
    transactionId: 'txn_003',
    user: { name: 'Mike Johnson', email: 'mike@example.com' },
    amount: 750000,
    type: 'UPGRADE_ORGANIZER',
    status: 'FAILED',
    paymentMethod: 'Bank Transfer',
    orderCode: 'UPG11223344',
    description: 'Upgrade to Organizer Account',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    bankInfo: null
  },
  {
    id: 'pay_004',
    transactionId: 'txn_004',
    user: { name: 'Sarah Wilson', email: 'sarah@example.com' },
    amount: 200000,
    type: 'EVENT_DEPOSIT',
    status: 'COMPLETED',
    paymentMethod: 'Bank Transfer',
    orderCode: 'EVT99887766',
    description: 'Event Registration Deposit',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    bankInfo: {
      bankName: 'Techcombank',
      accountNumber: '0987654321',
      transactionId: 'TCB987654321'
    }
  },
  {
    id: 'pay_005',
    transactionId: 'txn_005',
    user: { name: 'David Brown', email: 'david@example.com' },
    amount: 600000,
    type: 'UPGRADE_ORGANIZER',
    status: 'PENDING',
    paymentMethod: 'Bank Transfer',
    orderCode: 'UPG55667788',
    description: 'Upgrade to Organizer Account',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    bankInfo: null
  }
];

const PaymentManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // In a real scenario, you would fetch payments from the API
        // const response = await api.get('/admin/payments');
        // setPayments(response.data);

        // Using mock data for now
        setPayments(mockPayments);

      } catch (err) {
        setError('Không thể tải danh sách thanh toán.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      const diffHours = (now - paymentDate) / (1000 * 60 * 60);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = diffHours < 24;
          break;
        case 'week':
          matchesDate = diffHours < 168; // 7 days
          break;
        case 'month':
          matchesDate = diffHours < 720; // 30 days
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const handleStatusChange = (paymentId, newStatus) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: newStatus,
            completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : null
          }
        : payment
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'PENDING': return <Clock size={16} />;
      case 'FAILED': return <X size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'UPGRADE_ORGANIZER': return <Users size={16} />;
      case 'EVENT_DEPOSIT': return <Calendar size={16} />;
      default: return <CreditCard size={16} />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Calculate statistics
  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingAmount = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const completedCount = payments.filter(p => p.status === 'COMPLETED').length;
  const pendingCount = payments.filter(p => p.status === 'PENDING').length;

  if (loading) return <div className="ap-loading">Đang tải thanh toán...</div>;
  if (error) return <div className="ap-error">{error}</div>;

  return (
    <div className="ap-wrap">
      <div className="ap-toolbar">
        <div className="ap-toolbar__row">
          <h1 className="ap-title">Quản Lý Thanh Toán</h1>
          <div className="ap-toolbar__actions">
            <button className="ap-btn ap-btn--outline">
              <Download size={16} /> Xuất
            </button>
            <button className="ap-btn ap-btn--primary">
              <Filter size={16} /> Bộ Lọc Nâng Cao
            </button>
          </div>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="ap-grid">
        <div className="ap-card">
          <div className="ap-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#065f46'
              }}>
                <DollarSign size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, fontWeight: '500' }}>
                  Tổng Doanh Thu
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--ink)', margin: '0.25rem 0', letterSpacing: '-.02em' }}>
                  {formatCurrency(totalRevenue)}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#059669', margin: 0 }}>
                  <TrendingUp size={12} /> +12.5% so với tháng trước
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#92400e'
              }}>
                <Clock size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, fontWeight: '500' }}>
                  Số Tiền Chờ Xử Lý
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--ink)', margin: '0.25rem 0', letterSpacing: '-.02em' }}>
                  {formatCurrency(pendingAmount)}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#d97706', margin: 0 }}>
                  {pendingCount} giao dịch chờ xử lý
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1e40af'
              }}>
                <CheckCircle size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, fontWeight: '500' }}>
                  Thanh Toán Hoàn Thành
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--ink)', margin: '0.25rem 0', letterSpacing: '-.02em' }}>
                  {completedCount}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#059669', margin: 0 }}>
                  {((completedCount / payments.length) * 100).toFixed(1)}% tỷ lệ thành công
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7c3aed'
              }}>
                <CreditCard size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, fontWeight: '500' }}>
                  Tổng Giao Dịch
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--ink)', margin: '0.25rem 0', letterSpacing: '-.02em' }}>
                  {payments.length}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                  Tất cả giao dịch
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card__header">
          <h3 className="ap-card__title">Giao Dịch Thanh Toán ({filteredPayments.length})</h3>
          <p className="ap-card__desc">Quản lý và giám sát tất cả giao dịch thanh toán</p>
        </div>
        <div className="ap-card__body">
          <div className="ap-filters">
            <div className="ap-search">
              <Search size={16} className="ap-search__icon" />
              <input 
                placeholder="Tìm kiếm thanh toán..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Trạng Thái</label>
              <select 
                className="ap-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất Cả Trạng Thái</option>
                <option value="completed">Hoàn Thành</option>
                <option value="pending">Chờ Xử Lý</option>
                <option value="failed">Thất Bại</option>
              </select>
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Loại</label>
              <select 
                className="ap-filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tất Cả Loại</option>
                <option value="upgrade">Nâng Cấp Người Tổ Chức</option>
                <option value="deposit">Tiền Đặt Cọc Sự Kiện</option>
              </select>
            </div>
            <div className="ap-filter-group">
              <label className="ap-filter-label">Khoảng Ngày</label>
              <select 
                className="ap-filter-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Tất Cả Thời Gian</option>
                <option value="today">Hôm Nay</option>
                <option value="week">Tuần Này</option>
                <option value="month">Tháng Này</option>
              </select>
            </div>
          </div>

          <table className="ap-table">
            <thead>
              <tr>
                <th>Giao Dịch</th>
                <th>Người Dùng</th>
                <th>Số Tiền</th>
                <th>Loại</th>
                <th>Trạng Thái</th>
                <th>Phương Thức Thanh Toán</th>
                <th>Ngày</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--ink)', marginBottom: '0.25rem' }}>
                        {payment.orderCode}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {payment.description}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {payment.user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {payment.user.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td>
                    <span className={`ap-badge ap-badge--${payment.type.toLowerCase().includes('upgrade') ? 'event' : 'post'}`}>
                      {getTypeIcon(payment.type)}
                      {payment.type === 'UPGRADE_ORGANIZER' ? 'Upgrade' : 'Deposit'}
                    </span>
                  </td>
                  <td>
                    <span className={`ap-badge ap-badge--${payment.status.toLowerCase()}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                      {payment.paymentMethod}
                    </div>
                    {payment.bankInfo && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {payment.bankInfo.bankName}
                      </div>
                    )}
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--ink)' }}>
                        {formatDate(payment.createdAt)}
                      </div>
                      {payment.completedAt && (
                        <div style={{ fontSize: '0.75rem', color: '#059669' }}>
                          Hoàn thành: {formatDate(payment.completedAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="ap-btn ap-btn--outline ap-btn--sm">
                        <Eye size={14} />
                      </button>
                      {payment.status === 'PENDING' && (
                        <>
                          <button 
                            className="ap-btn ap-btn--success ap-btn--sm"
                            onClick={() => handleStatusChange(payment.id, 'COMPLETED')}
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button 
                            className="ap-btn ap-btn--danger ap-btn--sm"
                            onClick={() => handleStatusChange(payment.id, 'FAILED')}
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <caption>Hiển thị {filteredPayments.length} trong {payments.length} thanh toán</caption>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementPage;
