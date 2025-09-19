import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { UserProfile, UpdateProfileDto } from '@/types/profile';
import { userService } from '@/services/userService';
import { useToast } from '@/components/common/useToast';
import Button from '@/components/common/Button';

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onUpdate, onCancel }) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileDto>({
    defaultValues: {
      displayName: '',
      avatarUrl: '',
      city: '',
      bio: '',
    },
  });

  // Populate form with profile data when component mounts
  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl || '',
        city: profile.city || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UpdateProfileDto) => {
    try {
      const response = await userService.updateProfile(data);
      toast.showToast('Cập nhật hồ sơ thành công!', 'success');
      onUpdate(response.data); // Pass updated profile back to parent
    } catch (error) {
      toast.showToast('Cập nhật thất bại. Vui lòng thử lại.', 'error');
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Chỉnh sửa hồ sơ</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1">Tên hiển thị</label>
          <input 
            id="displayName"
            {...register('displayName')}
            className={`input ${errors.displayName ? 'input-error' : ''}`}
          />
          {errors.displayName && <p className="text-red-500 text-sm mt-1">{errors.displayName.message}</p>}
        </div>

        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-neutral-700 mb-1">Ảnh đại diện (URL)</label>
          <input 
            id="avatarUrl"
            {...register('avatarUrl')}
            className={`input ${errors.avatarUrl ? 'input-error' : ''}`}
          />
          {errors.avatarUrl && <p className="text-red-500 text-sm mt-1">{errors.avatarUrl.message}</p>}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">Thành phố</label>
          <input 
            id="city"
            {...register('city')}
            className={`input ${errors.city ? 'input-error' : ''}`}
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">Giới thiệu</label>
          <textarea 
            id="bio"
            rows={4}
            {...register('bio')}
            className={`input ${errors.bio ? 'input-error' : ''}`}
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
