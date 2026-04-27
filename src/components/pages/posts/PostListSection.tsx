import React from 'react';
import Post from './Post';
import { PostType } from '../../../types/PostType';

interface PostListSectionProps {
  posts: PostType[];
  isLoading?: boolean;
}

const PostListSection: React.FC<PostListSectionProps> = ({
  posts,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="text-lg text-white">Đang tải dữ liệu bài viết...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-14 text-center text-gray-400">
        Hiện chưa có bài viết phù hợp.
      </div>
    );
  }

  return (
    <section className="text-white">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {posts.map((post) => (
            <div key={post._id} className="h-full">
              <Post post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostListSection;
