import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, CalendarCheck, MessageSquare, Award, Star } from 'lucide-react';
import './HomePage.css';

// Dummy data - in a real app, this would come from an API
const featuredEvents = [
  {
    id: 1,
    title: 'Hội thảo Công nghệ Tương lai',
    category: 'Công nghệ',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 2,
    title: 'Workshop Thiết kế UI/UX Chuyên sâu',
    category: 'Thiết kế',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
  },
  {
    id: 3,
    title: 'Lễ hội Âm nhạc Đa sắc màu',
    category: 'Âm nhạc',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  },
];

const recentPosts = [
    { id: 1, title: "Tìm bạn đi xem concert cuối tuần này!", author: "An Nguyễn", comments: 12 },
    { id: 2, title: "Ai có hứng thú với workshop làm gốm không?", author: "Bảo Trân", comments: 8 },
    { id: 3, title: "Chia sẻ kinh nghiệm tham gia marathon", author: "Minh Hoàng", comments: 5 },
]

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            Tìm kiếm. Kết nối. <span className="hero__title--highlight">Trải nghiệm.</span>
          </h1>
          <p className="hero__subtitle">
            Khám phá hàng ngàn sự kiện cuối tuần thú vị và tham gia cùng cộng đồng những người cùng sở thích. Cuộc sống là những chuyến đi!
          </p>
          <div className="hero__actions">
            <Link to="/events" className="hero__button hero__button--primary">
              Khám phá Sự kiện <ArrowRight size={20} />
            </Link>
            <Link to="/forum" className="hero__button hero__button--secondary">
              Tham gia Diễn đàn
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="page-section">
        <h2 className="section-heading">SỰ KIỆN <span className="section-heading--highlight">NỔI BẬT</span></h2>
        <div className="featured-events-grid">
          {featuredEvents.map(event => (
            <Link to={`/events/${event.id}`} key={event.id} className="event-card">
              <img src={event.imageUrl} alt={event.title} className="event-card__image" />
              <div className="event-card__overlay">
                <span className="event-card__category">{event.category}</span>
                <h3 className="event-card__title">{event.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="page-section how-it-works">
        <h2 className="section-heading">BẮT ĐẦU <span className="section-heading--highlight">DỄ DÀNG</span></h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-card__icon-wrapper"><Search size={32} /></div>
            <h3 className="step-card__title">1. Tìm kiếm</h3>
            <p className="step-card__description">Duyệt qua danh sách hoặc tìm kiếm sự kiện theo sở thích, địa điểm và thời gian.</p>
          </div>
          <div className="step-card">
            <div className="step-card__icon-wrapper"><CalendarCheck size={32} /></div>
            <h3 className="step-card__title">2. Đăng ký</h3>
            <p className="step-card__description">Chọn sự kiện bạn yêu thích và đăng ký tham gia chỉ với vài cú nhấp chuột.</p>
          </div>
          <div className="step-card">
            <div className="step-card__icon-wrapper"><Users size={32} /></div>
            <h3 className="step-card__title">3. Kết nối</h3>
            <p className="step-card__description">Tham gia diễn đàn, tìm bạn đồng hành và trò chuyện trước thềm sự kiện.</p>
          </div>
          <div className="step-card">
            <div className="step-card__icon-wrapper"><Award size={32} /></div>
            <h3 className="step-card__title">4. Trải nghiệm</h3>
            <p className="step-card__description">Tận hưởng những khoảnh khắc tuyệt vời và chia sẻ kỷ niệm của bạn.</p>
          </div>
        </div>
      </section>

      {/* Community Forum Section */}
      <section className="page-section">
        <h2 className="section-heading">CỘNG ĐỒNG <span className="section-heading--highlight"> SÔI ĐỘNG</span></h2>
        <div className="forum-preview">
            <ul className="post-list">
                {recentPosts.map(post => (
                    <li key={post.id} className="post-item">
                        <Link to={`/forum/${post.id}`} className="post-item__link">
                            <h4 className="post-item__title">{post.title}</h4>
                            <div className="post-item__meta">
                                <span>bởi {post.author}</span>
                                <span className="post-item__comments">
                                    <MessageSquare size={14} /> {post.comments}
                                </span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="forum-preview__cta">
                <p>... và hàng trăm cuộc thảo luận khác đang chờ bạn!</p>
                <Link to="/forum" className="hero__button hero__button--primary">
                    Vào Diễn đàn <ArrowRight size={20} />
                </Link>
            </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-section__content">
          <h2 className="cta-section__title">Sẵn sàng cho những cuộc vui?</h2>
          <p className="cta-section__subtitle">
            Tạo tài khoản miễn phí ngay hôm nay để không bỏ lỡ bất kỳ sự kiện hấp dẫn nào và bắt đầu kết nối với cộng đồng.
          </p>
          <Link to="/register" className="cta-section__button">
            Đăng ký ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;