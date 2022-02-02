import { PostData, CreatePostOutputDto } from '@modules/posts';

export function toCreatePostOutputDtoFromPostData(
  post: PostData,
): CreatePostOutputDto {
  const postData: PostData = {
    id: post.id,
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    author: {
      id: post.author.id,
      name: post.author.name || 'Guest',
    },
    content: post.content,
  };

  return postData;
}
