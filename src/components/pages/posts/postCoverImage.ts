import { PostType } from '../../../types/PostType';

const BLOG_FALLBACK_IMAGES = [
  '/assets/images/posts/Post_4.png', // Food
  '/assets/images/posts/Post_2.png', // Space
  '/assets/images/home/discover2.jpg', // Staff activity
  '/assets/images/home/discover3.jpg', // Guest experience
  '/assets/images/posts/Post_7.png', // Cozy corner
  '/assets/images/posts/Post.jpg', // Grill station
];

const TITLE_IMAGE_OVERRIDES: Array<{ keywords: string[]; image: string }> = [
  {
    keywords: ['kham pha huong vi', 'carpaccio'],
    image: '/assets/images/posts/Post_4.png',
  },
  {
    keywords: ['trai nghiem dich vu', 'khong gian am cung'],
    image: '/assets/images/home/discover3.jpg',
  },
];

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const resolveImageByTitle = (title: string): string | null => {
  const normalizedTitle = normalizeText(title);
  const matchedRule = TITLE_IMAGE_OVERRIDES.find((rule) =>
    rule.keywords.some((keyword) => normalizedTitle.includes(keyword)),
  );

  return matchedRule?.image ?? null;
};

export const getPostCoverImage = (
  post: PostType,
  fallbackIndex?: number,
): string => {
  const titleOverride = resolveImageByTitle(post.title ?? '');
  if (titleOverride) {
    return titleOverride;
  }

  const primaryImage = post.images?.find(
    (image) => typeof image === 'string' && image.trim().length > 0,
  );

  if (primaryImage) {
    return primaryImage;
  }

  const seededIndex =
    typeof fallbackIndex === 'number'
      ? fallbackIndex
      : (post._id || '')
          .split('')
          .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

  return BLOG_FALLBACK_IMAGES[
    Math.abs(seededIndex) % BLOG_FALLBACK_IMAGES.length
  ];
};
