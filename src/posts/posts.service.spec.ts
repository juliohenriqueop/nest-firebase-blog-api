import { Test, TestingModule } from '@nestjs/testing';
import { FireormModule } from 'nestjs-fireorm';
import { getRepositoryToken } from 'nestjs-fireorm';
import { UsersModule, UsersService } from '@modules/users';
import { UserError, UserException } from '@modules/users';
import { PostError, PostException } from '@modules/posts';
import { PostsService, Post, PostProperties, PostData } from '@modules/posts';
import { Content } from '@modules/posts';

describe('PostsService', () => {
  let sutPostsService: PostsService;

  const promiseReminder = 'Should await for the promise?';

  const author = {
    id: 'AUTHOR_ID',
    name: 'AUTHOR_NAME',
  };

  const authorRecord = {
    uid: author.id,
    displayName: author.name,
  };

  const post: Omit<Post, 'content'> = {
    id: 'POST_ID',
    title: 'POST_TITLE',
    thumbnailURL: 'THUMBNAIL_URL',
    author: author,
  };

  const postContent: Content = {
    id: 'CONTENT_ID',
    value: 'POST_CONTENT',
  };

  const postProperties: PostProperties = {
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    authorId: author.id,
    content: postContent.value,
  };

  const postData: PostData = {
    id: post.id,
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    author: author,
    content: postContent.value,
  };

  const createPostRequest: Omit<Post, 'id'> = {
    title: 'POST_TITLE',
    thumbnailURL: 'THUMBNAIL_URL',
    author: author,
  };

  const postRepositoryOutput = {
    id: post.id,
    title: 'POST_TITLE',
    thumbnailURL: 'THUMBNAIL_URL',
    author: author,
    content: {
      create: jest.fn().mockResolvedValue(postContent),
    },
  };

  const mockUsersService = {
    findById: jest.fn().mockResolvedValue(authorRecord),
  };

  const mockPostsRepository = {
    create: jest.fn().mockResolvedValue(postRepositoryOutput),
  };

  const untreatedException = new Error(promiseReminder);
  untreatedException.name = 'UntreatedExceptionTest';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FireormModule.forFeature([Post]), UsersModule],
      providers: [PostsService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(getRepositoryToken(Post))
      .useValue(mockPostsRepository)
      .compile();

    sutPostsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(sutPostsService).toBeDefined();
  });

  describe('create', () => {
    it('should create the post', async () => {
      const createdPost = await sutPostsService.create(postProperties);

      expect(mockPostsRepository.create).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.create).toHaveBeenCalledWith(
        createPostRequest,
      );
      expect(createdPost).toStrictEqual(postData);
    });

    it('should create the post content', async () => {
      await sutPostsService.create(postProperties);

      const mockCreatedPost = await mockPostsRepository.create(post);
      const mockCreatedContent = mockCreatedPost.content;

      expect(mockCreatedContent.create).toHaveBeenCalledTimes(1);
      expect(mockCreatedContent.create).toHaveBeenCalledWith({
        value: postContent.value,
      });
    });

    it('should use an existing user as author', async () => {
      await sutPostsService.create(postProperties);

      expect(mockUsersService.findById).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findById).toHaveBeenCalledWith(author.id);
    });

    it('should throw an AUTHOR_NOT_FOUND error when the author is not found', async () => {
      mockUsersService.findById.mockImplementationOnce(async () => {
        throw new UserException(UserError.NOT_FOUND, promiseReminder);
      });

      const createPostPromise = sutPostsService.create(postProperties);

      await expect(createPostPromise).rejects.toThrowError(
        expect.objectContaining({
          name: PostException.name,
          type: PostError.AUTHOR_NOT_FOUND,
        }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockPostsRepository.create.mockRejectedValueOnce(untreatedException);

      const createPostPromise = sutPostsService.create(postProperties);
      await expect(createPostPromise).rejects.toStrictEqual(untreatedException);
    });
  });
});
