import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'

const Forum: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'Tất cả', count: 156 },
    { id: 'music', name: 'Âm nhạc', count: 23 },
    { id: 'sports', name: 'Thể thao', count: 45 },
    { id: 'food', name: 'Ẩm thực', count: 18 },
    { id: 'travel', name: 'Du lịch', count: 32 },
    { id: 'tech', name: 'Công nghệ', count: 28 },
    { id: 'art', name: 'Nghệ thuật', count: 15 }
  ]

  const posts = [
    {
      id: 1,
      title: 'Tìm bạn đi hiking Bà Nà cuối tuần này',
      content: 'Mình đang tìm 2-3 bạn để đi hiking Bà Nà vào cuối tuần này. Ai có hứng thú thì liên hệ mình nhé!',
      author: {
        name: 'Nguyễn Thị Anh',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        rating: 4.8
      },
      category: 'travel',
      createdAt: '2024-01-18',
      replies: 8,
      likes: 12,
      isLiked: false,
      tags: ['hiking', 'bà nà', 'cuối tuần']
    },
    {
      id: 2,
      title: 'Cần bạn chơi bóng đá cộng đồng',
      content: 'Đội mình thiếu 2 người cho trận đấu tối nay. Ai có thể tham gia không?',
      author: {
        name: 'Trần Văn Bình',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        rating: 4.6
      },
      category: 'sports',
      createdAt: '2024-01-18',
      replies: 5,
      likes: 7,
      isLiked: true,
      tags: ['bóng đá', 'thể thao', 'tối nay']
    },
    {
      id: 3,
      title: 'Tìm bạn đi workshop nấu ăn',
      content: 'Có ai muốn đi workshop nấu ăn cuối tuần không? Mình thấy có khóa học rất hay!',
      author: {
        name: 'Lê Thị Cẩm',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        rating: 4.9
      },
      category: 'food',
      createdAt: '2024-01-17',
      replies: 15,
      likes: 23,
      isLiked: false,
      tags: ['nấu ăn', 'workshop', 'cuối tuần']
    },
    {
      id: 4,
      title: 'Cần bạn tham gia coding meetup',
      content: 'Có ai quan tâm đến React và TypeScript không? Mình đang tổ chức meetup chia sẻ kinh nghiệm.',
      author: {
        name: 'Phạm Văn Dũng',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        rating: 4.7
      },
      category: 'tech',
      createdAt: '2024-01-16',
      replies: 12,
      likes: 18,
      isLiked: false,
      tags: ['coding', 'react', 'typescript', 'meetup']
    },
    {
      id: 5,
      title: 'Tìm bạn đi chụp ảnh phố cổ',
      content: 'Mình muốn đi chụp ảnh phố cổ Hà Nội vào cuối tuần. Ai có hứng thú không?',
      author: {
        name: 'Hoàng Thị Em',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        rating: 4.5
      },
      category: 'art',
      createdAt: '2024-01-15',
      replies: 6,
      likes: 9,
      isLiked: false,
      tags: ['chụp ảnh', 'phố cổ', 'hà nội']
    }
  ]

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleLike = (postId: number) => {
    // Mock like functionality
    console.log('Liked post:', postId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Diễn đàn kết nối
        </h1>
        <p className="text-lg text-neutral-600">
          Tìm bạn đồng hành và chia sẻ trải nghiệm
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Create Post */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                />
              </div>
              <Link to="/forum/create">
                <Button className="w-full md:w-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Đăng bài mới
                </Button>
              </Link>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="card p-6">
                <div className="flex items-start space-x-4">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          <Link to={`/forum/${post.id}`} className="hover:text-primary-600 transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600">
                          <span>{post.author.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-3 h-3 ${i < Math.floor(post.author.rating) ? 'text-accent-500' : 'text-neutral-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1">{post.author.rating}</span>
                          </div>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                      <span className="badge badge-primary">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                    </div>
                    
                    <p className="text-neutral-600 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            post.isLiked ? 'text-primary-600' : 'text-neutral-600 hover:text-primary-600'
                          }`}
                        >
                          <svg className="w-4 h-4" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes}</span>
                        </button>
                        <Link to={`/forum/post/${post.id}`} className="flex items-center space-x-1 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.replies}</span>
                        </Link>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="badge badge-neutral text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Xem thêm bài viết
              </Button>
            </div>
          )}

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Không tìm thấy bài viết</h3>
              <p className="text-neutral-600 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-sm bg-neutral-200 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tags phổ biến</h3>
            <div className="flex flex-wrap gap-2">
              {['hiking', 'bóng đá', 'nấu ăn', 'coding', 'chụp ảnh', 'du lịch', 'âm nhạc', 'yoga'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="badge badge-neutral hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Create Post CTA */}
          <div className="card p-6 bg-gradient-primary text-white">
            <h3 className="text-lg font-semibold mb-2">Tìm bạn đồng hành?</h3>
            <p className="text-primary-100 mb-4">
              Đăng bài để tìm kiếm những người có cùng sở thích
            </p>
            <Link to="/forum/create">
              <Button className="w-full bg-white text-primary-600 hover:bg-neutral-100">
                Đăng bài ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forum 