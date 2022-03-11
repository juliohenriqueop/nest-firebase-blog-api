import { PostData, FindPostOutputDto } from '@modules/posts';

export function toFindPostOutputDtoFromPostData(
  post: PostData,
): FindPostOutputDto {
  const findPostOutputDto: FindPostOutputDto = {
    id: post.id,
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    author: {
      id: post.author.id,
      name: post.author.name || 'Guest',
    },
    content: post.content.length > 0 ? post.content : undefined,
  };

  return findPostOutputDto;
}
