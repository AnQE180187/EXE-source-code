import React from 'react';
import CommentItem from './CommentItem';
import './Comment.css';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p className="comments-empty">Chưa có bình luận nào.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
    </div>
  );
};

export default CommentList;
