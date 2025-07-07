import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'

const EventManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  const tabs = [
    { id: 'upcoming', name: 'Sắp diễn ra', count: 3 },
    { id: 'ongoing', name: 'Đang diễn ra', count: 1 },
    { id: 'past', name: 'Đã kết thúc', count: 8 },
    { id: 'draft', name: 'Bản nháp', count: 2 }
  ]

  const events = [
    {
      id: 1,
      title: 'Live Music Night',
      type: 'music',
      date: '2024-01-20',
      time: '20:00',
      location: 'Saigon Outcast',
      status: 'upcoming',
      participants: 45,
      maxParticipants: 100,
      registrations: [
        { id: 1, name: 'Nguyễn Thị Anh', email: 'anh@email.com', phone: '0123456789', joinedAt: '2024-01-15', status: 'confirmed' },
        { id: 2, name: 'Trần Văn Bình', email: 'binh@email.com', phone: '0987654321', joinedAt: '2024-01-16', status: 'pending' },
        { id: 3, name: 'Lê Thị Cẩm', email: 'cam@email.com', phone: '0555666777', joinedAt: '2024-01-17', status: 'confirmed' }
      ]
    },
    {
      id: 2,
      title: 'Bóng đá cộng đồng',
      type: 'sports',
      date: '2024-01-21',
      time: '16:00',
      location: 'Sân bóng Thảo Điền',
      status: 'upcoming',
      participants: 18,
      maxParticipants: 22,
      registrations: [
        { id: 4, name: 'Phạm Văn Dũng', email: 'dung@email.com', phone: '0111222333', joinedAt: '2024-01-14', status: 'confirmed' },
        { id: 5, name: 'Hoàng Thị Em', email: 'em@email.com', phone: '0444555666', joinedAt: '2024-01-15', status: 'confirmed' }
      ]
    },
    {
      id: 3,
      title: 'Workshop Nấu ăn',
      type: 'food',
      date: '2024-01-19',
      time: '19:00',
      location: 'Cooking Studio',
      status: 'ongoing',
      participants: 12,
      maxParticipants: 20,
      registrations: [
        { id: 6, name: 'Vũ Văn Phúc', email: 'phuc@email.com', phone: '0777888999', joinedAt: '2024-01-10', status: 'confirmed' }
      ]
    }
  ]

  const filteredEvents = events.filter(event => event.status === activeTab)

  const handleApproveRegistration = (eventId: number, registrationId: number) => {
    // Mock approve functionality
    console.log('Approve registration:', eventId, registrationId)
  }

  const handleRejectRegistration = (eventId: number, registrationId: number) => {
    // Mock reject functionality
    console.log('Reject registration:', eventId, registrationId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Quản lý sự kiện
        </h1>
        <p className="text-lg text-neutral-600">
          Quản lý sự kiện của bạn và người tham gia
        </p>
      </div>

      {/* Tabs */}
      <div className="card p-6 mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {tab.name}
              <span className="ml-2 bg-neutral-200 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-neutral-900">{event.title}</h3>
                  <span className="badge badge-primary">
                    {event.type === 'music' ? 'Âm nhạc' : 
                     event.type === 'sports' ? 'Thể thao' : 'Ẩm thực'}
                  </span>
                  <span className={`badge ${
                    event.status === 'upcoming' ? 'badge-accent' :
                    event.status === 'ongoing' ? 'badge-primary' :
                    event.status === 'past' ? 'badge-neutral' : 'badge-secondary'
                  }`}>
                    {event.status === 'upcoming' ? 'Sắp diễn ra' :
                     event.status === 'ongoing' ? 'Đang diễn ra' :
                     event.status === 'past' ? 'Đã kết thúc' : 'Bản nháp'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
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
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {event.participants}/{event.maxParticipants} người tham gia
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to={`/events/${event.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Chỉnh sửa
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}>
                  {selectedEvent === event.id ? 'Ẩn' : 'Xem'} đăng ký
                </Button>
              </div>
            </div>

            {/* Registrations */}
            {selectedEvent === event.id && (
              <div className="border-t border-neutral-200 pt-6 mt-6">
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                  Danh sách đăng ký ({event.registrations.length})
                </h4>
                
                <div className="space-y-4">
                  {event.registrations.map((registration) => (
                    <div key={registration.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {registration.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{registration.name}</p>
                          <p className="text-sm text-neutral-600">{registration.email}</p>
                          <p className="text-sm text-neutral-600">{registration.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`badge ${
                          registration.status === 'confirmed' ? 'badge-primary' : 'badge-accent'
                        }`}>
                          {registration.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {registration.joinedAt}
                        </span>
                        
                        {registration.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveRegistration(event.id, registration.id)}
                            >
                              Duyệt
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRejectRegistration(event.id, registration.id)}
                            >
                              Từ chối
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {event.registrations.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Chưa có đăng ký</h3>
                    <p className="text-neutral-600">Chưa có ai đăng ký tham gia sự kiện này</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Events */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6h.01M9 12h6m-6 4h6m2 1H9a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Chưa có sự kiện</h3>
          <p className="text-neutral-600 mb-6">Bạn chưa có sự kiện nào trong danh mục này</p>
          <Link to="/events/create">
            <Button>
              Tạo sự kiện mới
            </Button>
          </Link>
        </div>
      )}

      {/* Create Event CTA */}
      <div className="card p-6 bg-gradient-primary text-white mt-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Tạo sự kiện mới</h3>
          <p className="text-primary-100 mb-4">
            Tổ chức sự kiện và tìm kiếm người tham gia
          </p>
          <Link to="/events/create">
            <Button className="bg-white text-primary-600 hover:bg-neutral-100">
              Tạo sự kiện
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventManagement 