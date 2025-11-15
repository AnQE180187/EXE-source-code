import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, CalendarCheck, MessageSquare, Award, Star } from 'lucide-react';
import { getEvents } from '../services/eventService';
import { getPosts } from '../services/forumService';
import './HomePage.css';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured events - get top 3 events by registeredCount
        const eventsResponse = await getEvents({ 
          sort: 'popularity', 
          limit: '3' 
        });
        
        // Ensure we only take 3 events (slice in case backend returns more)
        const top3Events = Array.isArray(eventsResponse) ? eventsResponse.slice(0, 3) : [];
        
        // Map events to match frontend structure
        const mappedEvents = top3Events.map((event) => ({
          id: event.id,
          title: event.title,
          category: event.tags && event.tags.length > 0 
            ? event.tags[0].tag.name 
            : 'Khác',
          imageUrl: event.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1170&q=80',
        }));
        setFeaturedEvents(mappedEvents);

        // Fetch recent posts - get latest 3 posts
        const postsResponse = await getPosts({ sortBy: 'newest' });
        const latestPosts = postsResponse.slice(0, 3);
        
        // Map posts to match frontend structure
        const mappedPosts = latestPosts.map((post) => ({
          id: post.id,
          title: post.title,
          author: post.author?.profile?.displayName || post.author?.email || 'Người dùng',
          comments: post._count?.comments || 0,
        }));
        setRecentPosts(mappedPosts);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        // Set fallback empty arrays
        setFeaturedEvents([]);
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  }, [featuredEvents, recentPosts]); // Re-run observer when data changes

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

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="featured-events-grid" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Đang tải sự kiện...</p>
          </div>
        ) : featuredEvents.length > 0 ? (
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
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Chưa có sự kiện nổi bật nào.</p>
          </div>
        )}
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Đang tải bài viết...</p>
            </div>
          ) : recentPosts.length > 0 ? (
            <>
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
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Chưa có bài viết nào.</p>
              <Link to="/forum" className="hero__button hero__button--primary btn-press" style={{ marginTop: '1rem' }}>
                Vào Diễn đàn <ArrowRight size={18} />
              </Link>
            </div>
          )}
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
