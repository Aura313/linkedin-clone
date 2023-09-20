import React from 'react';
import { Post } from '../../types/user';

interface Props {
  posts: Post[];
}

const UserPosts: React.FC<Props> = ({ posts }) => {
    return (
      <div className="mt-4 space-y-4">
        {posts.map(post => (
          <div key={post.id} className="p-6 bg-white shadow-sm border border-gray-200 rounded-lg">
            <p className="text-gray-800">{post.content}</p>
            <p className="text-gray-600 text-sm mt-4">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
  }
  
export default UserPosts;
