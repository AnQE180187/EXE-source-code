import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/userService';
import { getCloudinarySignature, uploadImage } from '../services/uploadService';
import { User, Calendar as CalendarIcon, MapPin, Edit3, Save, X } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      const profile = data.profile || {};
      reset({ ...profile, dateOfBirth: formatDateForInput(profile.dateOfBirth) });
      setAvatarPreview(profile.avatarUrl);
    } catch (error) {
      setApiError(error.toString());
    }
  }, [reset]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      let submissionData = { ...data };
      if (avatarFile) {
        const { signature, timestamp, apiKey, cloudName } = await getCloudinarySignature();
        const cloudinaryResponse = await uploadImage(avatarFile, signature, timestamp, apiKey, cloudName);
        submissionData.avatarUrl = cloudinaryResponse.secure_url;
      }
      if(submissionData.dateOfBirth === '') {
        submissionData.dateOfBirth = null;
      }

      const updatedProfile = await updateProfile(submissionData);
      reset({ ...updatedProfile, dateOfBirth: formatDateForInput(updatedProfile.dateOfBirth) });
      setAvatarPreview(updatedProfile.avatarUrl);
      setIsEditMode(false);

      // Gọi refreshUser để cập nhật avatar ở header
      if (typeof refreshUser === 'function') {
        await refreshUser();
      }
    } catch (error) {
      setApiError(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    fetchProfile(); // Refetch original data
    setAvatarFile(null);
    setIsEditMode(false);
  }

  if (authLoading) return <div className="loading-message">Đang tải...</div>;

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>Hồ sơ cá nhân</h1>
        <p>Quản lý thông tin để chúng tôi cá nhân hóa trải nghiệm của bạn.</p>
      </div>

      {apiError && <div className="error-message">{apiError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="profile-form-card">
        <div className="p-avatar-section">
          <img src={avatarPreview || `https://ui-avatars.com/api/?name=${user?.email}&background=random&size=128`} alt="Avatar" className="p-avatar" />
          {isEditMode && (
            <label htmlFor="avatarFile" className="p-avatar-upload-btn">
              Thay đổi ảnh
              <input id="avatarFile" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          )}
        </div>

        <div className="p-info-section">
          <div className="p-form-header">
            <h2>Thông tin chi tiết</h2>
            {!isEditMode ? (
              <button type="button" className="p-button-edit" onClick={() => setIsEditMode(true)}><Edit3 size={16}/> Sửa hồ sơ</button>
            ) : (
              <div className="p-edit-actions">
                <button type="button" className="p-button-cancel" onClick={handleCancelEdit} disabled={isSubmitting}><X size={16}/> Hủy</button>
                <button type="submit" className="p-button-save" disabled={isSubmitting || !isDirty}><Save size={16}/> {isSubmitting ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            )}
          </div>

          <div className="p-form-grid">
            {/* Display Name */}
            <div className="p-form-group">
              <label htmlFor="displayName">Tên hiển thị</label>
              <input id="displayName" {...register('displayName')} readOnly={!isEditMode} />
            </div>
            {/* Email */}
            <div className="p-form-group">
              <label>Email</label>
              <input value={user?.email || ''} readOnly disabled />
            </div>
            {/* Date of Birth */}
            <div className="p-form-group">
              <label htmlFor="dateOfBirth">Ngày sinh</label>
              <input id="dateOfBirth" type="date" {...register('dateOfBirth')} readOnly={!isEditMode} />
            </div>
            {/* Gender */}
            <div className="p-form-group">
              <label htmlFor="gender">Giới tính</label>
              <select id="gender" {...register('gender')} disabled={!isEditMode}>
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            {/* City */}
            <div className="p-form-group">
              <label htmlFor="city">Thành phố</label>
              <input id="city" {...register('city')} readOnly={!isEditMode} />
            </div>
            {/* Phone */}
            <div className="p-form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input 
                id="phone" 
                type="tel" 
                placeholder="0123456789 (10 số)"
                {...register('phone', {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Số điện thoại phải có đúng 10 số'
                  }
                })} 
                readOnly={!isEditMode} 
              />
              {errors.phone && <span className="error-text">{errors.phone.message}</span>}
            </div>
            {/* Address */}
            <div className="p-form-group p-form-group-full">
              <label htmlFor="address">Địa chỉ</label>
              <input 
                id="address" 
                placeholder="Nhập địa chỉ"
                {...register('address')} 
                readOnly={!isEditMode} 
              />
            </div>
            {/* Bio */}
            <div className="p-form-group p-form-group-full">
              <label htmlFor="bio">Tiểu sử</label>
              <textarea id="bio" {...register('bio')} rows="4" readOnly={!isEditMode}></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
