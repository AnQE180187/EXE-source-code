import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { userService } from '@/services/userService';
import type { UserProfile } from '@/types/profile';
import ProfileDetail from '@/components/profile/ProfileDetail';
import ProfileForm from '@/components/profile/ProfileForm';
import { User } from '@/types/user';

const ProfilePage: React.FC = () => {
  const { token, setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        setProfile(response.data);
      } catch (err) {
        setError('Không thể tải thông tin hồ sơ.');
        console.error('Lỗi khi tải hồ sơ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    // Update the local state for the page
    setProfile(updatedProfile);
    setIsEditing(false); // Close form if it was open

    // Update the global state for the whole application
    if (token) {
      const userToStore: User = {
        id: updatedProfile.id,
        name: updatedProfile.displayName,
        email: updatedProfile.email,
        role: updatedProfile.role,
      };
      setUser(token, userToStore);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Đang tải hồ sơ...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-10">Không tìm thấy thông tin hồ sơ.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {isEditing ? (
        <ProfileForm 
          profile={profile}
          onUpdate={handleProfileUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileDetail 
          profile={profile} 
          onEdit={() => setIsEditing(true)} 
          onProfileUpdate={handleProfileUpdate} // Use the same handler for role upgrades
        />
      )}
    </div>
  );
};

export default ProfilePage;
