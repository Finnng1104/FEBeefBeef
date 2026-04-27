import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostsApi from '../api/PostsApi';
import { PostType } from '../types/PostType';
import PostSidebar from '../components/pages/posts/PostSidebar';
import { usePosts } from '../hooks/usePosts';
import PostListSection from '../components/pages/posts/PostListSection';
import { FaDiamond } from 'react-icons/fa6';

const PostsByTagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  const { isLoading, searchParams, setSearchParams } = usePosts();

  const searchValue = searchParams.get('search') || '';

  useEffect(() => {
    if (tag) {
      setLoading(true);
      PostsApi.getPostsByTag(tag, { search: searchValue })
        .then((res) => setPosts(res.docs))
        .finally(() => setLoading(false));
    }
  }, [tag, searchValue]);

  // Chọn dữ liệu hiển thị: từ search hay từ tag
  const displayPosts = posts;

  return (
    <section className="min-h-screen bg-bodyBackground py-8 sm:py-16 text-white">
      <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto">
        <img
          src="/assets/images/home/IconOnline.svg"
          alt="Icon"
          className="mx-auto mb-8"
        />

        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin mb-4">
            Bài Viết Theo Thẻ
          </h1>
          <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center font-sans font-extralight uppercase tracking-widest mb-4 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: '7px' }} />
            {tag}
            <FaDiamond className="inline ml-2" style={{ fontSize: '7px' }} />
          </h2>
        </div>

        <div className="space-y-8">
          <div className="w-full">
            <PostSidebar
              placement="top"
              onSearch={(value) => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  if (value) {
                    newParams.set('search', value);
                  } else {
                    newParams.delete('search');
                  }
                  newParams.delete('page');
                  return newParams;
                });
              }}
            />
          </div>

          <div className="w-full">
            {loading || isLoading ? (
              <div className="text-center text-gray-300">Đang tải bài viết...</div>
            ) : displayPosts.length > 0 ? (
              <PostListSection posts={displayPosts} isLoading={false} />
            ) : (
              <div className="text-center text-gray-400">
                Không có bài viết nào{' '}
                {searchValue ? 'phù hợp với tìm kiếm.' : 'với thẻ này.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostsByTagPage;
