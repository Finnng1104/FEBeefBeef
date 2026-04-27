import React from 'react';
import PostListSection from '../components/pages/posts/PostListSection';
import PostSidebar from '../components/pages/posts/PostSidebar';
import { usePosts } from '../hooks/usePosts';
import Pagination from '../components/common/Pagination';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { FaDiamond } from 'react-icons/fa6';

const PostPage: React.FC = () => {
  const {
    data: postsData,
    isLoading,
    searchParams,
    setSearchParams,
  } = usePosts();

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
            Tin Tức & Sự Kiện
          </h1>
          <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center font-sans font-extralight uppercase tracking-widest mb-4 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: '7px' }} />
            Khám phá ẩm thực cùng BeefBeef
            <FaDiamond className="inline ml-2" style={{ fontSize: '7px' }} />
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-300 normal-case">
            Khám phá món ăn, không gian và những câu chuyện phía sau căn bếp của
            BeefBeef.
          </p>
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

          <div className="relative w-full">
            {isLoading ? (
              <LoadingOverlay loading={true} />
            ) : (
              <>
                <PostListSection posts={postsData?.docs || []} isLoading={false} />
                <div className="mt-10">
                  <Pagination
                    currentPage={postsData?.page || 1}
                    totalPages={postsData?.totalPages || 1}
                    onPageChange={(page) => {
                      const newParams = new URLSearchParams(
                        searchParams.toString(),
                      );
                      newParams.set('page', String(page));
                      setSearchParams(newParams);
                    }}
                    limit={Number(searchParams.get('limit') || 10)}
                    onLimitChange={(newLimit) => {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set('limit', newLimit.toString());
                        newParams.delete('page');
                        return newParams;
                      });
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostPage;
