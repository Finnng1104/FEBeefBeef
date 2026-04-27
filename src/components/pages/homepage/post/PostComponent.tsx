import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonComponents from '../../../common/ButtonComponents';
import { PostType } from '../../../../types/PostType';

interface ArticleCardProps {
  article: PostType;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();
  const categoryName = article.categories_id?.Cate_name || 'Tin tức';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-hr bg-headerBackground transition-all duration-300 hover:-translate-y-1 hover:border-secondaryColor/40">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={article.images?.[0] || '/assets/images/default-post.jpg'}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 rounded bg-secondaryColor px-3 py-1 text-[11px] font-semibold text-headerBackground">
          {new Date(article.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-secondaryColor">
          {categoryName}
        </p>
        <h3 className="mb-2 min-h-[3.5rem] line-clamp-2 break-words text-lg font-semibold leading-snug text-white">
          {article.title}
        </h3>
        <p className="mb-4 flex-grow line-clamp-3 text-sm text-gray-300">
          {article.desc}
        </p>
        <div className="mt-auto">
          <ButtonComponents
            variant="outline"
            size="small"
            className="w-full md:w-auto"
            onClick={() => navigate(`/post-details/${article._id}`)}
          >
            ĐỌC THÊM
          </ButtonComponents>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
