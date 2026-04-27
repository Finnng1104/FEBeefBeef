import React from 'react';
import ArticleCard from './PostComponent';
import { FaDiamond } from 'react-icons/fa6';
import { usePosts } from '../../../../hooks/usePosts';

const Postcomponent = () => {
  const { data: postsData, isLoading, error } = usePosts({
    limit: 3,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: 'published',
  });

  const articlesToDisplay = (postsData?.docs ?? []).slice(0, 3);

  return (
    <section className="w-full bg-bodyBackground py-8 sm:py-16 text-white">
      <div className="w-11/12 md:w-container95 lg:w-container95 xl:w-container95 2xl:w-mainContainer mx-auto">
        <img
          src="/assets/images/home/IconOnline.svg"
          alt="Icon"
          className="mx-auto mb-8"
        />
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-restora font-thin mb-4">
            Tin Tức & Sự Kiện
          </h2>
          <h2 className="text-xs sm:text-sm md:text-base flex justify-center items-center font-sans font-extralight uppercase tracking-widest mb-6 text-secondaryColor">
            <FaDiamond className="inline mr-2" style={{ fontSize: '7px' }} />
            Đặc biệt hôm nay
            <FaDiamond className="inline ml-2" style={{ fontSize: '7px' }} />
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-300">Đang tải bài viết...</div>
        ) : error ? (
          <div className="text-center text-red-400">
            Lỗi khi tải bài viết: {error.message}
          </div>
        ) : articlesToDisplay.length === 0 ? (
          <div className="text-center text-gray-400">Hiện chưa có bài viết mới.</div>
        ) : (
          <>
            <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-5 px-1 pb-2 hide-scrollbar">
              {articlesToDisplay.map((article) => (
                <div
                  key={article._id}
                  className="min-w-[85%] sm:min-w-[62%] snap-center flex-shrink-0"
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {articlesToDisplay.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Postcomponent;
