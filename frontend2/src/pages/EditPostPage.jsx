import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '../services/forumService';
import { useAuth } from '../context/AuthContext';
import PostForm from './PostForm';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const fetchPost = useCallback(async () => {
    try {
      const post = await getPostById(id);
      if (user?.sub !== post.authorId) {
        navigate('/forum');
        return;
      }
      // The form expects tags as a comma-separated string
      const tagsString = post.tags?.map(t => t.tag.name).join(', ') || '';
      setInitialData({ ...post, tags: tagsString });
    } catch (error) {
      setApiError('Không thể tải dữ liệu bài viết.');
    } finally {
      setIsLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleUpdatePost = async (data) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await updatePost(id, data);
      navigate(`/forum/${id}`);
    } catch (error) {
      setApiError(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  return (
    <div className="post-form-container">
        <div className="post-form-header">
            <h1>Chỉnh sửa bài viết</h1>
        </div>
        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}
        {initialData ? (
             <PostForm 
                initialData={initialData}
                onSubmit={handleUpdatePost} 
                isSubmitting={isSubmitting} 
                submitButtonText="Lưu thay đổi"
            />
        ) : (
            !apiError && <p>Không tìm thấy bài viết.</p>
        )}
    </div>
  );
};

export default EditPostPage;
