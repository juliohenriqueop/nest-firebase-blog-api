import { UpdatePostInputDto, PostProperties } from '@modules/posts';

export function toPostPropertiesFromUpdatePostInputDto(
  post: UpdatePostInputDto,
): PostProperties {
  const postProperties: PostProperties = {
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    authorId: post.authorId,
    content: post.content,
  };

  return postProperties;
}
