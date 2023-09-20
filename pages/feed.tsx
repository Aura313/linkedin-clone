import React, { useEffect, useState } from 'react';
import { FeedPosts } from '@/components/Feed/FeedPosts';
import { FeedPost } from '@/types/feed';
import { getSession } from 'next-auth/react';

const FeedPage: React.FC = () => {
  const session = getSession();
  const [userId, setUserId] = useState('');
  const [postContent, setPostContent] = useState<string>('');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const handlePostChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(event.target.value);
  };


  session.then((data) => {
    // console.log(, 'wlsdkwdk');
    let userIdEx = (data && data.user.id) || '';
    setUserId(userIdEx);
  });


  const handlePostSubmit = async () => {
    if (postContent.trim()) {
      // Call API to save the post (You can adjust this endpoint to your actual backend)
      // const userId = localStorage.getItem('userId');

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postContent, userId: userId }),
      });
      const data = await response.json();
      console.log(data, 'datadatadatadata');
      if (response.ok) {
        // Optionally: fetch posts again or prepend to current post list
        // Clear the textarea

        let arr = [];
        arr.push(data);
        arr = [...arr, ...posts];
        console.log(arr, 'ajkajkajkaj');
        setPosts(arr);
        setPostContent('');
      } else {
        // Handle the error
        console.error('Failed to create post.');
      }
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts.');
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className='container mx-auto py-6 px-4'>      
      {/* Post Creation Section */}
      <section className='mb-6 bg-white p-4 rounded shadow'>
        <textarea
          className='w-full p-2 border rounded resize-none'
          rows={2}
          placeholder="What's on your mind?"
          value={postContent}
          onChange={handlePostChange}
        />
        <button
          onClick={handlePostSubmit}
          className='mt-2 bg-cyan-900 hover:bg-cyan-800 text-white px-4 py-2 rounded-full'
        >
          Post
        </button>
      </section>

      {posts && <FeedPosts posts={posts} loading={loading} error={error} />}
    </main>
  );
};

export default FeedPage;
