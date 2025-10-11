import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './OrganizerPricingPage.css'; // Reuse the same CSS for consistent styling

const UserPricingPage = () => {
  const packages = [
    {
      name: 'Gói Premium',
      price: '39.000',
      period: 'tháng',
      popular: true,
      features: [
        'Truy cập Chatbot AI (Beta)',
        'Gợi ý sự kiện được cá nhân hóa',
        'Huy hiệu "Người dùng VIP" trên hồ sơ',
      ],
    },

  ];

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Nâng cấp trải nghiệm của bạn</h1>
        <p className="pricing-subtitle">
          Mở khóa các tính năng độc quyền để tận hưởng FreeDay một cách trọn vẹn nhất.
        </p>
      </div>
      <div className="pricing-grid">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`pricing-card ${pkg.popular ? 'popular' : ''}`}>
            {pkg.popular && <div className="popular-badge">Phổ biến</div>}
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
              to="/user-payment"
              state={{ package: { name: pkg.name, price: pkg.price, period: pkg.period } }}
              className="btn-subscribe"
            >
              Chọn gói này
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPricingPage;