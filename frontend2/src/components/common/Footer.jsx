import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">

          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-heading">FreeDay</h3>
            <p className="footer-text">
              Nền tảng kết nối và khám phá sự kiện cuối tuần, giúp bạn tìm thấy niềm vui và những người bạn mới.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Đường dẫn</h3>
            <ul className="footer-links">
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/events">Sự kiện</Link></li>
              <li><Link to="/forum">Diễn đàn</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Mạng xã hội</h3>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="social-link" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3 className="footer-heading">Đăng ký nhận tin</h3>
            <p className="footer-text">Nhận thông tin về các sự kiện hot nhất hàng tuần.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Email của bạn" className="newsletter-input" />
              <button type="submit" className="newsletter-button" aria-label="Gửi">
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FreeDay. All rights reserved. A product of Group 4.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
