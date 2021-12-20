import { Post, Content, PostData } from '@modules/posts';

export function toPostDataFromPostAndContent(
  post: Post,
  content?: Content,
): PostData {
  const postData: PostData = {
    ...post,
    content: content?.value || '',
  };

  return postData;
}
