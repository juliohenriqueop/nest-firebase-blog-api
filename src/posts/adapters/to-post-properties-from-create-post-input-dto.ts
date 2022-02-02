import { CreatePostInputDto, PostProperties } from '@modules/posts';

export function toPostPropertiesFromCreatePostInputDto(
  post: CreatePostInputDto,
): PostProperties {
  const postProperties: PostProperties = {
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    authorId: post.authorId,
    content: post.content,
  };

  return postProperties;
}
