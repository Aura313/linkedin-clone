import React, { useEffect, useState } from 'react';
import { Comment } from '@/types/feed';
import { User } from '@/types/user';
import { CreateComment } from './CreateComment';
import { ViewComments } from './ViewComments';
import { getSession } from 'next-auth/react';
interface CommentsProps {
  comments: Comment[];
  postId: string; // To uniquely identify which post we are commenting on.
  onCommentAdded: (params: any) => any;
  user: User;
  showComment: boolean;
}

export const CommentsComponent: React.FC<CommentsProps> = ({
  comments,
  postId,
  onCommentAdded,
  user,
  showComment,
}) => {
  // const [currentComments, setCurrentComments] = useState()
  const [commentContent, setCommentContent] = useState('');
  const [userData, setUserData] = useState<User | null>(null);


  const session = getSession();
  const [userId, setUserId] = useState('');
  // const { data: session } = useSession();

  session.then((data) => {
    // console.log(, 'wlsdkwdk');
    let userIdEx = (data && data.user.id) || '';
    setUserId(userIdEx);
  });


  useEffect(() => {
    if (userId) {
      // Fetch user data when id is available
      fetch(`/api/profile?userId=${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setUserData(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [userId]);

  // const handleCommentSubmit = async () => {
  //   if (!commentContent.trim()) return; // prevent empty comments
  //   console.log(user.id, 'userIduserIduserId');
  //   try {
  //     const response = await fetch(`/api/posts/${postId}/comment`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ content: commentContent, userId: user.id }),
  //     });

  //     if (response.ok) {
  //       const updatedCommnet = await response.json();
  //       onCommentAdded(updatedCommnet); // Inform the parent about the new comment
  //       setCommentContent(''); // Clear the comment input
  //     }
  //   } catch (error) {
  //     console.error('Error adding comment:', error);
  //   }
  // };
  if (!userData)
  return <p className='text-center text-lg mt-6'>User not found.</p>;
console.log(userData, "useruseruseruser");
  return (
    <section className='p-6 border-t border-gray-200 text-sm text-gray-500 bg-white'>
      {/* <h2 className='text-xl font-medium mb-2'>Comments</h2> */}

      <CreateComment
        postId={postId}
        onCommentAdded={onCommentAdded}
        user={userData}
      />

      <ViewComments comments={comments} user={user} />
    </section>
  );
};
