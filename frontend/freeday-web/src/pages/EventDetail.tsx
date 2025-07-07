import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '@/components/common/Button'

const EventDetail: React.FC = () => {
  const { id } = useParams()
  const [isRegistered, setIsRegistered] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  // Mock data cho event detail
  const event = {
    id: 1,
    title: 'Live Music Night',
    type: 'music',
    vibe: 'energetic',
    date: '2024-01-20',
    time: '20:00',
    location: 'Saigon Outcast',
    address: '188/1 Nguyễn Văn Hưởng, Thảo Điền, Quận 2, TP.HCM',
    price: 0,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    participants: 45,
    maxParticipants: 100,
    description: 'Đêm nhạc live với các nghệ sĩ trẻ tài năng. Không gian mở, âm nhạc chất lượng. Chúng ta sẽ có những màn trình diễn acoustic tuyệt vời từ các nghệ sĩ địa phương.',
    organizer: {
      name: 'Nguyễn Văn An',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      eventsCount: 15
    },
    requirements: [
      'Tuổi từ 18 trở lên',
      'Yêu thích âm nhạc',
      'Có thể mang theo đồ uống nhẹ'
    ],
    schedule: [
      { time: '19:30', activity: 'Check-in và giao lưu' },
      { time: '20:00', activity: 'Mở màn với acoustic set' },
      { time: '21:00', activity: 'Jam session tự do' },
      { time: '22:30', activity: 'Kết thúc và chụp ảnh' }
    ],
    participants: [
      { id: 1, name: 'Trần Thị Bình', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face', joinedAt: '2024-01-15' },
      { id: 2, name: 'Lê Văn Cường', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', joinedAt: '2024-01-16' },
      { id: 3, name: 'Phạm Thị Dung', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face', joinedAt: '2024-01-17' }
    ]
  }

  const handleRegister = () => {
    setIsRegistered(true)
    // Mock API call
  }

  const handleContactOrganizer = () => {
    // Mock contact functionality
    alert('Tính năng liên hệ sẽ được phát triển!')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-neutral-600">
          <li><Link to="/" className="hover:text-primary-600 transition-colors">Trang chủ</Link></li>
          <li>/</li>
          <li><Link to="/events" className="hover:text-primary-600 transition-colors">Sự kiện</Link></li>
          <li>/</li>
          <li className="text-neutral-900 font-medium">{event.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Event Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="badge badge-primary">Âm nhạc</span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="badge badge-secondary">Năng động</span>
            </div>
          </div>

          {/* Event Info */}
          <div className="card p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              {event.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-neutral-700">{event.date} - {event.time}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-neutral-700">{event.location}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-neutral-700">{event.participants}/{event.maxParticipants} người tham gia</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-neutral-700">
                    {event.price === 0 ? 'Miễn phí' : `${event.price.toLocaleString()}đ`}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-neutral-700">Người tổ chức: {event.organizer.name}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Mô tả</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">
                {event.description}
              </p>
              
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Yêu cầu</h3>
              <ul className="space-y-2 mb-6">
                {event.requirements.map((req, index) => (
                  <li key={index} className="flex items-center text-neutral-600">
                    <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Lịch trình</h3>
              <div className="space-y-3">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-neutral-50 rounded-xl">
                    <span className="font-medium text-primary-600 min-w-[60px]">{item.time}</span>
                    <span className="text-neutral-700 ml-4">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-neutral-900">
                Người tham gia ({event.participants.length})
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowParticipants(!showParticipants)}
              >
                {showParticipants ? 'Ẩn' : 'Xem tất cả'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.participants.slice(0, showParticipants ? undefined : 6).map((participant) => (
                <div key={participant.id} className="flex items-center p-3 bg-neutral-50 rounded-xl">
                  <img 
                    src={participant.avatar} 
                    alt={participant.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-neutral-900">{participant.name}</p>
                    <p className="text-sm text-neutral-500">Tham gia {participant.joinedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {event.price === 0 ? 'Miễn phí' : `${event.price.toLocaleString()}đ`}
              </div>
              <p className="text-neutral-600">
                {event.participants}/{event.maxParticipants} người đã đăng ký
              </p>
            </div>

            {isRegistered ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Đã đăng ký!</h3>
                <p className="text-neutral-600 mb-4">Bạn sẽ nhận được thông báo khi có cập nhật</p>
                <Button variant="outline" className="w-full">
                  Hủy đăng ký
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  onClick={handleRegister}
                  disabled={event.participants >= event.maxParticipants}
                >
                  {event.participants >= event.maxParticipants ? 'Đã đầy' : 'Đăng ký tham gia'}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleContactOrganizer}>
                  Liên hệ người tổ chức
                </Button>
              </div>
            )}
          </div>

          {/* Organizer Card */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Người tổ chức</h3>
            <div className="flex items-center mb-4">
              <img 
                src={event.organizer.avatar} 
                alt={event.organizer.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-medium text-neutral-900">{event.organizer.name}</p>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(event.organizer.rating) ? 'text-accent-500' : 'text-neutral-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">{event.organizer.rating}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Đã tổ chức {event.organizer.eventsCount} sự kiện
            </p>
            <Button variant="outline" className="w-full">
              Xem profile
            </Button>
          </div>

          {/* Share Card */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Chia sẻ</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Chia sẻ Facebook
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Chia sẻ Twitter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail 