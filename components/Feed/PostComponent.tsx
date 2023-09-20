import React, { useEffect, useState } from 'react';
import { Comment, FeedPost } from '@/types/feed';
import { CommentsComponent } from './CommentsComponent';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface PostProps {
  post: FeedPost;
}

export const PostComponent: React.FC<PostProps> = ({ post }) => {
  const session = getSession();
  const [userId, setUserId] = useState('');
  const router = useRouter();
  // const { data: session } = useSession();

  session.then((data) => {
    // console.log(, 'wlsdkwdk');
    let userIdEx = (data && data.user.id) || '';
    setUserId(userIdEx);
  });

  const [currentPost, setCurrentPost] = useState(post);
  const [isLiking, setIsLiking] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const { content, reactions, shares, comments } = currentPost; // Destructuring for better readability

  // const handleLike = async (postId: string, userId: string) => {
  //   setIsLiking(true);
  //   try {
  //     const response = await fetch(`/api/posts/${postId}/like`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userId: userId }),
  //     });

  //     if (response.ok) {
  //       const updatedPost = await response.json();
  //       setCurrentPost(updatedPost);
  //     }
  //   } catch (error) {
  //     console.error('Error liking post:', error);
  //   } finally {
  //     setIsLiking(false); // Ensure you set the loading state to false regardless of request success or failure
  //   }
  // };

  const handleLike = async (postId: string, userId: string) => {
    setIsLiking(true);
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setCurrentPost(updatedPost);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  // const handleLike = async (postId: string, userId: string) => {
  //   setIsLiking(true);
  //   try {
  //     const response = await fetch(`/api/posts/${postId}/like`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userId: userId }),
  //     });

  //     if (response.ok) {
  //       const responseData = await response.json();
  //       console.log(responseData, "responseData")
  //       // Logic based on whether the post was liked or unliked
  //       if (responseData.action === 'liked') {
  //         setCurrentPost(prevPost => ({
  //           ...prevPost,
  //           reactions: [...prevPost.reactions, responseData.reaction], // or however you'd like to handle adding the new reaction
  //         }));
  //       } else if (responseData.action === 'unliked') {
  //         setCurrentPost(prevPost => ({
  //           ...prevPost,
  //           reactions: prevPost.reactions.filter(reaction => reaction.userId !== userId),
  //         }));
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error liking post:', error);
  //   } finally {
  //     setIsLiking(false);
  //   }
  // };

  const onClickComment = () => {
    setShowComment(!showComment);
  };

  // Function to handle the addition of a new comment
  const onCommentAdded = (updatedCommnet: Comment) => {
    console.log(
      updatedCommnet,
      'updatedCommnetupdatedCommnetupdatedCommnetupdatedCommnet'
    );
    let arr2: Comment[] = [];
    arr2.push(updatedCommnet);
    arr2 = [...arr2, ...currentPost.comments];
    console.log(arr2, 'updatedCommnetupdatedCommnet');

    // Update the current post's comments with the new comment
    setCurrentPost((prev) => ({
      ...prev,
      comments: arr2,
    }));

    setShowComment(!showComment);
  };

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  console.log(comments, 'comments121221');
  return (
    <article className='rounded-lg border-gray-200 p-2'>
      <div key={currentPost.id} className='bg-white p-4'>
        {/* User info */}
        <div className='flex items-center mb-3'>
          {/* Profile picture */}
          <img
            src={
              currentPost.user.profile?.profilePicUrl ||
              '/assets/userplaceholder.jpeg'
            }
            alt={currentPost.user?.name}
            className='w-12 h-12 rounded-full mr-4 border border-gray-200 object-cover'
          />

          {/* Username and post timestamp */}
          <div>
            {/* className='font-medium text-sm' */}
            <a
              className='text-cyan-900 hover:underline'
              onClick={(e) => {
                e.preventDefault();
                router.push(`/profile/${currentPost.user?.id}`);
              }}
            >
              {currentPost.user?.name}
            </a>
            <br />
            <span className='text-xs text-gray-500'>
              {new Date(currentPost.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Post content */}
        <p className='mb-3 text-sm'>{content}</p>

        {/* Optional: Display reactions, comments, media, etc. You can expand upon this. */}

        {/* Reactions, comments, and actions */}
        <div className='border-t border-gray-200 pt-2 text-sm text-gray-500'>
          <div className='flex justify-between mb-2'>
            {/* Reactions, comments count, etc. */}

            {isLiking ? (
              <div className='flex justify-center items-center my-2'>
                {/* Replace this with your loader/spinner component */}
                <div
                  className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                  role='status'
                >
                  <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                    Loading...
                  </span>
                </div>
              </div>
            ) : (
              <div className='flex space-x-2'>
                {/* You can replace these placeholders with actual icons or data */}
                <button
                  onClick={() =>
                    handleLike(currentPost.id, currentPost.user.id)
                  }
                  className='text-blue-500'
                >
                  <span>👍 {currentPost.reactions.length}</span>
                </button>
                <button
                  className='text-blue-500 hover:underline'
                  onClick={onClickComment}
                >
                  {' '}
                  <span>💬 {currentPost.comments?.length}</span>{' '}
                </button>
              </div>
            )}

            {/* Timestamp again or other data */}
            <span>
              {new Date(currentPost.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Action buttons */}
          <div className='flex justify-between space-x-4'>
            {/* <button
              onClick={() => handleLike(post.id)}
              className='text-blue-500'
            >
              Like
            </button> */}

            {/* <button className='text-blue-500 hover:underline'>Share</button> */}
            {/* ... add more actions as needed */}
          </div>
        </div>
      </div>

      {comments && showComment && (
        <CommentsComponent
          comments={comments}
          postId={currentPost.id}
          onCommentAdded={onCommentAdded}
          user={currentPost.user}
          showComment={showComment}
        />
      )}
    </article>
  );
};
