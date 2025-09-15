import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '@/services/api';
import { UserProfile, UserEvents, UpdateProfileDto } from '@/types/profile';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useToast } from '@/components/common/useToast';

const ProfileDetail: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [eventsData, setEventsData] = useState<UserEvents | null>(null);
  const [edit, setEdit] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState<UpdateProfileDto>({
    displayName: '',
    avatarUrl: '',
    city: '',
    bio: '',
  });

  // Fetch profile and events data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, eventsRes] = await Promise.all([
          userAPI.getProfile(),
          userAPI.getEvents()
        ]);
        
        setProfileData(profileRes.data.data);
        setEventsData(eventsRes.data.data);
        
        // Initialize form with current profile data
        if (profileRes.data.data.profile) {
          setForm({
            displayName: profileRes.data.data.profile.displayName,
            avatarUrl: profileRes.data.data.profile.avatarUrl || '',
            city: profileRes.data.data.profile.city || '',
            bio: profileRes.data.data.profile.bio || '',
          });
        }
      } catch (error: any) {
        toast.showToast(
          error.response?.data?.message || 'Không thể tải thông tin profile',
          'error'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await userAPI.updateProfile(form);
      setProfileData(res.data.data);
      setEdit(false);
      toast.showToast('Cập nhật profile thành công', 'success');
    } catch (error: any) {
      toast.showToast(
        error.response?.data?.message || 'Không thể cập nhật profile',
        'error'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleUpgradeToOrganizer = async () => {
    try {
      const res = await userAPI.upgradeToOrganizer();
      setProfileData(res.data.data);
      toast.showToast('Nâng cấp tài khoản thành công', 'success');
    } catch (error: any) {
      toast.showToast(
        error.response?.data?.message || 'Không thể nâng cấp tài khoản',
        'error'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg text-neutral-600">Đang tải...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg text-neutral-600">Không tìm thấy thông tin profile</div>
        </main>
        <Footer />
      </div>
    );
  }

    return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-2">
        <div className="w-full max-w-5xl">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col gap-10 border border-neutral-100">
            {/* Profile Info */}
            <div className="flex flex-col items-center w-full">
              <div className="relative mb-4">
                <img 
                  src={profileData.profile?.avatarUrl || 'https://via.placeholder.com/150'} 
                  alt={profileData.profile?.displayName} 
                  className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-primary-200"
                />
                <span className="absolute bottom-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full shadow">
                  {profileData.role}
                </span>
              </div>
              <div className="text-2xl font-bold mt-1 text-primary-700 text-center">
                {profileData.profile?.displayName}
              </div>
              <div className="text-neutral-500 mb-1 text-center">{profileData.email}</div>
              <div className="text-xs text-neutral-400 mb-2 text-center">
                Tham gia: {new Date(profileData.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-neutral-400 mb-4 text-center">
                Cập nhật: {new Date(profileData.profile?.updatedAt || profileData.updatedAt).toLocaleDateString()}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 w-full max-w-md mx-auto mb-4">
                <Button className="w-full" onClick={() => setEdit(!edit)}>
                  {edit ? 'Hủy' : 'Chỉnh sửa'}
                </Button>
                {profileData.role === 'USER' && (
                  <Button className="w-full" onClick={handleUpgradeToOrganizer}>
                    Nâng cấp thành Organizer
                  </Button>
                )}
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600" 
                  onClick={async () => { 
                    await logout(); 
                    navigate('/login'); 
                  }}
                >
                  Đăng xuất
                </Button>
              </div>

              {/* Edit Form or Profile Display */}
              <div className="w-full max-w-2xl mx-auto">
                {edit ? (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-medium">Ảnh đại diện (URL)</label>
                        <input 
                          className="input w-full"
                          name="avatarUrl"
                          value={form.avatarUrl}
                          onChange={handleChange}
                          maxLength={2048}
                        />
                      </div>
                      <div>
                        <label className="font-medium">Tên hiển thị</label>
                        <input 
                          className="input w-full"
                          name="displayName"
                          value={form.displayName}
                          onChange={handleChange}
                          required
                          maxLength={50}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-medium">Thành phố</label>
                      <input 
                        className="input w-full"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="font-medium">Giới thiệu</label>
                      <textarea 
                        className="input w-full"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        maxLength={500}
                        rows={4}
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="w-full"
                      loading={updating}
                      disabled={updating}
                    >
                      Lưu thay đổi
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {profileData.profile?.bio && (
                      <div className="text-base text-neutral-700 font-medium mb-2">
                        {profileData.profile.bio}
                      </div>
                    )}
                    {profileData.profile?.city && (
                      <div className="text-sm text-neutral-600">
                        Thành phố: {profileData.profile.city}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Events Section */}
            {eventsData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Registered Events */}
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 shadow-inner">
                  <div className="font-semibold text-lg mb-3 text-primary-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                    </svg>
                    Sự kiện đã đăng ký
                  </div>
                  <div>
                    {eventsData.registeredEvents.length === 0 ? (
                      <div className="text-neutral-400">Chưa có sự kiện nào.</div>
                    ) : (
                      <ul className="space-y-2">
                        {eventsData.registeredEvents.map((event) => (
                          <li key={event.id} className="flex items-center gap-2 text-base text-neutral-700">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary-400 mr-2"></span>
                            {event.title}
                            <span className="ml-2 text-xs text-neutral-400">
                              ({new Date(event.startAt).toLocaleDateString()})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Favorited Events */}
                <div className="bg-gradient-to-br from-pink-50 to-yellow-50 rounded-2xl p-6 shadow-inner">
                  <div className="font-semibold text-lg mb-3 text-pink-600 flex items-center gap-2">
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    Sự kiện đã yêu thích
                  </div>
                  <div>
                    {eventsData.favoritedEvents.length === 0 ? (
                      <div className="text-neutral-400">Chưa có sự kiện nào.</div>
                    ) : (
                      <ul className="space-y-2">
                        {eventsData.favoritedEvents.map((event) => (
                          <li key={event.id} className="flex items-center gap-2 text-base text-neutral-700">
                            <span className="inline-block w-2 h-2 rounded-full bg-pink-400 mr-2"></span>
                            {event.title}
                            <span className="ml-2 text-xs text-neutral-400">
                              ({new Date(event.startAt).toLocaleDateString()})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileDetail;
