import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { eventsAPI } from '@/services/api';
import { useToast } from '@/components/common/useToast';
import Button from '@/components/common/Button';

const EventStatus = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED']);

const editEventSchema = z.object({
  id: z.string().optional(),
  title: z.string().nonempty('Tiêu đề không được để trống'),
  description: z.string().nonempty('Mô tả không được để trống'),
  locationText: z.string().nonempty('Địa điểm không được để trống'),
  startAt: z.string().nonempty('Thời gian bắt đầu là bắt buộc'),
  endAt: z.string().nonempty('Thời gian kết thúc là bắt buộc'),
  price: z.coerce.number().min(0, 'Giá vé không hợp lệ').optional(),
  capacity: z.coerce.number().positive('Sức chứa phải là số dương').optional(),
  status: EventStatus.optional(),
}).refine(data => new Date(data.startAt) < new Date(data.endAt), {
  message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
  path: ['endAt'],
});

type EditEventFormValues = z.infer<typeof editEventSchema>;

const EditEvent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [currentStatus, setCurrentStatus] = useState<z.infer<typeof EventStatus> | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventSchema),
  });

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getById(id);
        const eventData = response.data;
        setCurrentStatus(eventData.status);
        reset({
          ...eventData,
          startAt: new Date(eventData.startAt).toISOString().slice(0, 16),
          endAt: new Date(eventData.endAt).toISOString().slice(0, 16),
        });
      } catch (error) {
        toast.showToast('Không thể tải dữ liệu sự kiện.', 'error');
        navigate('/events/manage');
      }
    };

    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onFormSubmit = async (data: EditEventFormValues) => {
    if (!id) return;
    // Exclude status from the main form submission
    const { status, ...updateData } = data;
    try {
      await eventsAPI.update(id, updateData);
      toast.showToast('Cập nhật thông tin sự kiện thành công!', 'success');
      navigate(`/events/manage`);
    } catch (error) {
      toast.showToast('Cập nhật thất bại.', 'error');
    }
  };

  const handleStatusChange = async (newStatus: z.infer<typeof EventStatus>) => {
    if (!id) return;
    try {
      // Use the new dedicated endpoint for status changes
      await eventsAPI.updateStatus(id, { status: newStatus });
      toast.showToast(`Sự kiện đã được ${newStatus === 'PUBLISHED' ? 'công khai' : 'chuyển về bản nháp'}.`, 'success');
      setCurrentStatus(newStatus);
    } catch (error) {
      toast.showToast('Thay đổi trạng thái thất bại.', 'error');
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'PUBLISHED': return <span className="badge badge-success">Đã công khai</span>;
      case 'DRAFT': return <span className="badge badge-warning">Bản nháp</span>;
      case 'CLOSED': return <span className="badge badge-error">Đã đóng</span>;
      case 'CANCELLED': return <span className="badge badge-error">Đã hủy</span>;
      default: return <span className="badge">Không rõ</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-neutral-800">Chỉnh sửa sự kiện</h1>
          {getStatusBadge(currentStatus)}
        </div>
        <p className="text-neutral-500 mt-1">Cập nhật thông tin chi tiết cho sự kiện của bạn.</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="card p-8 space-y-6">
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

        <div className="border-t my-6"></div>

        <div className="flex justify-between items-center gap-4 pt-4">
          <div>
            {currentStatus === 'DRAFT' && (
              <Button type="button" variant="solid" color="success" onClick={() => handleStatusChange('PUBLISHED')} disabled={isSubmitting}>
                Công khai sự kiện
              </Button>
            )}
            {currentStatus === 'PUBLISHED' && (
              <Button type="button" variant="solid" color="warning" onClick={() => handleStatusChange('DRAFT')} disabled={isSubmitting}>
                Chuyển về bản nháp
              </Button>
            )}
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>Hủy</Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>Lưu thay đổi</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;