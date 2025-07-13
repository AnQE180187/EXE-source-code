import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center">
            <span className="text-white font-bold text-4xl">404</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-neutral-900 mb-4">
          Oops!
        </h1>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-neutral-700 mb-6">
          Trang không tồn tại
        </h2>
        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
          Trang bạn đang tìm kiếm có thể đã bị di chuyển, xóa hoặc không tồn tại.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              Về trang chủ
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button variant="outline" size="lg">
                Khám phá sự kiện
              </Button>
            </Link>
            <Link to="/login">
              {/* <Button variant="ghost" size="lg">
                Đăng nhập
              </Button> */}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound 