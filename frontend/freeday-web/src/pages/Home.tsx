import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'

const Home: React.FC = () => {
  // Demo data
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Tìm bạn đồng hành',
      description: 'Kết nối với những người có cùng sở thích và tham gia sự kiện cùng nhau.',
      color: 'primary'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2zm10-10V7a4 4 0 00-8 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Sự kiện đa dạng',
      description: 'Khám phá hàng trăm sự kiện thú vị từ âm nhạc, thể thao đến văn hóa.',
      color: 'secondary'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'An toàn & Bảo mật',
      description: 'Hệ thống xác thực và bảo mật thông tin cá nhân của bạn.',
      color: 'accent'
    }
  ]

  const featuredEvents = [
    {
      id: 1,
      title: 'Live Music Night',
      type: 'music',
      vibe: 'energetic',
      date: '2024-01-20',
      time: '20:00',
      location: 'Saigon Outcast',
      price: 0,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      participants: 45,
      maxParticipants: 100
    },
    {
      id: 2,
      title: 'Bóng đá cộng đồng',
      type: 'sports',
      vibe: 'energetic',
      date: '2024-01-21',
      time: '16:00',
      location: 'Sân bóng Thảo Điền',
      price: 50000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      participants: 18,
      maxParticipants: 22
    },
    {
      id: 3,
      title: 'Workshop Nấu ăn',
      type: 'food',
      vibe: 'creative',
      date: '2024-01-19',
      time: '19:00',
      location: 'Cooking Studio',
      price: 200000,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      participants: 12,
      maxParticipants: 20
    },
    {
      id: 4,
      title: 'Hiking Bà Nà',
      type: 'outdoor',
      vibe: 'adventure',
      date: '2024-01-25',
      time: '07:00',
      location: 'Bà Nà Hills',
      price: 150000,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
      participants: 8,
      maxParticipants: 15
    },
    {
      id: 5,
      title: 'Photography Workshop',
      type: 'art',
      vibe: 'creative',
      date: '2024-01-22',
      time: '14:00',
      location: 'District 1',
      price: 300000,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      participants: 6,
      maxParticipants: 12
    },
    {
      id: 6,
      title: 'Board Game Night',
      type: 'social',
      vibe: 'chill',
      date: '2024-01-23',
      time: '19:30',
      location: 'Café 42',
      price: 0,
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop',
      participants: 15,
      maxParticipants: 25
    }
  ]

  const testimonials = [
    {
      name: 'Nguyễn Thị Anh',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8vNT_8SSDnlKe0RTZXp63Ga8XMIJGWF_jFA&s',
      content: 'Freeday giúp tôi tìm được những người bạn tuyệt vời và tham gia nhiều sự kiện thú vị!',
      rating: 5
    },
    {
      name: 'Trần Văn Bình',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuK3rI4OmFZ_Wxo4YVZgRFO1a50LU5x5NsA&s',
      content: 'Nền tảng rất dễ sử dụng và có nhiều sự kiện đa dạng. Tôi đã tham gia được 5 sự kiện chỉ trong 2 tháng!',
      rating: 5
    },
    {
      name: 'Lê Thị Cẩm',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkijd6jm283ibpY4-fj7aroi6OzS_rVrv0gA&s',
      content: 'Từ khi dùng Freeday, cuộc sống của tôi thú vị hơn nhiều. Tôi đã có thêm nhiều bạn mới!',
      rating: 5
    }
  ]

  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Kết nối cộng đồng
              <br />
              <span className="text-accent-300 animate-bounce-gentle">Tìm bạn đồng hành</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Tham gia các sự kiện thú vị cùng những người bạn mới. 
              Khám phá những trải nghiệm đáng nhớ và tạo ra những kỷ niệm tuyệt vời.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-neutral-100">
                Khám phá sự kiện
              </Button>
            </Link>
            <Link to="/forum">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-neutral-100">
                Tìm bạn đồng hành
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Khám phá những gì Freeday mang lại cho bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card card-hover p-8 text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <div className={`text-${feature.color}-600`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-neutral-900">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Sự kiện nổi bật
            </h2>
            <p className="text-lg text-neutral-600">
              Những sự kiện hot nhất tuần này
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <div key={event.id} className="card card-hover overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-primary">
                      {event.type === 'music' ? 'Âm nhạc' : 
                       event.type === 'sports' ? 'Thể thao' :
                       event.type === 'food' ? 'Ẩm thực' :
                       event.type === 'outdoor' ? 'Ngoài trời' :
                       event.type === 'art' ? 'Nghệ thuật' : 'Giao lưu'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-secondary">
                      {event.vibe === 'energetic' ? 'Năng động' :
                       event.vibe === 'creative' ? 'Sáng tạo' :
                       event.vibe === 'adventure' ? 'Phiêu lưu' : 'Thư giãn'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-medium">
                        {event.participants}/{event.maxParticipants} người
                      </span>
                      <span className="text-sm font-medium">
                        {event.price === 0 ? 'Miễn phí' : `${event.price.toLocaleString()}đ`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900">{event.title}</h3>
                  <div className="space-y-2 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
                      </svg>
                      {event.date} - {event.time}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">
                      {event.price === 0 ? 'Miễn phí' : `${event.price.toLocaleString()}đ`}
                    </span>
                    <Link to={`/events/${event.id}`}>
                      <Button size="sm">Xem chi tiết</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/events">
              <Button variant="outline" size="lg">
                Xem tất cả sự kiện
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Người dùng nói gì
            </h2>
            <p className="text-lg text-neutral-600">
              Những chia sẻ từ cộng đồng Freeday
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6 text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-600 mb-4 italic">"{testimonial.content}"</p>
                <h4 className="font-semibold text-neutral-900">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6" style={{ color: '#14532d', textShadow: '0 2px 8px #bbf7d0' }}>
            Sẵn sàng tham gia?
          </h2>
          <p className="text-xl mb-8" style={{ color: '#15803d', textShadow: '0 1px 6px #bbf7d0' }}>
            Hãy bắt đầu hành trình khám phá và kết nối ngay hôm nay!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-neutral-100">
                Đăng ký ngay
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-neutral-100">
                Khám phá sự kiện
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home