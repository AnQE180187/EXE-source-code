import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getCloudinarySignature, uploadImage } from '../services/uploadService';

import './EventForm.css';

// Validation schema using Zod
const eventSchema = z.object({
  title: z.string().min(3, 'Tên sự kiện phải có ít nhất 3 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  locationText: z.string().min(5, 'Địa điểm là bắt buộc'),
  startAt: z.string().refine(val => new Date(val) > new Date(), 'Thời gian bắt đầu phải ở tương lai'),
  endAt: z.string(),
  price: z.preprocess(
    a => parseFloat(String(a)),
    z.number().min(0, 'Giá vé không thể âm').optional()
  ),
  capacity: z.preprocess(
    a => parseInt(String(a), 10),
    z.number().min(1, 'Số lượng phải lớn hơn 0')
  ),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED']),
  tags: z.string().optional(), // Tags will be a comma-separated string
}).refine(data => new Date(data.endAt) > new Date(data.startAt), {
  message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
  path: ['endAt'],
});

const EventForm = ({ initialData, onSubmit, isSubmitting, submitButtonText = 'Submit' }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null);
  const [uploadError, setUploadError] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: { status: 'DRAFT', price: 0, capacity: 10, tags: '' },
  });

  useEffect(() => {
    if (initialData) {
        const tagsString = initialData.tags?.map(t => t.tag.name).join(', ') || '';
        reset({
            ...initialData,
            startAt: initialData.startAt ? new Date(initialData.startAt).toISOString().slice(0, 16) : '',
            endAt: initialData.endAt ? new Date(initialData.endAt).toISOString().slice(0, 16) : '',
            tags: tagsString,
        });
        setImagePreview(initialData.imageUrl);
    }
  }, [initialData, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (data) => {
    let finalData = { ...data };
    setUploadError(null);

    // Convert tags string to array
    if (finalData.tags) {
        finalData.tags = finalData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    } else {
        finalData.tags = [];
    }

    if (imageFile) {
      try {
        const { signature, timestamp, apiKey, cloudName } = await getCloudinarySignature();
        const cloudinaryResponse = await uploadImage(imageFile, signature, timestamp, apiKey, cloudName);
        finalData.imageUrl = cloudinaryResponse.secure_url;
      } catch (error) {
        setUploadError('Lỗi tải ảnh lên. Vui lòng thử lại.');
        return; // Stop submission if image upload fails
      }
    }
    await onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="event-form">
      <div className="form-grid">
        {/* Left Column */}
        <div className="form-column">
          <div className="form-group">
            <label htmlFor="title">Tên sự kiện</label>
            <input id="title" {...register('title')} className={errors.title ? 'input-error' : ''} />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả chi tiết</label>
            <textarea id="description" {...register('description')} rows="10" className={errors.description ? 'input-error' : ''}></textarea>
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="locationText">Địa điểm</label>
            <input id="locationText" {...register('locationText')} className={errors.locationText ? 'input-error' : ''} />
            {errors.locationText && <p className="error-text">{errors.locationText.message}</p>}
          </div>

           <div className="form-group">
            <label htmlFor="tags">Tags (phân cách bởi dấu phẩy)</label>
            <input id="tags" {...register('tags')} placeholder="VD: âm nhạc, công nghệ, workshop" />
          </div>
        </div>

        {/* Right Column */}
        <div className="form-column">
          <div className="form-group">
            <label>Ảnh bìa</label>
            <div className="image-preview-wrapper">
                {imagePreview ? (
                    <img src={imagePreview} alt="Xem trước ảnh bìa" className="image-preview" />
                ) : (
                    <div className="image-placeholder"><span>Chưa có ảnh</span></div>
                )}
            </div>
            <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
            {uploadError && <p className="error-text">{uploadError}</p>}
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="startAt">Thời gian bắt đầu</label>
              <input id="startAt" type="datetime-local" {...register('startAt')} className={errors.startAt ? 'input-error' : ''} />
              {errors.startAt && <p className="error-text">{errors.startAt.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="endAt">Thời gian kết thúc</label>
              <input id="endAt" type="datetime-local" {...register('endAt')} className={errors.endAt ? 'input-error' : ''} />
              {errors.endAt && <p className="error-text">{errors.endAt.message}</p>}
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="price">Giá vé (VND)</label>
              <input id="price" type="number" {...register('price')} placeholder="Để trống nếu miễn phí" />
              {errors.price && <p className="error-text">{errors.price.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="capacity">Số lượng</label>
              <input id="capacity" type="number" {...register('capacity')} />
              {errors.capacity && <p className="error-text">{errors.capacity.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Trạng thái</label>
            <select id="status" {...register('status')}>
              <option value="DRAFT">Bản nháp</option>
              <option value="PUBLISHED">Công khai</option>
              {initialData && <option value="CLOSED">Đã đóng</option>}
              {initialData && <option value="CANCELLED">Đã hủy</option>}
            </select>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
