import { PostError } from '@modules/posts';

export class PostException extends Error {
  readonly type: PostError;

  constructor(type: PostError, message: string) {
    super(message);

    this.name = 'PostException';
    this.type = type;
  }
}
