import { Collection, SubCollection, ISubCollection } from 'fireorm';
import { PostAuthor, Content } from '@modules/posts';

@Collection()
export class Post {
  readonly id: string;
  readonly title: string;
  readonly thumbnailURL: string;
  readonly author: PostAuthor;

  @SubCollection(Content, 'Content')
  readonly content?: ISubCollection<Content>;
}
