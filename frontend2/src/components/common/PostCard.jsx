import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp } from 'lucide-react';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <img 
          src={post.author.avatarUrl} 
          alt={post.author.name} 
          className="w-12 h-12 rounded-full bg-slate-200"
        />
        <div className="flex-grow">
          <Link to={`/forum/${post.id}`} className="hover:underline">
            <h2 className="text-xl font-bold text-slate-800">{post.title}</h2>
          </Link>
          <p className="text-sm text-slate-500 mt-1">
            Đăng bởi <span className="font-semibold">{post.author.name}</span> - {new Date(post.createdAt).toLocaleDateString('vi-VN')}
          </p>
          <p className="text-slate-700 mt-3 line-clamp-2">
            {post.content}
          </p>
          <div className="flex items-center gap-6 text-slate-500 mt-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>{post.commentsCount} bình luận</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;