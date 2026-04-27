import React from 'react';
import { PostType } from '../../../types/PostType';
import { getPostCoverImage } from './postCoverImage';
import ArticleCard from '../homepage/post/PostComponent';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const normalizedPost: PostType =
    post.images?.length > 0
      ? post
      : {
          ...post,
          images: [getPostCoverImage(post)],
        };

  return <ArticleCard article={normalizedPost} />;
};

export default Post;
