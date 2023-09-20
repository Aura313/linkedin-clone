// CreateComment.tsx
import React, { useState } from 'react';
import { User } from '@/types/user';

interface CreateCommentProps {
  postId: string;
  onCommentAdded: (params: any) => any;
  user: User;
}

export const CreateComment: React.FC<CreateCommentProps> = ({
  postId,
  onCommentAdded,
  user,
}) => {
  const [commentContent, setCommentContent] = useState('');
console.log(user.id , "cmkjkckck")
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return; // prevent empty comments

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentContent, userId: user.id }),
      });

      if (response.ok) {
        const newComment = await response.json();
        onCommentAdded(newComment);
        setCommentContent('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className='mb-4'>
      <textarea
        className='w-full p-2 border rounded-full'
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder='Add your comment...'
      ></textarea>
      <button
        className= 'mt-2 px-2 py-1 bg-blue-700 text-xs text-white rounded-full'
        onClick={handleCommentSubmit}
      >
        Post
      </button>
    </div>
  );
};
