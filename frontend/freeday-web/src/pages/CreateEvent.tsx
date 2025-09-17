import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { eventsAPI } from '@/services/api';
import { useToast } from '@/components/common/useToast';
import Button from '@/components/common/Button';

// Final simplified schema to avoid environment/library issues
const createEventSchema = z.object({
  title: z.string().nonempty('Tiêu đề không được để trống'),
  description: z.string().nonempty('Mô tả không được để trống'),
  locationText: z.string().nonempty('Địa điểm không được để trống'),
  startAt: z.string().nonempty('Thời gian bắt đầu là bắt buộc'),
  endAt: z.string().nonempty('Thời gian kết thúc là bắt buộc'),
  price: z.coerce.number().min(0, 'Giá vé không hợp lệ').optional(),
  capacity: z.coerce.number().positive('Sức chứa phải là số dương').optional(),
}).refine(data => {
  // Ensure dates are valid before comparing
  const startDate = new Date(data.startAt);
  const endDate = new Date(data.endAt);
  return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate < endDate;
}, {
  message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
  path: ['endAt'],
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      locationText: '',
      startAt: '',
      endAt: '',
    }
  });

  const onSubmit = async (data: CreateEventFormValues) => {
    try {
      const response = await eventsAPI.create(data);
      toast.showToast('Tạo sự kiện thành công!', 'success');
      navigate(`/events/${response.data.id}`);
    } catch (error) {
      toast.showToast('Tạo sự kiện thất bại, vui lòng thử lại.', 'error');
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Tạo sự kiện mới</h1>
        <p className="text-neutral-500 mt-1">Điền thông tin chi tiết để tạo sự kiện của bạn.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-6">
        <div>
          <label htmlFor="title">Tiêu đề sự kiện</label>
          <input id="title" {...register('title')} className={`input ${errors.title ? 'input-error' : ''}`} />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description">Mô tả chi tiết</label>
          <textarea id="description" rows={5} {...register('description')} className={`input ${errors.description ? 'input-error' : ''}`} />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="locationText">Địa điểm</label>
          <input id="locationText" {...register('locationText')} className={`input ${errors.locationText ? 'input-error' : ''}`} />
          {errors.locationText && <p className="text-red-500 text-sm mt-1">{errors.locationText.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startAt">Thời gian bắt đầu</label>
            <input id="startAt" type="datetime-local" {...register('startAt')} className={`input ${errors.startAt ? 'input-error' : ''}`} />
            {errors.startAt && <p className="text-red-500 text-sm mt-1">{errors.startAt.message}</p>}
          </div>
          <div>
            <label htmlFor="endAt">Thời gian kết thúc</label>
            <input id="endAt" type="datetime-local" {...register('endAt')} className={`input ${errors.endAt ? 'input-error' : ''}`} />
            {errors.endAt && <p className="text-red-500 text-sm mt-1">{errors.endAt.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price">Giá vé (để trống nếu miễn phí)</label>
            <input id="price" type="number" {...register('price')} className={`input ${errors.price ? 'input-error' : ''}`} />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="capacity">Sức chứa (để trống nếu không giới hạn)</label>
            <input id="capacity" type="number" {...register('capacity')} className={`input ${errors.capacity ? 'input-error' : ''}`} />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>Hủy</Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>Tạo sự kiện</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
