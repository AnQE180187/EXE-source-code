import React, { useState } from 'react';
import type { UserProfile } from '@/types/profile';
import Button from '@/components/common/Button';
import { userService } from '@/services/userService';
import { useToast } from '@/components/common/useToast';

interface ProfileDetailProps {
  profile: UserProfile;
  onEdit: () => void;
  onProfileUpdate: (updatedProfile: UserProfile) => void; // To notify parent of changes
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ profile, onEdit, onProfileUpdate }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const toast = useToast();

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const response = await userService.upgradeToOrganizer();
      onProfileUpdate(response.data); // Pass the updated profile to the parent
      toast.showToast('Nâng cấp tài khoản thành công!', 'success');
    } catch (error) {
      toast.showToast('Nâng cấp thất bại, vui lòng thử lại.', 'error');
      console.error(error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        <img 
          src={profile.avatarUrl || 'https://via.placeholder.com/150'} 
          alt={profile.displayName} 
          className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-primary-200 mb-4 md:mb-0"
        />
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-bold text-primary-800">{profile.displayName}</h2>
          <p className="text-neutral-500">{profile.email}</p>
          {profile.city && <p className="text-sm text-neutral-600 mt-1">Thành phố: {profile.city}</p>}
          <div className="mt-4">
            <span className="badge badge-secondary uppercase">{profile.role}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col space-y-2">
          <Button onClick={onEdit}>Chỉnh sửa hồ sơ</Button>
          {profile.role.toLowerCase() === 'participant' && (
            <Button 
              variant="outline"
              onClick={handleUpgrade}
              loading={isUpgrading}
              disabled={isUpgrading}
            >
              Nâng cấp thành Organizer
            </Button>
          )}
        </div>
      </div>
      
      {profile.bio && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-lg mb-2">Giới thiệu</h3>
          <p className="text-neutral-700 whitespace-pre-wrap">{profile.bio}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
