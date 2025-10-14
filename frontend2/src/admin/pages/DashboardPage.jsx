import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, Flag, TrendingUp, Plus, RefreshCcw, Search, DollarSign, CreditCard } from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '../../components/ui/Table';
import './DashboardPage.css';

const StatCard = ({ icon, label, value, trend, trendLabel }) => (
  <div className="ad-card">
    <div className="ad-card__body">
      <div className="ad-stat">
        <div className="ad-stat__icon">
      {icon}
    </div>
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
    <div className="ad-card__body">
      {children}
    </div>
    {footer && <div className="ad-card__footer">{footer}</div>}
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Static sample data for UI only
  const recentUsers = [
    { id: 'U-1045', name: 'Nguyen Van A', email: 'a@example.com', joined: '2025-10-01' },
    { id: 'U-1044', name: 'Tran Thi B', email: 'b@example.com', joined: '2025-09-28' },
    { id: 'U-1043', name: 'Le Van C', email: 'c@example.com', joined: '2025-09-25' },
  ];

  const recentEvents = [
    { id: 'E-2201', title: 'Tech Meetup 2025', date: '2025-10-21', status: 'Published' },
    { id: 'E-2200', title: 'Music Night', date: '2025-10-18', status: 'Draft' },
    { id: 'E-2199', title: 'Startup Pitch', date: '2025-10-15', status: 'Published' },
  ];

  const openReports = [
    { id: 'R-301', type: 'Post', subject: 'Spam content in forum', opened: '2025-10-10' },
    { id: 'R-300', type: 'User', subject: 'Impersonation', opened: '2025-10-09' },
    { id: 'R-299', type: 'Event', subject: 'Inappropriate title', opened: '2025-10-08' },
  ];

  const [activeTab, setActiveTab] = useState('users');

  const handleRefresh = () => {
    // In a real app, this would refresh all data
    console.log('Refreshing dashboard data...');
    toast.success('Dashboard data refreshed successfully!');
    // You could add a loading state here
  };

  const handleCreateEvent = () => {
    // Navigate to event creation page or open modal
    navigate('/admin/events');
    toast.info('Redirecting to Event Management...');
  };

  return (
    <div className="ad-wrap">
      <div className="ad-toolbar">
        <div className="ad-toolbar__row">
          <h1 className="ad-title">Bảng Điều Khiển Quản Trị</h1>
          <div className="ad-toolbar__actions">
            <button className="ad-btn ad-btn--outline" onClick={handleRefresh}>
              <RefreshCcw size={16} /> Làm Mới
            </button>
            <button className="ad-btn ad-btn--primary" onClick={handleCreateEvent}>
              <Plus size={16} /> Sự Kiện Mới
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ad-grid">
        <StatCard icon={<Users size={24} />} label="Tổng Người Dùng" value="1,250" trend="+3.2%" trendLabel="so với 7 ngày qua" />
        <StatCard icon={<Calendar size={24} />} label="Tổng Sự Kiện" value="340" trend="+1.1%" trendLabel="so với 7 ngày qua" />
        <StatCard icon={<DollarSign size={24} />} label="Tổng Doanh Thu" value="₫2.5M" trend="+8.5%" trendLabel="so với tháng trước" />
        <StatCard icon={<CreditCard size={24} />} label="Giao Dịch" value="156" trend="+12.3%" trendLabel="so với tuần trước" />
        <StatCard icon={<FileText size={24} />} label="Tổng Bài Viết" value="2,890" trend="+0.6%" trendLabel="so với 7 ngày qua" />
        <StatCard icon={<Flag size={24} />} label="Báo Cáo Mở" value="12" trendLabel="0 mới hôm nay" />
      </div>

      <div className="ad-columns">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SectionCard title="Tổng Quan Hệ Thống" description="Xu hướng hoạt động của người dùng, sự kiện và báo cáo">
            <div className="ad-chart">
              <div className="ad-chart__content">
                <TrendingUp size={48} className="ad-chart__icon" />
                <p>Biểu đồ mẫu</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Tích hợp thư viện biểu đồ ưa thích của bạn</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Thông Tin Nhanh">
            <div className="ad-tabs">
              <div className="ad-tabs__list">
                <button className="ad-tabs__btn" aria-selected={activeTab==='users'} onClick={() => setActiveTab('users')}>Người Dùng</button>
                <button className="ad-tabs__btn" aria-selected={activeTab==='events'} onClick={() => setActiveTab('events')}>Sự Kiện</button>
                <button className="ad-tabs__btn" aria-selected={activeTab==='reports'} onClick={() => setActiveTab('reports')}>Báo Cáo</button>
              </div>
            </div>
            {activeTab === 'users' && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: 0 }}>Đăng ký mới nhất</p>
                  <div className="ad-search">
                    <Search size={16} className="ad-search__icon" />
                    <input placeholder="Tìm kiếm người dùng..." />
                  </div>
                </div>
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Tham Gia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(u => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                  <caption>Hiển thị 3 người dùng gần đây nhất</caption>
                </table>
              </div>
            )}

            {activeTab === 'events' && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem', margin: 0 }}>Sự kiện được tạo gần đây nhất</p>
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tiêu Đề</th>
                      <th>Ngày</th>
                      <th>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map(e => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{e.title}</td>
                        <td>{e.date}</td>
                        <td>{e.status}</td>
                      </tr>
                    ))}
                  </tbody>
                  <caption>Hiển thị 3 sự kiện gần đây nhất</caption>
                </table>
              </div>
            )}

            {activeTab === 'reports' && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem', margin: 0 }}>Báo cáo mở cần chú ý</p>
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Loại</th>
                      <th>Chủ Đề</th>
                      <th>Mở</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openReports.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.type}</td>
                        <td>{r.subject}</td>
                        <td>{r.opened}</td>
                      </tr>
                    ))}
                  </tbody>
                  <caption>3 báo cáo mở</caption>
                </table>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SectionCard title="Hoạt Động Gần Đây" description="Cập nhật hệ thống và kiểm duyệt">
            <ul className="ad-activity">
              <li>
                <span style={{ fontWeight: '600' }}>Quản trị viên</span> đã phê duyệt sự kiện <span style={{ fontWeight: '600' }}>Tech Meetup 2025</span>
                <span style={{ color: '#9ca3af' }}> · 2 giờ trước</span>
              </li>
              <li>
                <span style={{ fontWeight: '600' }}>Người kiểm duyệt</span> đã xóa một bài viết spam
                <span style={{ color: '#9ca3af' }}> · 4 giờ trước</span>
              </li>
              <li>
                Người dùng mới <span style={{ fontWeight: '600' }}>Pham D</span> đã đăng ký
                <span style={{ color: '#9ca3af' }}> · 1 ngày trước</span>
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="Hành Động Nhanh">
            <div className="ad-actions">
              <button className="ad-btn ad-btn--primary">
                <Plus size={16} /> Tạo Sự Kiện
              </button>
              <button 
                className="ad-btn ad-btn--outline"
                onClick={() => navigate('/admin/users')}
              >
                Quản Lý Người Dùng
              </button>
              <button 
                className="ad-btn ad-btn--outline"
                onClick={() => navigate('/admin/reports')}
              >
                Xem Báo Cáo
              </button>
              <button 
                className="ad-btn ad-btn--outline"
                onClick={() => navigate('/admin/audit-logs')}
              >
                Nhật Ký Kiểm Tra
              </button>
          </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
