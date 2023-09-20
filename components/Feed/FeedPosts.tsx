import React from 'react';
import { FeedPost } from '@/types/feed';
import { PostComponent } from './PostComponent';

interface ViewPostsProps {
  posts: FeedPost[];
}

export const FeedPosts: React.FC<ViewPostsProps> = ({ posts }) => {;

  return (
    <section className='border border-gray-200 rounded bg-gray-100'>
      {posts &&
        posts.map((post) => <PostComponent key={post.id} post={post} />)}
    </section>
  );
};
