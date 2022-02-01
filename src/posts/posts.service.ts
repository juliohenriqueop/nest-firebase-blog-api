import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from 'nestjs-fireorm';
import { BaseFirestoreRepository } from 'fireorm';
import { UsersService, UserError } from '@modules/users';
import { Post, Content } from '@modules/posts';
import { PostProperties, PostData } from '@modules/posts';
import { PostError, PostException } from '@modules/posts';
import { toPostDataFromPostAndContent } from '@modules/posts';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: BaseFirestoreRepository<Post>,

    private readonly configService: ConfigService,
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

  async findById(id: string): Promise<PostData> {
    const postFoundById: Post | null = await this.postsRepository.findById(id);

    if (!postFoundById) {
      throw new PostException(PostError.POST_NOT_FOUND, 'post not found');
    }

    const contentFoundById: Content | null =
      await postFoundById.content.findOne();

    if (!contentFoundById) {
      throw new PostException(
        PostError.CONTENT_NOT_FOUND,
        'post content not found',
      );
    }

    return toPostDataFromPostAndContent(postFoundById, contentFoundById);
  }

  async findByTitle(title: string): Promise<PostData> {
    const postFoundByTitle: Post | null = await this.postsRepository
      .whereEqualTo('title', title)
      .findOne();

    if (!postFoundByTitle) {
      throw new PostException(PostError.POST_NOT_FOUND, 'post not found');
    }

    const contentFoundByTitle: Content | null =
      await postFoundByTitle.content.findOne();

    if (!contentFoundByTitle) {
      throw new PostException(
        PostError.CONTENT_NOT_FOUND,
        'post content not found',
      );
    }

    return toPostDataFromPostAndContent(postFoundByTitle, contentFoundByTitle);
  }

  async findAll(page = 0): Promise<PostData[]> {
    const postsPerPageConfig = this.configService.get<string>('POSTS_PER_PAGE');
    const postsPerPage = parseInt(postsPerPageConfig) || 25;
    const currentPage = page * postsPerPage;

    const foundPosts = await this.postsRepository
      .customQuery(async (query) => {
        return query.limit(postsPerPage).offset(currentPage);
      })
      .find();

    return foundPosts.map((post) => toPostDataFromPostAndContent(post));
  }

  async update(id: string, properties: PostProperties): Promise<PostData> {
    const post: Post | null = await this.postsRepository.findById(id);

    if (!post) {
      throw new PostException(PostError.POST_NOT_FOUND, 'post not found');
    }

    let author = null;

    if (properties.authorId) {
      try {
        author = await this.usersService.findById(properties.authorId);
      } catch (userException) {
        throw new PostException(PostError.AUTHOR_NOT_FOUND, 'author not found');
      }
    }

    const updatedPost = await this.postsRepository.update({
      id: id,
      author: {
        id: author?.uid || post.author.id,
        name: author?.displayName || post.author.name,
      },
      title: properties.title || post.title,
      thumbnailURL: properties.thumbnailURL || post.thumbnailURL,
    });

    const currentContent = await post.content.findOne();

    if (properties.content) {
      const content = await post.content.update({
        id: currentContent.id,
        value: properties.content,
      });

      const updatedContent = content as Content;

      return toPostDataFromPostAndContent(updatedPost, updatedContent);
    }

    return toPostDataFromPostAndContent(updatedPost, currentContent);
  }

  async delete(id: string): Promise<void> {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new PostException(PostError.POST_NOT_FOUND, 'post not found');
    }

    return this.postsRepository.delete(id);
  }
}
