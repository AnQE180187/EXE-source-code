import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { useDebounce } from '../hooks/useDebounce';
import { Search, MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import api from '../services/api'; // Import api for tags
import './EventsPage.css';

const EventCard = ({ event }) => (
    <Link to={`/events/${event.id}`} className="ep-card">
        <div className="ep-card__image-wrapper">
            <img src={event.imageUrl || 'https://via.placeholder.com/400x225?text=FreeDay'} alt={event.title} className="ep-card__image" />
        </div>
        <div className="ep-card__content">
            <h3 className="ep-card__title">{event.title}</h3>
            <p className="ep-card__organizer">bởi {event.organizer?.profile?.displayName || 'Organizer'}</p>
            <div className="ep-card__info">
                <span><Calendar size={14} /> {new Date(event.startAt).toLocaleDateString('vi-VN')}</span>
                <span><MapPin size={14} /> {event.locationText}</span>
            </div>
        </div>
        <div className="ep-card__footer">
            <span className="ep-card__price">{event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VND` : 'Miễn phí'}</span>
            <span className="ep-card__action">Xem chi tiết <ArrowRight size={16}/></span>
        </div>
    </Link>
);

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const INITIAL_TAG_COUNT = 10;
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [minRegistrations, setMinRegistrations] = useState('0');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedLocationFilter = useDebounce(locationFilter, 500);

  useEffect(() => {
    const fetchTags = async () => {
        try {
            const response = await api.get('/tags');
            setTags(response.data);
        } catch (error) {
            console.error("Failed to fetch tags", error);
        }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (debouncedSearchTerm) params.search = debouncedSearchTerm;
        if (priceFilter !== 'all') params.price = priceFilter;
        if (selectedTag !== 'all') params.tag = selectedTag;
        if (dateFilter !== 'all') params.date = dateFilter;
        if (debouncedLocationFilter) params.location = debouncedLocationFilter;
        if (categoryFilter !== 'all') params.category = categoryFilter;
        if (sortOrder) params.sort = sortOrder;
        if (minRegistrations !== '0') params.min_registrations = minRegistrations;

        const data = await getEvents(params);
        setEvents(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [debouncedSearchTerm, priceFilter, dateFilter, selectedTag, debouncedLocationFilter, categoryFilter, sortOrder, minRegistrations]);

  const displayedTags = showAllTags ? tags : tags.slice(0, INITIAL_TAG_COUNT);

  return (
    <div className="events-page-container">
      <div className="ep-header">
        <h1>Khám phá Sự kiện</h1>
        <p>Tìm kiếm, lọc và tham gia những sự kiện hấp dẫn nhất xung quanh bạn.</p>
      </div>

      {/* Filter Bar */}
      <div className="ep-filter-bar">
        <div className="ep-search-bar">
          <Search size={20} className="ep-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ep-filters">
          {/* <input
            type="text"
            placeholder="Địa điểm..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          /> */}
          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="all">Mọi mức giá</option>
            <option value="free">Miễn phí</option>
            <option value="paid">Có phí</option>
          </select>
          {/* <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">Mọi lúc</option>
            <option value="today">Hôm nay</option>
            <option value="weekend">Cuối tuần này</option>
            <option value="month">Tháng này</option>
          </select> */}
          <select value={minRegistrations} onChange={(e) => setMinRegistrations(e.target.value)}>
            <option value="0">Lượt đăng ký</option>
            <option value="10">10+</option>
            <option value="50">50+</option>
            <option value="100">100+</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="popularity">Phổ biến nhất</option>
            {/* <option value="date_asc">Ngày (tăng dần)</option>
            <option value="date_desc">Ngày (giảm dần)</option> */}
            <option value="price_asc">Giá (tăng dần)</option>
            <option value="price_desc">Giá (giảm dần)</option>
          </select>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="ep-tag-filter">
        <button onClick={() => setCategoryFilter('all')} className={categoryFilter === 'all' ? 'active' : ''}>Tất cả</button>
        {displayedTags.map(tag => (
            <button key={tag.id} onClick={() => setCategoryFilter(tag.name)} className={categoryFilter === tag.name ? 'active' : ''}>{tag.name}</button>
        ))}
        {tags.length > INITIAL_TAG_COUNT && (
          <button onClick={() => setShowAllTags(!showAllTags)} className="ep-tag-toggle-button">
            {showAllTags ? 'Ẩn bớt' : 'Xem thêm'}
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="ep-content">
        {loading ? (
          <p className="ep-message">Đang tải sự kiện...</p>
        ) : error ? (
          <p className="ep-message ep-message--error">{error}</p>
        ) : events.length > 0 ? (
          <div className="ep-grid">
            {events.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="ep-no-results">
            <h3>Không tìm thấy sự kiện phù hợp</h3>
            <p>Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;