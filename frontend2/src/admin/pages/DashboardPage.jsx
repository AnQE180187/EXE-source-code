import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, Flag, TrendingUp, Plus, RefreshCcw, Search, DollarSign, CreditCard, Activity, AlertCircle } from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { getDashboardStats } from '../../services/adminService';
import RevenueChart from '../components/RevenueChart'; // Import the new chart component
import './DashboardPage.css';

// Helper to format numbers
const formatNumber = (num) => num?.toLocaleString('vi-VN') || '0';
const formatCurrency = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

const StatCard = ({ icon, label, value, trend, trendLabel }) => (
  <div className="ad-card">
    <div className="ad-card__body">
      <div className="ad-stat">
        <div className="ad-stat__icon">{icon}</div>
        <div className="ad-stat__meta">
          <p className="ad-stat__label">{label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p className="ad-stat__value">{value}</p>
            {trend && (
              <span className="ad-stat__trend">
                <TrendingUp size={14} /> {trend}
              </span>
            )}
          </div>
          {trendLabel && <p className="ad-stat__sub">{trendLabel}</p>}
        </div>
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, description, children, footer }) => (
  <div className="ad-card">
    <div className="ad-card__header">
      <h3 className="ad-card__title">{title}</h3>
      {description && <p className="ad-card__desc">{description}</p>}
    </div>
    <div className="ad-card__body">{children}</div>
    {footer && <div className="ad-card__footer">{footer}</div>}
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Không thể tải dữ liệu bảng điều khiển.');
      toast.error(err.message || 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchStats();
  };

  const handleCreateEvent = () => {
    navigate('/admin/events');
    toast.info('Redirecting to Event Management...');
  };

  if (loading) {
    return <div className="ad-loading-full-page">Đang tải dữ liệu bảng điều khiển...</div>;
  }

  if (error) {
    return <div className="ad-error-full-page">{error}</div>;
  }

  return (
    <div className="ad-wrap">
      <div className="ad-toolbar">
        <div className="ad-toolbar__row">
          <h1 className="ad-title">Bảng Điều Khiển Quản Trị</h1>
          <div className="ad-toolbar__actions">
            <button className="ad-btn ad-btn--outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCcw size={16} /> {loading ? 'Đang tải...' : 'Làm Mới'}
            </button>
            <button className="ad-btn ad-btn--primary" onClick={handleCreateEvent}>
              <Plus size={16} /> Sự Kiện Mới
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ad-grid">
        <StatCard icon={<Users size={24} />} label="Tổng Người Dùng" value={formatNumber(stats?.totalUsers)} />
        <StatCard icon={<Calendar size={24} />} label="Tổng Sự Kiện" value={formatNumber(stats?.totalEvents)} />
        <StatCard icon={<DollarSign size={24} />} label="Tổng Doanh Thu" value={formatCurrency(stats?.totalRevenue)} />
        <StatCard icon={<CreditCard size={24} />} label="Giao Dịch" value={formatNumber(stats?.totalTransactions)} />
        <StatCard icon={<FileText size={24} />} label="Tổng Bài Viết" value={formatNumber(stats?.totalPosts)} />
        <StatCard icon={<Flag size={24} />} label="Báo Cáo Mở" value={formatNumber(stats?.openReports)} />
      </div>

      <div className="ad-columns">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <SectionCard title="Tổng Quan Doanh Thu" description="Doanh thu từ gói nâng cấp và 15% hoa hồng đặt cọc sự kiện">
            <RevenueChart />
          </SectionCard>

          <SectionCard title="Thông Tin Nhanh">
            <div className="ad-tabs">
              <div className="ad-tabs__list">
                <button className="ad-tabs__btn" aria-selected={activeTab === 'users'} onClick={() => setActiveTab('users')}>Người Dùng</button>
                <button className="ad-tabs__btn" aria-selected={activeTab === 'events'} onClick={() => setActiveTab('events')}>Sự Kiện</button>
                <button className="ad-tabs__btn" aria-selected={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>Báo Cáo</button>
              </div>
            </div>
            {activeTab === 'users' && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0, marginBottom: '1rem' }}>Đăng ký mới nhất</p>
                <table className="ad-table">
                  <thead><tr><th>Tên</th><th>Email</th><th>Tham Gia</th></tr></thead>
                  <tbody>
                    {stats?.recentUsers?.map(u => (
                      <tr key={u.id}><td>{u.profile?.displayName || 'N/A'}</td><td>{u.email}</td><td>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'events' && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem', margin: 0 }}>Sự kiện được tạo gần đây</p>
                <table className="ad-table">
                  <thead><tr><th>Tiêu Đề</th><th>Ngày Bắt Đầu</th><th>Trạng Thái</th></tr></thead>
                  <tbody>
                    {stats?.recentEvents?.map(e => (
                      <tr key={e.id}><td>{e.title}</td><td>{new Date(e.startAt).toLocaleDateString('vi-VN')}</td><td>{e.status}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reports' && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem', margin: 0 }}>Báo cáo mở cần chú ý</p>
                <table className="ad-table">
                  <thead><tr><th>Lý Do</th><th>Loại</th><th>Ngày Mở</th></tr></thead>
                  <tbody>
                    {stats?.recentOpenReports?.map(r => (
                      <tr key={r.id}>
                        <td>{r.reason}</td>
                        <td>{r.targetPostId ? 'Post' : r.targetEventId ? 'Event' : 'Comment'}</td>
                        <td>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SectionCard title="Hoạt Động Gần Đây" description="Cập nhật hệ thống và kiểm duyệt">
            <ul className="ad-activity">
              {stats?.recentActivities?.length > 0 ? stats.recentActivities.map(log => (
                <li key={log.id}>
                  <span style={{ fontWeight: '600' }}>{log.actor?.profile?.displayName || 'Hệ thống'}</span> {log.action}
                  <span style={{ color: '#9ca3af' }}> · {new Date(log.createdAt).toLocaleString('vi-VN')}</span>
                </li>
              )) : <p>Không có hoạt động gần đây.</p>}
            </ul>
          </SectionCard>

          <SectionCard title="Hành Động Nhanh">
            <div className="ad-actions">
              <button className="ad-btn ad-btn--primary" onClick={handleCreateEvent}><Plus size={16} /> Tạo Sự Kiện</button>
              <button className="ad-btn ad-btn--outline" onClick={() => navigate('/admin/users')}>Quản Lý Người Dùng</button>
              <button className="ad-btn ad-btn--outline" onClick={() => navigate('/admin/reports')}>Xem Báo Cáo</button>
              <button className="ad-btn ad-btn--outline" onClick={() => navigate('/admin/audit-logs')}>Nhật Ký Kiểm Tra</button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
