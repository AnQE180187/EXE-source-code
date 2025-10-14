import React, { useState } from 'react';
import { Save, RefreshCw, Bell, Shield, Globe, Database, Mail, Users, Calendar, AlertTriangle } from 'lucide-react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'FreeDay',
    siteDescription: 'Khám phá những sự kiện cuối tuần tuyệt vời và kết nối với những người có cùng sở thích',
    maintenanceMode: false,
    allowRegistration: true,
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@freeday.com',
    emailNotifications: true,
    
    // Security Settings
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    requireEmailVerification: true,
    enableTwoFactor: false,
    
    // Event Settings
    maxEventsPerUser: 10,
    eventApprovalRequired: false,
    allowEventCancellation: true,
    
    // User Settings
    defaultUserRole: 'Participant',
    allowProfileEditing: true,
    requireProfileCompletion: false,
  });

  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to default values
    setHasChanges(false);
  };

  const settingSections = [
    {
      id: 'general',
      title: 'Tổng Quan',
      icon: <Globe size={20} />,
      settings: [
        { key: 'siteName', label: 'Tên Trang Web', type: 'text', description: 'Tên của trang web của bạn' },
        { key: 'siteDescription', label: 'Mô Tả Trang Web', type: 'textarea', description: 'Mô tả ngắn gọn về nền tảng của bạn' },
        { key: 'maintenanceMode', label: 'Chế Độ Bảo Trì', type: 'checkbox', description: 'Bật chế độ bảo trì để hạn chế truy cập' },
        { key: 'allowRegistration', label: 'Cho Phép Đăng Ký', type: 'checkbox', description: 'Cho phép người dùng mới đăng ký' },
      ]
    },
    {
      id: 'email',
      title: 'Email',
      icon: <Mail size={20} />,
      settings: [
        { key: 'smtpHost', label: 'Máy Chủ SMTP', type: 'text', description: 'Tên máy chủ SMTP' },
        { key: 'smtpPort', label: 'Cổng SMTP', type: 'number', description: 'Cổng máy chủ SMTP' },
        { key: 'smtpUser', label: 'Người Dùng SMTP', type: 'text', description: 'Tên người dùng SMTP' },
        { key: 'emailNotifications', label: 'Thông Báo Email', type: 'checkbox', description: 'Gửi thông báo email cho người dùng' },
      ]
    },
    {
      id: 'security',
      title: 'Bảo Mật',
      icon: <Shield size={20} />,
      settings: [
        { key: 'sessionTimeout', label: 'Thời Gian Hết Phiên (giờ)', type: 'number', description: 'Thời gian người dùng đăng nhập' },
        { key: 'maxLoginAttempts', label: 'Số Lần Đăng Nhập Tối Đa', type: 'number', description: 'Số lần đăng nhập thất bại tối đa trước khi khóa' },
        { key: 'requireEmailVerification', label: 'Yêu Cầu Xác Thực Email', type: 'checkbox', description: 'Người dùng phải xác thực email của họ' },
        { key: 'enableTwoFactor', label: 'Bật Xác Thực Hai Yếu Tố', type: 'checkbox', description: 'Cho phép 2FA để tăng cường bảo mật' },
      ]
    },
    {
      id: 'events',
      title: 'Sự Kiện',
      icon: <Calendar size={20} />,
      settings: [
        { key: 'maxEventsPerUser', label: 'Số Sự Kiện Tối Đa Mỗi Người Dùng', type: 'number', description: 'Số sự kiện tối đa một người dùng có thể tạo' },
        { key: 'eventApprovalRequired', label: 'Yêu Cầu Phê Duyệt Sự Kiện', type: 'checkbox', description: 'Sự kiện cần phê duyệt của quản trị trước khi xuất bản' },
        { key: 'allowEventCancellation', label: 'Cho Phép Hủy Sự Kiện', type: 'checkbox', description: 'Cho phép người tổ chức hủy sự kiện' },
      ]
    },
    {
      id: 'users',
      title: 'Người Dùng',
      icon: <Users size={20} />,
      settings: [
        { key: 'defaultUserRole', label: 'Vai Trò Người Dùng Mặc Định', type: 'select', options: ['Participant', 'Organizer'], description: 'Vai trò mặc định cho người dùng mới' },
        { key: 'allowProfileEditing', label: 'Cho Phép Chỉnh Sửa Hồ Sơ', type: 'checkbox', description: 'Người dùng có thể chỉnh sửa hồ sơ của họ' },
        { key: 'requireProfileCompletion', label: 'Yêu Cầu Hoàn Thành Hồ Sơ', type: 'checkbox', description: 'Người dùng phải hoàn thành hồ sơ của họ' },
      ]
    },
  ];

  const renderSettingInput = (setting) => {
    const value = settings[setting.key];
    
    switch (setting.type) {
      case 'checkbox':
        return (
          <label className="settings-checkbox">
            <input
              type="checkbox"
              className="settings-checkbox__input"
              checked={value}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            />
            <span className="settings-checkbox__label">
              {setting.label}
            </span>
            <span className={`settings-checkbox__status ${value ? 'enabled' : 'disabled'}`}>
              {value ? 'Đã Bật' : 'Đã Tắt'}
            </span>
          </label>
        );
      case 'textarea':
        return (
          <textarea
            className="settings-field__textarea"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            placeholder={setting.description}
          />
        );
      case 'select':
        return (
          <select
            className="settings-field__select"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          >
            {setting.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={setting.type}
            className="settings-field__input"
            value={value}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            placeholder={setting.description}
          />
        );
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Cài Đặt Hệ Thống</h1>
        <div className="settings-actions">
          <button 
            className="ap-btn ap-btn--outline"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RefreshCw size={16} /> Đặt Lại
          </button>
          <button 
            className="ap-btn ap-btn--primary"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save size={16} /> Lưu Thay Đổi
          </button>
        </div>
      </div>

      <div className="settings-main">
        {/* Settings Navigation Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-sidebar__header">
            <h3 className="settings-sidebar__title">Cấu Hình</h3>
            <p className="settings-sidebar__desc">Quản lý cài đặt và tùy chọn toàn hệ thống</p>
          </div>
          <nav className="settings-nav">
            {settingSections.map(section => (
              <button
                key={section.id}
                className={`settings-nav__item ${activeTab === section.id ? 'active' : ''}`}
                onClick={() => setActiveTab(section.id)}
              >
                <span className="settings-nav__icon">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {settingSections.map(section => (
            activeTab === section.id && (
              <div key={section.id}>
                <div className="settings-content__header">
                  <span className="settings-content__icon">{section.icon}</span>
                  <h2 className="settings-content__title">Cài Đặt {section.title}</h2>
                </div>
                
                <div className="settings-form">
                  {section.settings.map(setting => (
                    <div key={setting.key} className="settings-field">
                      <label className="settings-field__label">
                        {setting.label}
                      </label>
                      <p className="settings-field__description">
                        {setting.description}
                      </p>
                      {renderSettingInput(setting)}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
