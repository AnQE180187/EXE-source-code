import React from 'react';
import { Award, Users, Target, Heart, Facebook, Instagram } from 'lucide-react';
import './AboutPage.css';

const teamMembers = [
  { name: 'Lê Trần Như Thủy', role: 'Leader', imageUrl: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t1.15752-9/552409739_2218357935341645_5380644963875667638_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=103&ccb=1-7&_nc_sid=9f807c&_nc_ohc=8uoOPknzryYQ7kNvwGHwOrI&_nc_oc=AdnINZA92hEQLlhxFXTOfes5egbNbPr0_wOV3BwowNNULhd6wi1gcpg0mh7uLtg6-bY&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&oh=03_Q7cD3QH-ty__c6Q3X9MhryDyNxrVDgHWZrpjQMg8m2g4jJllyQ&oe=68FADED5' },
  { name: 'Trần Lê Tú Anh', role: 'Member', imageUrl: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t1.15752-9/552670230_721114497650219_5723539380627586731_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_ohc=wsAvd6dy3dEQ7kNvwG6OHed&_nc_oc=AdnR4lAcwWrU6WNXOBzhtJtX7QOHREk0eaBn3kPek5MsIyF_cQv_55jnuw_bYfxxZyo&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&oh=03_Q7cD3QFHaiZmmDO8klSY8bUQFBp_wqTtYgx5o_T821rakuS50g&oe=68FAD1E5' },
  { name: 'Lương Gia Khánh', role: 'Member', imageUrl: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t1.15752-9/516347945_753574907227917_5277974139696306356_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_ohc=YewxDEvCLA4Q7kNvwG8ZRYc&_nc_oc=AdmxpaaxtzfmoiltvKn7vcXFkYGK9W0L1A0sbPlq0XCOLy_O-9zFfSL_PxkSylKo0hI&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&oh=03_Q7cD3QGxAiR1gU0TfholZsHfsYmEJBKZ8zu1WPbGEhU1Vq9E7w&oe=68FACDC7' },
  { name: 'Lê Anh Khôi', role: 'Member', imageUrl: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t1.15752-9/552306879_793330349722485_5417145740558258876_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_ohc=SggYIrRgVqQQ7kNvwF8fn_r&_nc_oc=AdmUic9mq8OsoSQdv6fiy9l_2qk8BFrwCOdgz_zAgtZIXBqEkVQ7a376bm3aVv9reYA&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&oh=03_Q7cD3QFcH7ANb9QnZboXm8LrSb_56DXr_c1tyifIyhsLV6559Q&oe=68FAD462' },
  { name: 'Hoàng Lê Quý An', role: 'Member', imageUrl: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t1.15752-9/552085109_1848770599405288_2568185155500540463_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=9f807c&_nc_ohc=EeoO3l-PjJEQ7kNvwGnBUx4&_nc_oc=AdmCVb1rT1rbRpYOK6zJVyZqYsTff_YAsZ3jfiNxzTr8meNKLGBhuAJ3WRl3_ZyoEGw&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&oh=03_Q7cD3QEDpHR2UV8Z9nsQplWVQMrxS2TLFuj8hHe_R6Y8f_604A&oe=68FAE534' },
  { name: 'Cao Phan Thanh Phong', role: 'Member', imageUrl: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t1.15752-9/552601470_1127968402850651_7301695821784219406_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_ohc=b_bx1a6RYO0Q7kNvwGnak2N&_nc_oc=Adm3vZH5t1YYHwy7p79Q0JvIFQvxptju0PxQT2d-NZmW-lg7IaHKbGA2HyhcC84E2Fw&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&oh=03_Q7cD3QHoWknq8v-gLv6KKIIyZ18wuiF19UZ_MNVBraIslEF6bQ&oe=68FAB549' },
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
              <img src={member.imageUrl} alt={member.name} className="team-member__image" />
              <h3 className="team-member__name">{member.name}</h3>
              <p className="team-member__role">{member.role}</p>
              <div className="team-member__socials">
                <a href="#"><Facebook size={18} /></a> 
                <a href="#"><Instagram size={18} /></a> 
              </div>
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