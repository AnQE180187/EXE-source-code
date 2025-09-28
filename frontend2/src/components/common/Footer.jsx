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
              FREEDAY – Nền tảng tổng hợp hoạt động & sự kiện cho giới trẻ Quy Nhơn. Cá nhân hóa trải nghiệm, kết nối bạn đồng hành, đảm bảo chất lượng.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Đường dẫn</h3>
            <ul className="footer-links">
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/events">Sự kiện</Link></li>
              <li><Link to="/forum">Diễn đàn</Link></li>
              <li><a href="https://www.facebook.com/profile.php?id=61577315172960">Liên Hệ</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Mạng xã hội</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/profile.php?id=61577315172960" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
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
          <p>&copy; {new Date().getFullYear()} FreeDay. Tất cả quyền được bảo lưu. Được tạo với FreeDayTeam tại Việt Nam.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
