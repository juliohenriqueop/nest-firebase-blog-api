import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '@modules/posts';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from '@modules/posts';
import { CreatePostInputDto, CreatePostOutputDto } from '@modules/posts';
import { PostException, PostError } from '@modules/posts';

describe('PostsController', () => {
  let sutPostsController: PostsController;

  const promiseReminder = 'Should await for the promise?';

  const post = {
    id: 'POSTS_ID',
    title: 'POST_TITLE',
    thumbnailURL: 'THUMBNAIL_URL',
    authorId: 'POSTS_ID',
    content: 'POSTS_CONTENT',
  };

  const author = {
    id: 'AUTHOR_ID',
    name: 'AUTHOR_NAME',
  };

  const createPostInputDto: CreatePostInputDto = {
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    authorId: post.authorId,
    content: post.content,
  };

  const createPostOutputDto: CreatePostOutputDto = {
    id: post.id,
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    author: author,
    content: post.content,
  };

  const mockPostsService = {
    create: jest.fn().mockResolvedValue(createPostOutputDto),
  };

  const untreatedException = new Error(promiseReminder);
  untreatedException.name = 'UntreatedExceptionTest';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
      controllers: [PostsController],
    })
      .overrideProvider(PostsService)
      .useValue(mockPostsService)
      .compile();

    sutPostsController = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(sutPostsController).toBeDefined();
  });

  describe('create', () => {
    it('should create posts', async () => {
      const post = await sutPostsController.create(createPostInputDto);

      expect(mockPostsService.create).toHaveBeenCalledTimes(1);
      expect(mockPostsService.create).toHaveBeenCalledWith(createPostInputDto);
      expect(post).toStrictEqual(createPostOutputDto);
    });

    it('should throw NotFoundException when the author is not found', async () => {
      const authorNotFoundException = new PostException(
        PostError.AUTHOR_NOT_FOUND,
        promiseReminder,
      );

      mockPostsService.create.mockRejectedValueOnce(authorNotFoundException);

      const createPostPromise = sutPostsController.create(createPostInputDto);

      await expect(createPostPromise).rejects.toStrictEqual(
        new NotFoundException(authorNotFoundException.message),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockPostsService.create.mockRejectedValueOnce(untreatedException);

      const createPostPromise = sutPostsController.create(createPostInputDto);
      await expect(createPostPromise).rejects.toStrictEqual(untreatedException);
    });
  });
});
