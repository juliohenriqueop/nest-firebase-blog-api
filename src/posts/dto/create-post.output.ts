import { PostAuthor } from '@modules/posts';

export class CreatePostOutputDto {
  readonly id: string;
  readonly title: string;
  readonly thumbnailURL?: string;
  readonly author: PostAuthor;
  readonly content: string;
}
