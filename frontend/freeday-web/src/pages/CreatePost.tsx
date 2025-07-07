import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'

const CreatePost: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    location: '',
    date: '',
    maxParticipants: '',
    contactInfo: ''
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'music', name: 'Âm nhạc' },
    { id: 'sports', name: 'Thể thao' },
    { id: 'food', name: 'Ẩm thực' },
    { id: 'travel', name: 'Du lịch' },
    { id: 'tech', name: 'Công nghệ' },
    { id: 'art', name: 'Nghệ thuật' },
    { id: 'social', name: 'Giao lưu' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Mock API call
    setTimeout(() => {
      setLoading(false)
      navigate('/forum')
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Đăng bài tìm bạn đồng hành
        </h1>
        <p className="text-lg text-neutral-600">
          Chia sẻ kế hoạch của bạn và tìm những người có cùng sở thích
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Ví dụ: Tìm bạn đi hiking Bà Nà cuối tuần này"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
              Danh mục *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
              Nội dung chi tiết *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={6}
              value={formData.content}
              onChange={handleChange}
              className="input"
              placeholder="Mô tả chi tiết về kế hoạch của bạn, những gì bạn mong đợi và yêu cầu đối với người tham gia..."
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
              Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input"
              placeholder="Ví dụ: hiking, bà nà, cuối tuần, thể thao"
            />
            <p className="text-sm text-neutral-500 mt-1">
              Tags giúp người khác dễ dàng tìm thấy bài viết của bạn
            </p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
              Địa điểm
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input"
              placeholder="Ví dụ: Bà Nà Hills, Đà Nẵng"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-2">
              Ngày dự kiến
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Max Participants */}
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-neutral-700 mb-2">
              Số người tối đa
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              min="1"
              max="50"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="input"
              placeholder="Ví dụ: 5"
            />
          </div>

          {/* Contact Info */}
          <div>
            <label htmlFor="contactInfo" className="block text-sm font-medium text-neutral-700 mb-2">
              Thông tin liên hệ
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="input"
              placeholder="Ví dụ: Zalo: 0123456789 hoặc Email: example@email.com"
            />
            <p className="text-sm text-neutral-500 mt-1">
              Thông tin này sẽ được hiển thị công khai
            </p>
          </div>

          {/* Tips */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <h3 className="font-semibold text-primary-900 mb-2">💡 Mẹo viết bài hiệu quả</h3>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• Mô tả rõ ràng về hoạt động và mục tiêu</li>
              <li>• Nêu rõ yêu cầu về kỹ năng hoặc kinh nghiệm</li>
              <li>• Cung cấp thông tin về chi phí và thời gian</li>
              <li>• Thêm tags phù hợp để dễ tìm kiếm</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1"
              loading={loading}
              disabled={loading}
            >
              Đăng bài
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/forum')}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost 