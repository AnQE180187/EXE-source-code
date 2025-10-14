import React from 'react';
import { Award, Users, Target, Heart, Linkedin, Github } from 'lucide-react';
import './AboutPage.css';

const teamMembers = [
  { name: 'Hoàng Lê Quý An', role: 'Leader',  imageUrl: '' },
  { name: 'Nguyễn Trần Quang Nhật', role: 'Member', imageUrl: '' },
  { name: 'Lương Gia Khánh', role: 'Member', imageUrl: '' },
  { name: 'Lê Anh Khôi', role: 'Member', imageUrl: '' },
  { name: 'Nguyễn Đăng Nhân', role: 'Member', imageUrl: '' },
];

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__content">
          <h1 className="about-hero__title">Về <span className="highlight">FreeDay</span></h1>
          <p className="about-hero__subtitle">
            Chúng tôi tin rằng mỗi khi rảnh rỗi là một cơ hội để tạo nên những kỷ niệm đáng nhớ. FreeDay là nền tảng kết nối bạn với những sự kiện và cộng đồng cùng chung sở thích, biến những ngày bình thường trở nên phi thường.
          </p>
        </div>
      </section>

      {/* Our Mission & Vision Section */}
      <section className="mission-vision">
        <div className="mission-vision__card">
          <Target className="mission-vision__icon" />
          <h2 className="mission-vision__title">Sứ mệnh</h2>
          <p className="mission-vision__text">Giúp mọi người dễ dàng tìm kiếm, tham gia và tạo ra các sự kiện ý nghĩa, xây dựng một cộng đồng năng động và gắn kết.</p>
        </div>
        <div className="mission-vision__card">
          <Award className="mission-vision__icon" />
          <h2 className="mission-vision__title">Tầm nhìn</h2>
          <p className="mission-vision__text">Trở thành nền tảng hàng đầu tại Việt Nam cho việc khám phá và trải nghiệm sự kiện, nơi mọi cá nhân đều có thể tìm thấy niềm vui và sự kết nối.</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2 className="section-title">Gặp gỡ đội ngũ</h2>
        <p className="section-subtitle">Chúng tôi là những người đam mê công nghệ và kết nối cộng đồng, cùng nhau xây dựng FreeDay.</p>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member-card">
              {/* <img src={member.imageUrl} alt={member.name} className="team-member__image" /> */}
              <h3 className="team-member__name">{member.name}</h3>
              <p className="team-member__role">{member.role}</p>
              {/* <div className="team-member__socials">
                <a href="#"><Github size={18} /></a>
                <a href="#"><Linkedin size={18} /></a>
              </div> */}
            </div>
          ))}
        </div>
      </section>

      {/* Our Values Section */}
      <section className="values-section">
        <h2 className="section-title">Giá trị cốt lõi</h2>
        <div className="values-grid">
          <div className="value-card">
            <Users size={32} />
            <h3>Cộng đồng</h3>
            <p>Xây dựng một không gian an toàn và thân thiện để mọi người kết nối.</p>
          </div>
          <div className="value-card">
            <Heart size={32} />
            <h3>Đam mê</h3>
            <p>Thúc đẩy mọi người theo đuổi và chia sẻ sở thích của mình.</p>
          </div>
          <div className="value-card">
            <Target size={32} />
            <h3>Trải nghiệm</h3>
            <p>Tập trung vào việc mang lại những trải nghiệm chân thực và đáng nhớ.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
