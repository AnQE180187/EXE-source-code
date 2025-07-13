import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const VIBE_TYPES = [
  { value: 'chill', label: 'Chill' },
  { value: 'kết nối', label: 'Kết nối' },
  { value: 'năng động', label: 'Năng động' },
  { value: 'khám phá', label: 'Khám phá' },
];

const MOCK_PROFILE = {
  id: 'u123',
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=5',
  birthDate: '2000-05-20',
  bio: 'Yêu thích khám phá, startup và nghệ thuật.',
  studentStatus: true,
  schoolName: 'ĐH Bách Khoa',
  interests: ['nghệ thuật', 'khám phá', 'startup'],
  vibeType: 'khám phá',
  joinedEvents: ['e1', 'e2'],
  likedEvents: ['e2'],
  createdAt: '2023-01-01T10:00:00Z',
  updatedAt: '2024-06-01T12:00:00Z',
  role: 'user',
  isMatchedOpen: true,
  matchPreferences: {
    gender: 'any',
    vibe: ['khám phá', 'năng động'],
    anonymous: false
  }
};

const MOCK_EVENTS = [
  { id: 'e1', title: 'Hiking Bà Nà', date: '2024-06-10' },
  { id: 'e2', title: 'Workshop Startup', date: '2024-07-01' },
];

const MOCK_LIKED = [
  { id: 'e2', title: 'Workshop Startup', date: '2024-07-01' },
];

const ProfileDetail: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [form, setForm] = useState({ ...MOCK_PROFILE });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setForm({ ...form, [name]: e.target.checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleInterests = (val: string) => {
    setForm({ ...form, interests: val.split(',').map(i => i.trim()).filter(Boolean) });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...form });
    setEdit(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-2">
        <div className="w-full max-w-5xl">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col gap-10 border border-neutral-100">
            {/* Avatar & Info + Edit (full width) */}
            <div className="flex flex-col items-center w-full">
              <div className="relative mb-4">
                <img src={profile.avatarUrl} alt={profile.fullName} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-primary-200" />
                <span className="absolute bottom-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full shadow">{profile.role}</span>
              </div>
              <div className="text-2xl font-bold mt-1 text-primary-700 text-center">{profile.fullName}</div>
              <div className="text-neutral-500 mb-1 text-center">{profile.email}</div>
              <div className="text-xs text-neutral-400 mb-2 text-center">Tham gia: {new Date(profile.createdAt).toLocaleDateString()}</div>
              <div className="text-xs text-neutral-400 mb-4 text-center">Cập nhật: {new Date(profile.updatedAt).toLocaleDateString()}</div>
              <div className="flex flex-col md:flex-row gap-3 w-full max-w-md mx-auto mb-4">
                <Button className="w-full" onClick={() => setEdit(!edit)}>
                  {edit ? 'Hủy' : 'Chỉnh sửa'}
                </Button>
                <Button className="w-full bg-red-500 hover:bg-red-600" onClick={async () => { await logout(); navigate('/'); }}>Đăng xuất</Button>
              </div>
              <div className="w-full max-w-2xl mx-auto">
                {edit ? (
                  <form className="space-y-4" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-medium">Ảnh đại diện (URL)</label>
                        <input className="input w-full" name="avatarUrl" value={form.avatarUrl} onChange={handleChange} />
                      </div>
                      <div>
                        <label className="font-medium">Họ và tên</label>
                        <input className="input w-full" name="fullName" value={form.fullName} onChange={handleChange} required />
                      </div>
                      <div>
                        <label className="font-medium">Email</label>
                        <input className="input w-full" name="email" value={form.email} onChange={handleChange} required type="email" />
                      </div>
                      <div>
                        <label className="font-medium">Ngày sinh</label>
                        <input className="input w-full" name="birthDate" value={form.birthDate} onChange={handleChange} type="date" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-medium">Bio (giới thiệu ngắn)</label>
                        <textarea className="input w-full" name="bio" value={form.bio} onChange={handleChange} maxLength={150} />
                      </div>
                      <div className="flex items-center gap-2 mt-6 md:mt-0">
                        <input type="checkbox" name="studentStatus" checked={form.studentStatus} onChange={handleChange} id="studentStatus" />
                        <label htmlFor="studentStatus" className="font-medium">Là sinh viên</label>
                        {form.studentStatus && (
                          <input className="input ml-2" name="schoolName" value={form.schoolName} onChange={handleChange} placeholder="Tên trường" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-medium">Sở thích (cách nhau bởi dấu phẩy)</label>
                        <input className="input w-full" value={form.interests.join(', ')} onChange={e => handleInterests(e.target.value)} />
                      </div>
                      <div>
                        <label className="font-medium">Tâm trạng ưa thích</label>
                        <select className="input w-full" name="vibeType" value={form.vibeType} onChange={handleChange}>
                          {VIBE_TYPES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="isMatchedOpen" checked={form.isMatchedOpen} onChange={handleChange} id="isMatchedOpen" />
                      <label htmlFor="isMatchedOpen" className="font-medium">Cho phép tìm bạn đồng hành</label>
                    </div>
                    {/* Match Preferences */}
                    {form.isMatchedOpen && (
                      <div className="space-y-2 border rounded-lg p-3 bg-neutral-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-medium">Giới tính mong muốn</label>
                            <select className="input w-full" name="matchPreferences.gender" value={form.matchPreferences.gender} onChange={e => setForm({ ...form, matchPreferences: { ...form.matchPreferences, gender: e.target.value } })}>
                              <option value="any">Bất kỳ</option>
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-medium">Vibe tương thích</label>
                            <select multiple className="input w-full" value={form.matchPreferences.vibe} onChange={e => setForm({ ...form, matchPreferences: { ...form.matchPreferences, vibe: Array.from(e.target.selectedOptions, o => o.value) } })}>
                              {VIBE_TYPES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={form.matchPreferences.anonymous} onChange={e => setForm({ ...form, matchPreferences: { ...form.matchPreferences, anonymous: e.target.checked } })} id="anonymous" />
                          <label htmlFor="anonymous" className="font-medium">Ẩn danh</label>
                        </div>
                      </div>
                    )}
                    <Button type="submit" className="btn-primary w-full mt-2">Lưu thay đổi</Button>
                  </form>
                ) : (
                  <div className="space-y-2 w-full">
                    <div className="text-base text-neutral-700 font-medium mb-2">{profile.bio}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-sm text-neutral-600">Ngày sinh: {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : 'Chưa cập nhật'}</div>
                      {profile.studentStatus && (
                        <div className="text-sm text-neutral-600">Sinh viên: {profile.schoolName || 'Chưa cập nhật'}</div>
                      )}
                      <div className="text-sm text-neutral-600">Sở thích: {profile.interests.join(', ')}</div>
                      <div className="text-sm text-neutral-600">Tâm trạng ưa thích: {profile.vibeType}</div>
                      <div className="text-sm text-neutral-600">Tìm bạn đồng hành: {profile.isMatchedOpen ? 'Bật' : 'Tắt'}</div>
                      {profile.isMatchedOpen && profile.matchPreferences && (
                        <div className="text-sm text-neutral-600">Ưu tiên: Giới tính {profile.matchPreferences.gender}, vibe [{profile.matchPreferences.vibe.join(', ')}], {profile.matchPreferences.anonymous ? 'ẩn danh' : 'công khai'}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Sự kiện đã tham gia và yêu thích (full width) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 shadow-inner">
                <div className="font-semibold text-lg mb-3 text-primary-700 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" /></svg>
                  Sự kiện đã tham gia
                </div>
                <div>
                  {MOCK_EVENTS.length === 0 ? (
                    <div className="text-neutral-400">Chưa có sự kiện nào.</div>
                  ) : (
                    <ul className="space-y-2">
                      {MOCK_EVENTS.filter(ev => profile.joinedEvents.includes(ev.id)).map(ev => (
                        <li key={ev.id} className="flex items-center gap-2 text-base text-neutral-700">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary-400 mr-2"></span>
                          {ev.title} <span className="ml-2 text-xs text-neutral-400">({ev.date})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-yellow-50 rounded-2xl p-6 shadow-inner">
                <div className="font-semibold text-lg mb-3 text-pink-600 flex items-center gap-2">
                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                  Sự kiện đã yêu thích
                </div>
                <div>
                  {MOCK_LIKED.length === 0 ? (
                    <div className="text-neutral-400">Chưa có sự kiện nào.</div>
                  ) : (
                    <ul className="space-y-2">
                      {MOCK_LIKED.filter(ev => profile.likedEvents.includes(ev.id)).map(ev => (
                        <li key={ev.id} className="flex items-center gap-2 text-base text-neutral-700">
                          <span className="inline-block w-2 h-2 rounded-full bg-pink-400 mr-2"></span>
                          {ev.title} <span className="ml-2 text-xs text-neutral-400">({ev.date})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileDetail;
