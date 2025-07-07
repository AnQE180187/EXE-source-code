import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedVibe, setSelectedVibe] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')

  const eventTypes = [
    { id: 'all', name: 'Tất cả' },
    { id: 'music', name: 'Âm nhạc' },
    { id: 'sports', name: 'Thể thao' },
    { id: 'food', name: 'Ẩm thực' },
    { id: 'outdoor', name: 'Ngoài trời' },
    { id: 'art', name: 'Nghệ thuật' },
    { id: 'social', name: 'Giao lưu' },
    { id: 'tech', name: 'Công nghệ' }
  ]

  const vibes = [
    { id: 'all', name: 'Tất cả' },
    { id: 'energetic', name: 'Năng động' },
    { id: 'chill', name: 'Thư giãn' },
    { id: 'creative', name: 'Sáng tạo' },
    { id: 'adventure', name: 'Phiêu lưu' },
    { id: 'social', name: 'Giao lưu' }
  ]

  const priceRanges = [
    { id: 'all', name: 'Tất cả' },
    { id: 'free', name: 'Miễn phí' },
    { id: 'low', name: 'Dưới 100k' },
    { id: 'medium', name: '100k - 500k' },
    { id: 'high', name: 'Trên 500k' }
  ]

  // Mock data với nhiều sự kiện hơn
  const events = [
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
      maxParticipants: 100,
      description: 'Đêm nhạc live với các nghệ sĩ trẻ tài năng. Không gian mở, âm nhạc chất lượng.'
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
      maxParticipants: 22,
      description: 'Trận đấu bóng đá cộng đồng, rèn luyện sức khỏe và kết bạn mới.'
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
      maxParticipants: 20,
      description: 'Học nấu các món ăn truyền thống và hiện đại từ đầu bếp chuyên nghiệp.'
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
      maxParticipants: 15,
      description: 'Chuyến đi bộ đường dài khám phá thiên nhiên Bà Nà, ngắm cảnh đẹp.'
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
      maxParticipants: 12,
      description: 'Học nhiếp ảnh cơ bản, kỹ thuật chụp ảnh và chỉnh sửa.'
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
      maxParticipants: 25,
      description: 'Tối chơi board game, giao lưu và kết bạn trong không gian thân thiện.'
    },
    {
      id: 7,
      title: 'Yoga tại công viên',
      type: 'sports',
      vibe: 'chill',
      date: '2024-01-24',
      time: '06:00',
      location: 'Công viên Tao Đàn',
      price: 0,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      participants: 25,
      maxParticipants: 40,
      description: 'Lớp yoga buổi sáng, rèn luyện sức khỏe và tinh thần.'
    },
    {
      id: 8,
      title: 'Coding Meetup',
      type: 'tech',
      vibe: 'creative',
      date: '2024-01-26',
      time: '19:00',
      location: 'WeWork Saigon',
      price: 100000,
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      participants: 30,
      maxParticipants: 50,
      description: 'Gặp gỡ các developer, chia sẻ kinh nghiệm và học hỏi công nghệ mới.'
    },
    {
      id: 9,
      title: 'Karaoke Night',
      type: 'music',
      vibe: 'social',
      date: '2024-01-27',
      time: '20:00',
      location: 'Karaoke Bar',
      price: 80000,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      participants: 20,
      maxParticipants: 30,
      description: 'Đêm karaoke vui nhộn, hát hò và giao lưu với bạn bè.'
    }
  ]

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || event.type === selectedType
    const matchesVibe = selectedVibe === 'all' || event.vibe === selectedVibe
    const matchesPrice = selectedPrice === 'all' || 
                        (selectedPrice === 'free' && event.price === 0) ||
                        (selectedPrice === 'low' && event.price > 0 && event.price < 100000) ||
                        (selectedPrice === 'medium' && event.price >= 100000 && event.price <= 500000) ||
                        (selectedPrice === 'high' && event.price > 500000)
    
    return matchesSearch && matchesType && matchesVibe && matchesPrice
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Khám phá sự kiện
        </h1>
        <p className="text-lg text-neutral-600">
          Tìm kiếm và tham gia các sự kiện thú vị
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Loại sự kiện
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input"
            >
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vibe Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Vibe
            </label>
            <select
              value={selectedVibe}
              onChange={(e) => setSelectedVibe(e.target.value)}
              className="input"
            >
              {vibes.map((vibe) => (
                <option key={vibe.id} value={vibe.id}>
                  {vibe.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Mức giá
            </label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="input"
            >
              {priceRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            Tìm thấy <span className="font-semibold text-primary-600">{filteredEvents.length}</span> sự kiện
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <div key={event.id} className="card card-hover overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="h-48 relative overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-3 left-3">
                <span className="badge badge-primary">
                  {eventTypes.find(t => t.id === event.type)?.name}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="badge badge-secondary">
                  {vibes.find(v => v.id === event.vibe)?.name}
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
              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{event.description}</p>
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

      {/* No results */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Không tìm thấy sự kiện</h3>
          <p className="text-neutral-600 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          <Button 
            onClick={() => {
              setSearchTerm('')
              setSelectedType('all')
              setSelectedVibe('all')
              setSelectedPrice('all')
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}

      {/* Load More */}
      {filteredEvents.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm sự kiện
          </Button>
        </div>
      )}
    </div>
  )
}

export default Events 