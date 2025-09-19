import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import { useToast } from '@/components/common/useToast';
import { forumService } from '@/services/forumService';
import { useAuthStore } from '@/store/useAuthStore';

// Form validation types
interface CreatePostFormValues {
  title: string;
  content: string;
  tags?: string;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormValues>({
    defaultValues: {
      title: '',
      content: '',
      tags: '',
    },
  });

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      if (!user) {
        toast.showToast('Bạn cần đăng nhập để đăng bài.', 'error');
        return;
      }
      // Process tags string into an array of non-empty strings
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const response = await forumService.createPost({
        title: data.title,
        content: data.content,
        tagIds: tagsArray,
        authorId: user.id,
      });

      toast.showToast('Đăng bài thành công!', 'success');
      // Navigate to the newly created post, assuming API returns the new post object with its id
      navigate(`/forum/${response.data.id}`);
    } catch (error) {
      toast.showToast('Đăng bài thất bại, vui lòng thử lại.', 'error');
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
          Tạo bài viết mới
        </h1>
        <p className="text-lg text-neutral-600">
          Chia sẻ kế hoạch của bạn và tìm những người có cùng sở thích.
        </p>
      </div>

      <div className="card p-8">
        {/* userId debug: {user?.id} */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="Ví dụ: Tìm bạn đi hiking Bà Nà cuối tuần này"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
              Nội dung chi tiết
            </label>
            <textarea
              id="content"
              rows={8}
              {...register('content')}
              className={`input ${errors.content ? 'input-error' : ''}`}
              placeholder="Mô tả chi tiết về kế hoạch của bạn, những gì bạn mong đợi..."
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
              Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              id="tags"
              {...register('tags')}
              className="input"
              placeholder="Ví dụ: hiking, bà nà, cuối tuần"
            />
            <p className="text-sm text-neutral-500 mt-1">
              Tags giúp người khác dễ dàng tìm thấy bài viết của bạn.
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/forum')}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Đăng bài
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 