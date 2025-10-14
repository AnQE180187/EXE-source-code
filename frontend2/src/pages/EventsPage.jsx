import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { useDebounce } from '../hooks/useDebounce';
import { Search, MapPin, Calendar, ArrowRight, SlidersHorizontal, XCircle } from 'lucide-react';
import api from '../services/api';
import './EventsPage.css';

const SkeletonCard = () => (
  <div className="ep-card ep-card--skeleton">
    <div className="ep-card__image-wrapper shimmer" />
    <div className="ep-card__content">
      <div className="sk-line sk-title shimmer" />
      <div className="sk-line sk-sub shimmer" />
      <div className="sk-line sk-sub shimmer" />
    </div>
    <div className="ep-card__footer">
      <div className="sk-pill shimmer" />
      <div className="sk-pill sk-small shimmer" />
    </div>
  </div>
);

const EventCard = ({ event, index }) => (
  <Link to={`/events/${event.id}`} className="ep-card" style={{ animationDelay: `${index * 45}ms` }}>
    <div className="ep-card__image-wrapper">
      <img
        src={event.imageUrl || 'https://via.placeholder.com/800x450?text=FreeDay'}
        alt={event.title}
        className="ep-card__image"
        loading="lazy"
      />
      <div className="ep-card__image-overlay" />
    </div>

    <div className="ep-card__content">
      <h3 className="ep-card__title">{event.title}</h3>
      <div className="ep-card__info">
        <span className="ep-meta"><Calendar size={14} /> {new Date(event.startAt).toLocaleDateString('vi-VN')}</span>
        <span className="ep-meta"><MapPin size={14} /> {event.locationText}</span>
      </div>
    </div>

    <div className="ep-card__footer">
      <span className="ep-card__price">
        {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VND` : 'Miễn phí'}
      </span>
      <span className="ep-card__action">Xem chi tiết <ArrowRight size={16} /></span>
    </div>
  </Link>
);

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/tags');
        setTags(data || []);
      } catch (e) {
        console.error('Failed to fetch tags', e);
      }
    })();
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
        // dateFilter có thể được xử lý ở backend nếu cần
        // params.date = dateFilter;

        const data = await getEvents(params);
        setEvents(data || []);
      } catch (err) {
        setError(err?.toString?.() || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [debouncedSearchTerm, priceFilter, dateFilter, selectedTag]);

  const resultLabel = useMemo(() => {
    const pieces = [];
    if (debouncedSearchTerm) pieces.push(`"${debouncedSearchTerm}"`);
    if (selectedTag !== 'all') pieces.push(`#${selectedTag}`);
    if (priceFilter === 'free') pieces.push('Miễn phí');
    if (priceFilter === 'paid') pieces.push('Có phí');
    if (dateFilter !== 'all') pieces.push(dateFilter);
    return pieces.length ? pieces.join(' · ') : 'Tất cả sự kiện';
  }, [debouncedSearchTerm, selectedTag, priceFilter, dateFilter]);

  const hasActiveFilters = useMemo(() =>
    !!debouncedSearchTerm || priceFilter !== 'all' || dateFilter !== 'all' || selectedTag !== 'all',
    [debouncedSearchTerm, priceFilter, dateFilter, selectedTag]
  );

  const clearFilters = () => {
    setSearchTerm('');
    setPriceFilter('all');
    setDateFilter('all');
    setSelectedTag('all');
  };

  return (
    <div className="events-page-container ep-with-header-offset">
      {/* Header */}
      <header className="ep-hero">
        <div className="ep-hero__inner">
          <h1>Khám Phá Sự Kiện</h1>
          <p>Tìm kiếm, lọc và tham gia những sự kiện hấp dẫn nhất xung quanh bạn.</p>
        </div>
        <div className="ep-hero__bg" aria-hidden="true" />
      </header>

      {/* Sticky Filter Bar */}
      <div className="ep-filter-wrap">
        <div className="ep-filter-bar">
          <div className="ep-search-bar">
            <Search size={18} className="ep-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Tìm kiếm sự kiện"
            />
          </div>

          <div className="ep-filters">
            <div className="ep-select">
              <SlidersHorizontal size={16} />
              <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} aria-label="Lọc theo giá">
                <option value="all">Mọi mức giá</option>
                <option value="free">Miễn phí</option>
                <option value="paid">Có phí</option>
              </select>
            </div>

            <div className="ep-select">
              <SlidersHorizontal size={16} />
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} aria-label="Lọc theo thời gian">
                <option value="all">Mọi lúc</option>
                <option value="today">Hôm nay</option>
                <option value="weekend">Cuối tuần này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button className="ep-clear" onClick={clearFilters} title="Xóa bộ lọc">
                <XCircle size={16} /> Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tag chips */}
      <div className="ep-tag-filter">
        <button onClick={() => setSelectedTag('all')} className={selectedTag === 'all' ? 'active' : ''}>Tất cả</button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(tag.name)}
            className={selectedTag === tag.name ? 'active' : ''}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {/* Results info */}
      <div className="ep-result-bar">
        <span className="ep-result-label">{resultLabel}</span>
        {!loading && !error && <span className="ep-result-count">{events.length} kết quả</span>}
      </div>

      {/* Grid */}
      <main className="ep-content">
        {loading ? (
          <div className="ep-grid">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="ep-message ep-message--error">
            Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </div>
        ) : events.length > 0 ? (
          <div className="ep-grid ep-grid--fadein">
            {events.map((event, idx) => (
              <EventCard key={event.id} event={event} index={idx} />
            ))}
          </div>
        ) : (
          <div className="ep-no-results">
            <h3>Không tìm thấy sự kiện phù hợp</h3>
            <p>Hãy thử từ khóa khác hoặc xóa bớt bộ lọc nhé.</p>
            {hasActiveFilters && (
              <button className="ep-clear big" onClick={clearFilters}>
                <XCircle size={18} /> Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventsPage;
