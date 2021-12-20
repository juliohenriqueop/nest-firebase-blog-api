import { Injectable } from '@nestjs/common';
import { InjectRepository } from 'nestjs-fireorm';
import { BaseFirestoreRepository } from 'fireorm';
import { UsersService, UserError } from '@modules/users';
import { Post, PostProperties, PostData } from '@modules/posts';
import { PostError, PostException } from '@modules/posts';
import { toPostDataFromPostAndContent } from '@modules/posts';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: BaseFirestoreRepository<Post>,
  ) {}

  async create(properties: PostProperties): Promise<PostData> {
    try {
      const author = await this.usersService.findById(properties.authorId);

      const createdPost = await this.postsRepository.create({
        title: properties.title,
        thumbnailURL: properties.thumbnailURL,
        author: {
          id: author.uid,
          name: author.displayName,
        },
      });

      const createdContent = await createdPost.content.create({
        value: properties.content,
      });

      return toPostDataFromPostAndContent(createdPost, createdContent);
    } catch (userException) {
      if (userException.type === UserError.NOT_FOUND) {
        throw new PostException(PostError.AUTHOR_NOT_FOUND, 'author not found');
      }

      throw userException;
    }
  }
}
