import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './PostForm.css';

// Validation schema
const postSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  content: z.string().min(20, 'Nội dung phải có ít nhất 20 ký tự'),
  forumTags: z.string().optional(),
});

const PostForm = ({ initialData, onSubmit, isSubmitting, submitButtonText }) => {

  const defaultTagsString = initialData?.forumTags?.map(t => t.tag.name).join(', ') || '';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: initialData ? { title: initialData.title, content: initialData.content, forumTags: defaultTagsString } : { title: '', content: '', forumTags: '' },
  });

  const handleFormSubmit = (data) => {
    const finalData = { title: data.title, content: data.content };
    // Convert forumTags string to array of names expected by backend
    if (data.forumTags) {
      finalData.forumTags = data.forumTags.split(',').map(tag => tag.trim()).filter(Boolean);
    } else {
      finalData.forumTags = [];
    }
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="post-form">
      <div className="post-form-group">
        <label htmlFor="title">Tiêu đề</label>
        <input 
          id="title" 
          {...register('title')} 
          placeholder="Bạn có câu hỏi gì?" 
          className={errors.title ? 'input-error' : ''}
        />
        {errors.title && <p className="form-error-text">{errors.title.message}</p>}
      </div>

      <div className="post-form-group">
        <label htmlFor="content">Nội dung</label>
        <textarea 
          id="content" 
          {...register('content')} 
          rows="12" 
          placeholder="Mô tả chi tiết vấn đề hoặc câu chuyện của bạn..."
          className={errors.content ? 'input-error' : ''}
        ></textarea>
        {errors.content && <p className="form-error-text">{errors.content.message}</p>}
      </div>

      <div className="post-form-group">
        <label htmlFor="forumTags">Tags (phân cách bởi dấu phẩy)</label>
        <input 
          id="forumTags" 
          {...register('forumTags')} 
          placeholder="VD: tìm bạn, hỏi đáp, chia sẻ"
        />
      </div>

      <div className="post-form-actions">
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
