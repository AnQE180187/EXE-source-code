import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, CalendarCheck, MessageSquare, Award, Star } from 'lucide-react';
import './HomePage.css';

// Dummy data - in a real app, this would come from an API
const featuredEvents = [
  {
    id: 1,
    title: 'Hội thảo Công nghệ Tương lai',
    category: 'Công nghệ',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 2,
    title: 'Workshop Thiết kế UI/UX Chuyên sâu',
    category: 'Thiết kế',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=764&q=80',
  },
  {
    id: 3,
    title: 'Lễ hội Âm nhạc Đa sắc màu',
    category: 'Âm nhạc',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1074&q=80',
  },
];

const recentPosts = [
  { id: 1, title: 'Tìm bạn đi xem concert cuối tuần này!', author: 'An Nguyễn', comments: 12 },
  { id: 2, title: 'Ai có hứng thú với workshop làm gốm không?', author: 'Bảo Trân', comments: 8 },
  { id: 3, title: 'Chia sẻ kinh nghiệm tham gia marathon', author: 'Minh Hoàng', comments: 5 },
];

const HomePage = () => {
  // IntersectionObserver: lướt tới đâu hiện tới đó
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target); // animate 1 lần
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -10% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="home-page page-fade">
      {/* Hero */}
      <section className="hero reveal fade-up">
        <div className="hero__content glass">
          <h1 className="hero__title">
            Tìm kiếm - Kết nối - <span className="hero__title--highlight">Trải nghiệm</span>
          </h1>
          <p className="hero__subtitle">
            Khám phá hàng ngàn sự kiện cuối tuần thú vị và tham gia cùng cộng đồng những người cùng sở thích.
          </p>
          <div className="hero__actions">
            <Link to="/events" className="hero__button hero__button--primary btn-press">
              Khám phá Sự kiện <ArrowRight size={18} />
            </Link>
            <Link to="/forum" className="hero__button hero__button--secondary btn-press">
              Tham gia Diễn đàn
            </Link>
          </div>

          {/* trust strip */}
          <div className="trust-strip">
            <div className="trust-item">
              <Star size={16} /> 4.9/5 từ cộng đồng
            </div>
            <div className="trust-dot" />
            <div className="trust-item">
              <Users size={16} /> 50k+ thành viên
            </div>
            <div className="trust-dot" />
            <div className="trust-item">
              <CalendarCheck size={16} /> 2k+ sự kiện/tháng
            </div>
          </div>
        </div>
        {/* ánh sáng hero chạy ngang */}
        <span className="hero-shine" aria-hidden />
      </section>

      {/* Featured Events */}
      <section className="page-section reveal fade-up">
        <h2 className="section-heading">
          SỰ KIỆN <span className="section-heading--highlight">NỔI BẬT</span>
        </h2>

        <div className="featured-events-grid">
          {featuredEvents.map((event, i) => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="event-card reveal zoom-in small-stagger"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <img src={event.imageUrl} alt={event.title} className="event-card__image parallax-img" />
              <div className="event-card__overlay">
                <span className="event-card__category">{event.category}</span>
                <h3 className="event-card__title">{event.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="page-section how-it-works reveal fade-up">
        <h2 className="section-heading">
          BẮT ĐẦU <span className="section-heading--highlight">DỄ DÀNG</span>
        </h2>

        <div className="steps-grid">
          {[
            { icon: <Search size={28} />, title: '1. Tìm kiếm', desc: 'Lọc theo sở thích, địa điểm, thời gian.' },
            { icon: <CalendarCheck size={28} />, title: '2. Đăng ký', desc: 'Đăng ký nhanh trong vài giây.' },
            { icon: <Users size={28} />, title: '3. Kết nối', desc: 'Trò chuyện, tìm bạn đồng hành.' },
            { icon: <Award size={28} />, title: '4. Trải nghiệm', desc: 'Tận hưởng & chia sẻ kỷ niệm.' },
          ].map((s, i) => (
            <div className="step-card reveal fade-up small-stagger" style={{ transitionDelay: `${i * 90}ms` }} key={i}>
              <div className="step-card__icon-wrapper float-pop">{s.icon}</div>
              <h3 className="step-card__title">{s.title}</h3>
              <p className="step-card__description">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Forum preview */}
      <section className="page-section reveal fade-up">
        <h2 className="section-heading">
          CỘNG ĐỒNG <span className="section-heading--highlight"> SÔI ĐỘNG</span>
        </h2>

        <div className="forum-preview">
          <ul className="post-list">
            {recentPosts.map((post, i) => (
              <li key={post.id} className="post-item reveal fade-right" style={{ transitionDelay: `${i * 80}ms` }}>
                <Link to={`/forum/${post.id}`} className="post-item__link hover-lift">
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

          <div className="forum-preview__cta reveal fade-up" style={{ transitionDelay: '220ms' }}>
            <p>... và hàng trăm cuộc thảo luận khác đang chờ bạn!</p>
            <Link to="/forum" className="hero__button hero__button--primary btn-press">
              Vào Diễn đàn <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section reveal fade-up gradient-shine">
        <div className="cta-section__content">
          <h2 className="cta-section__title">Sẵn sàng cho những cuộc vui?</h2>
          <p className="cta-section__subtitle">
            Tạo tài khoản miễn phí ngay hôm nay để không bỏ lỡ bất kỳ sự kiện hấp dẫn nào và bắt đầu kết nối với cộng đồng.
          </p>
          <Link to="/register" className="cta-section__button btn-press">
            Đăng ký ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
