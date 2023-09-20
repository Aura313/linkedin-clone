// ViewComments.tsx
import React, { useState, useEffect } from 'react';
import { Comment } from '@/types/feed';
import { User } from '@/types/user';

interface ViewCommentsProps {
  comments: Comment[];
}

export const ViewComments: React.FC<ViewCommentsProps> = ({
  comments,
}) => {
  // const [currentComments, setCurrentComments] = useState(comments);
  // useEffect(() => {
  //   setCurrentComments(currentComments);
  // }, [currentComments]);

  return (
    <section className='mt-4 bg-gray-100 rounded p-2'>
      {comments &&
        comments.map((comment) => (
          <div key={comment.id} className='border-t mt-2 pt-2'>
            <div className='flex items-center mb-3'>
              <img
                src={
                  comment.user.profile?.profilePicUrl || '/assets/userplaceholder.jpeg'
                }
                alt={comment.user?.name}
                className='w-12 h-12 rounded-full mr-4 border border-gray-200 object-cover'
              />
              <div>
                <span className='font-medium text-sm'>{comment.user?.name}</span>
                <br />
                <span className='text-xs text-gray-500'>
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
    </section>
  );
};
