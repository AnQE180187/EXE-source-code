import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/forumService';
import PostForm from './PostForm';

const CreatePostPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();

    const handleCreatePost = async (data) => {
        setIsSubmitting(true);
        setApiError(null);
        try {
            const newPost = await createPost(data);
            navigate(`/forum/${newPost.id}`);
        } catch (error) {
            setApiError(error.toString());
        }
        setIsSubmitting(false);
    };

    return (
        <div className="post-form-container">
            <div className="post-form-header">
                <h1>Tạo bài viết mới</h1>
                <p>Chia sẻ câu chuyện, đặt câu hỏi hoặc bắt đầu một cuộc thảo luận với cộng đồng.</p>
            </div>
            {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}
            <PostForm 
                onSubmit={handleCreatePost} 
                isSubmitting={isSubmitting} 
                submitButtonText="Đăng bài"
            />
        </div>
    );
};

export default CreatePostPage;
