import { Post } from '@modules/posts';

export type PostData = Omit<Post, 'content'> & {
  content: string;
};
