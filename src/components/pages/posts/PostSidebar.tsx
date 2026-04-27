import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCategoriesNew } from '@/hooks/useCategories';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PostsApi from '@/api/PostsApi';
import { getPostCoverImage } from './postCoverImage';
import { FiSearch } from 'react-icons/fi';

interface PostSidebarProps {
  className?: string;
  onSearch?: (value: string) => void;
  placement?: 'side' | 'top';
}

const PostSidebar: React.FC<PostSidebarProps> = ({
  className,
  onSearch,
  placement = 'side',
}) => {
  const isTopPlacement = placement === 'top';
  const [showCategories, setShowCategories] = useState(false);
  const [showLatestPosts, setShowLatestPosts] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { categories } = useCategoriesNew();
  const navigate = useNavigate();
  const { search: locationSearch } = useLocation();
  const currentCategoryId =
    new URLSearchParams(locationSearch).get('categoryId') || '';
  const { tag: paramTag } = useParams<{ tag?: string }>();
  const activeTag = paramTag ? decodeURIComponent(paramTag) : '';

  const { data: latestPostsData, isLoading: isLatestPostsLoading } = useQuery({
    queryKey: ['sidebar-latest-posts'],
    queryFn: () =>
      PostsApi.getAllPosts({
        page: 1,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: 'published',
      }),
    enabled: !isTopPlacement,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleCategoryClick = (categoryId?: string) => {
    const url = new URL(window.location.href);
    if (categoryId) {
      url.searchParams.set('categoryId', categoryId);
    } else {
      url.searchParams.delete('categoryId');
    }
    url.searchParams.delete('page');
    navigate(`/posts?${url.searchParams.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (typeof onSearch === 'function') onSearch(e.target.value);
    }, 450);
  };

  const handleSearch = () => {
    if (typeof onSearch === 'function') onSearch(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post-details/${postId}`);
  };

  const latestPosts = latestPostsData?.docs || [];
  const categoriesVisible = showCategories;
  const latestPostsVisible = showLatestPosts;

  const normalizeText = (value: string): string =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const toolbarTabs = useMemo(() => {
    const categoryList = categories?.data || [];
    const matchByKeywords = (keywords: string[]) => {
      return (
        categoryList.find((cat) => {
          const normalized = normalizeText(cat.Cate_name || '');
          return keywords.some((keyword) => normalized.includes(keyword));
        }) || null
      );
    };

    return [
      { key: 'all', label: 'TẤT CẢ', categoryId: undefined, disabled: false },
      {
        key: 'new-food',
        label: 'MÓN ĂN MỚI',
        categoryId: matchByKeywords(['mon an moi'])?._id,
        disabled: !matchByKeywords(['mon an moi']),
      },
      {
        key: 'culinary',
        label: 'ẨM THỰC',
        categoryId: matchByKeywords(['am thuc'])?._id,
        disabled: !matchByKeywords(['am thuc']),
      },
      {
        key: 'beef-world',
        label: 'THẾ GIỚI THỊT BÒ',
        categoryId: matchByKeywords(['the gioi thit bo'])?._id,
        disabled: !matchByKeywords(['the gioi thit bo']),
      },
    ];
  }, [categories?.data]);

  const activeTabKey = useMemo(() => {
    if (activeTag) return '';

    const matchedTab = toolbarTabs.find((tab) => {
      if (tab.key === 'all') return !currentCategoryId;
      return !!tab.categoryId && tab.categoryId === currentCategoryId;
    });

    return matchedTab?.key || 'all';
  }, [activeTag, currentCategoryId, toolbarTabs]);

  const sectionCardClass =
    'space-y-4 rounded-2xl border border-hr bg-headerBackground p-5 shadow-sm transition-shadow hover:shadow-lg h-fit self-start';

  if (isTopPlacement) {
    return (
      <aside className={`w-full space-y-4 text-white ${className ?? ''}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <nav className="min-w-0 flex-1 overflow-hidden">
            <ul className="flex items-center gap-6 overflow-x-auto border-b border-white/10 pb-2 hide-scrollbar">
              {toolbarTabs.map((tab) => {
                const isActive = activeTabKey === tab.key;
                return (
                  <li key={tab.key}>
                    <button
                      type="button"
                      className={`whitespace-nowrap pb-2 text-xs tracking-wide normal-case transition md:text-sm ${
                        isActive
                          ? 'border-b-2 border-secondaryColor font-semibold text-secondaryColor'
                          : 'border-b-2 border-transparent font-medium text-gray-300 hover:text-secondaryColor'
                      } ${
                        tab.disabled
                          ? 'cursor-not-allowed opacity-50 hover:text-gray-400'
                          : ''
                      }`}
                      onClick={() => {
                        if (tab.disabled) return;
                        handleCategoryClick(tab.categoryId);
                      }}
                    >
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative w-full max-w-[320px]">
            <input
              type="text"
              placeholder="Tìm theo tiêu đề..."
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-hr bg-transparent py-2 pl-3 pr-10 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-secondaryColor"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondaryColor hover:text-white"
              aria-label="Tìm kiếm"
            >
              <FiSearch className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`w-full space-y-6 text-white lg:space-y-8 ${className ?? ''}`}
    >
      <div className={sectionCardClass}>
        <h3 className="text-xl font-semibold tracking-wide">Tìm kiếm</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-hr bg-transparent py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-secondaryColor"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-secondaryColor hover:text-white"
            aria-label="Tìm kiếm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M16.65 10.5a6.15 6.15 0 11-12.3 0 6.15 6.15 0 0112.3 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={sectionCardClass}>
        <div
          className="flex cursor-pointer select-none items-center justify-between"
          onClick={() => setShowCategories(!showCategories)}
        >
          <h3 className="text-xl font-semibold tracking-wide">Chuyên mục</h3>
          <span className="text-xl lg:hidden transition-transform">
            {showCategories ? (
              <svg
                width="20"
                height="20"
                fill="none"
                className="inline-block"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5 10h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                fill="none"
                className="inline-block"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 5v10M5 10h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        </div>

        <ul
          className={`${categoriesVisible ? 'block' : 'hidden'} space-y-2 lg:block`}
        >
          <li
            key="all"
            className={`cursor-pointer text-sm transition ${!activeTag && !currentCategoryId ? 'text-secondaryColor' : 'hover:text-secondaryColor'}`}
            onClick={() => handleCategoryClick(undefined)}
          >
            Tất cả
          </li>
          {categories?.data?.map((cat) => (
            <li
              key={cat._id}
              className={`cursor-pointer text-sm transition ${!activeTag && currentCategoryId === cat._id ? 'text-secondaryColor' : 'hover:text-secondaryColor'}`}
              onClick={() => handleCategoryClick(cat._id)}
            >
              {cat.Cate_name}
            </li>
          ))}
        </ul>
      </div>

      <div className={sectionCardClass}>
        <div
          className="flex cursor-pointer select-none items-center justify-between"
          onClick={() => setShowLatestPosts(!showLatestPosts)}
        >
          <h3 className="text-xl font-semibold tracking-wide">
            Bài viết mới nhất
          </h3>
          <span className="text-xl lg:hidden transition-transform">
            {showLatestPosts ? (
              <svg
                width="20"
                height="20"
                fill="none"
                className="inline-block"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5 10h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                fill="none"
                className="inline-block"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 5v10M5 10h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        </div>

        <ul
          className={`${latestPostsVisible ? 'block' : 'hidden'} space-y-3 lg:block`}
        >
          {isLatestPostsLoading ? (
            <li className="text-sm text-gray-400">Đang tải bài viết...</li>
          ) : latestPosts.length > 0 ? (
            latestPosts.map((post, index) => (
              <li key={post._id}>
                <button
                  type="button"
                  onClick={() => handlePostClick(post._id)}
                  className="group -mx-2 flex w-full items-start gap-3 rounded-lg p-2 text-left transition hover:bg-white/5"
                >
                  <img
                    src={getPostCoverImage(post, index)}
                    alt={post.title}
                    className="h-16 w-16 flex-shrink-0 rounded-lg border border-white/10 object-cover"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1 normal-case">
                    <span className="mb-1 block text-[11px] tracking-wide text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="block line-clamp-2 text-sm leading-5 transition-colors group-hover:text-secondaryColor">
                      {post.title}
                    </span>
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-400">Chưa có bài viết.</li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default PostSidebar;
