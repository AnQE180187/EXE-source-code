import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/common/Button';

const EVENT_TYPES = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'networking', label: 'Networking' },
  { value: 'art', label: 'Art' },
];
const EVENT_VIBES = [
  { value: 'chill', label: 'Chill' },
  { value: 'năng động', label: 'Năng động' },
  { value: 'kết nối', label: 'Kết nối' },
  { value: 'khám phá', label: 'Khám phá' },
];

export interface EventFormValues {
  title: string;
  description: string;
  type: string;
  vibe: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  startTime: string;
  endTime: string;
  price: number;
  capacity: number;
  imageUrls: string[];
  tags: string;
  weatherTip?: string;
  isFeatured: boolean;
}

interface EventFormProps {
  initialValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

const EventForm: React.FC<EventFormProps> = ({ initialValues = {}, onSubmit, onCancel, mode = 'create' }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventFormValues>({
    defaultValues: {
      title: '',
      description: '',
      type: '',
      vibe: '',
      location: { address: '', lat: 0, lng: 0 },
      startTime: '',
      endTime: '',
      price: 0,
      capacity: 1,
      imageUrls: [],
      tags: '',
      weatherTip: '',
      isFeatured: false,
      ...initialValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="font-medium">Tên sự kiện</label>
        <input {...register('title', { required: true })} className="input" placeholder="Nhập tên sự kiện" />
        {errors.title && <span className="text-red-500 text-sm">Bắt buộc</span>}
      </div>
      <div>
        <label className="font-medium">Mô tả chi tiết</label>
        <textarea {...register('description', { required: true })} className="input" rows={4} placeholder="Mô tả chi tiết, mục tiêu, nội dung..." />
        {errors.description && <span className="text-red-500 text-sm">Bắt buộc</span>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Loại hình</label>
          <select {...register('type', { required: true })} className="input">
            <option value="">Chọn loại hình</option>
            {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {errors.type && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div>
          <label className="font-medium">Vibe</label>
          <select {...register('vibe', { required: true })} className="input">
            <option value="">Chọn vibe</option>
            {EVENT_VIBES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
          {errors.vibe && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
      </div>
      <div>
        <label className="font-medium">Địa điểm</label>
        <input {...register('location.address', { required: true })} className="input" placeholder="Địa chỉ cụ thể" />
        <div className="grid grid-cols-2 gap-4 mt-2">
          <input type="number" step="any" {...register('location.lat', { required: true })} className="input" placeholder="Vĩ độ (lat)" />
          <input type="number" step="any" {...register('location.lng', { required: true })} className="input" placeholder="Kinh độ (lng)" />
        </div>
        {(errors.location?.address || errors.location?.lat || errors.location?.lng) && <span className="text-red-500 text-sm">Bắt buộc</span>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Thời gian bắt đầu</label>
          <input type="datetime-local" {...register('startTime', { required: true })} className="input" />
          {errors.startTime && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
        <div>
          <label className="font-medium">Thời gian kết thúc</label>
          <input type="datetime-local" {...register('endTime', { required: true })} className="input" />
          {errors.endTime && <span className="text-red-500 text-sm">Bắt buộc</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Giá vé (₫)</label>
          <input type="number" min={0} {...register('price', { required: true })} className="input" />
        </div>
        <div>
          <label className="font-medium">Số người tối đa</label>
          <input type="number" min={1} {...register('capacity', { required: true })} className="input" />
        </div>
      </div>
      <div>
        <label className="font-medium">Ảnh sự kiện (URL, cách nhau bởi dấu phẩy)</label>
        <input {...register('imageUrls')} className="input" placeholder="https://..." />
      </div>
      <div>
        <label className="font-medium">Tags (từ khóa, cách nhau bởi dấu phẩy)</label>
        <input {...register('tags')} className="input" placeholder="miễn phí, kỹ năng mềm, sáng tạo..." />
      </div>
      <div>
        <label className="font-medium">Lưu ý thời tiết (nếu có)</label>
        <input {...register('weatherTip')} className="input" placeholder="Mang theo áo mưa, nước uống..." />
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" {...register('isFeatured')} id="isFeatured" />
        <label htmlFor="isFeatured" className="font-medium">Sự kiện nổi bật</label>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button type="submit" className="btn-primary">
          {mode === 'edit' ? 'Lưu' : 'Tạo sự kiện'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm; 