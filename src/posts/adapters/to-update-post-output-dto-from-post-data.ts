import { UpdatePostOutputDto, PostData } from '@modules/posts';

export function toUpdatePostOutputDtoFromPostData(
  post: PostData,
): UpdatePostOutputDto {
  const updatePostOutputDto: UpdatePostOutputDto = {
    id: post.id,
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    author: {
      id: post.author.id,
      name: post.author.name || 'Guest',
    },
    content: post.content,
  };

  return updatePostOutputDto;
}
