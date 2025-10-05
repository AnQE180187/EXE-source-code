import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './OrganizerPricingPage.css';

const OrganizerPricingPage = () => {
  const packages = [
    {
      name: 'Gói Business Pro',
      price: '4.000',
      period: 'tháng',
      features: [
        'Ưu tiên hiển thị lên đầu( luôn nằm trong top )',

      ],
    },
    {
      name: 'Gói Premium',
      price: '4.000',
      period: 'tháng',
      popular: true,
      features: [
        'Đăng nhiều sự kiện',
        'Quảng bá trên fanpage',
        'Ưu tiên hiển thị & xem dữ liệu khách hàng',
      ],
    }

  ];

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Trở thành Nhà tổ chức</h1>
        <p className="pricing-subtitle">
          Chọn gói phù hợp với bạn và bắt đầu tạo sự kiện ngay hôm nay!
        </p>
      </div>
      <div className="pricing-grid">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`pricing-card ${pkg.popular ? 'popular' : ''}`}>

            <div className="card-header">
              <h2>{pkg.name}</h2>
              <p className="price">
                {pkg.price} <span className="currency">VND</span>
                <span className="price-period">/{pkg.period}</span>
              </p>
            </div>
            <ul className="features-list">
              {pkg.features.map((feature) => (
                <li key={feature}>
                  <CheckCircle className="feature-icon" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/organizer-payment"
              state={{ package: { name: pkg.name, price: pkg.price, period: pkg.period } }}
              className="btn-subscribe"
            >
              Đăng ký ngay
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerPricingPage;