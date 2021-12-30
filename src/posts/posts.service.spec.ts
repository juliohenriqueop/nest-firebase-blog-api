import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { FireormModule } from 'nestjs-fireorm';
import { getRepositoryToken } from 'nestjs-fireorm';
import { UsersModule, UsersService } from '@modules/users';
import { UserError, UserException } from '@modules/users';
import { PostError, PostException } from '@modules/posts';
import { PostsService } from '@modules/posts';
import { PostProperties, PostData } from '@modules/posts';
import { Post, Content } from '@modules/posts';

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

  const otherPost: Omit<Post, 'content'> = {
    id: 'OTHER_POST_ID',
    title: 'OTHER_POST_TITLE',
    thumbnailURL: 'OTHER_POST_THUMBNAIL',
    author: {
      id: 'OTHER_AUTHOR_ID',
      name: 'OTHER_AUTHOR_NAME',
    },
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
      findOne: jest.fn().mockResolvedValue(postContent),
    },
  };

  const allPostsOutput: Post[] = [post, otherPost];

  const customQuery = {
    limit: jest.fn().mockReturnValue({
      offset: jest.fn(),
    }),
  };

  const mockUsersService = {
    findById: jest.fn().mockResolvedValue(authorRecord),
  };

  const mockPostsRepository = {
    create: jest.fn().mockResolvedValue(postRepositoryOutput),
    findById: jest.fn().mockResolvedValue(postRepositoryOutput),
    whereEqualTo: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(postRepositoryOutput),
    }),
    customQuery: jest.fn().mockImplementation((query) => {
      query(customQuery);

      return {
        find: jest.fn().mockResolvedValue(allPostsOutput),
      };
    }),
  };

  const untreatedException = new Error(promiseReminder);
  untreatedException.name = 'UntreatedExceptionTest';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FireormModule.forFeature([Post]), ConfigModule, UsersModule],
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

  describe('findById', () => {
    it('should find a post', async () => {
      const foundPost = await sutPostsService.findById(post.id);

      expect(mockPostsRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findById).toHaveBeenCalledWith(post.id);
      expect(foundPost).toStrictEqual(postData);
    });

    it('should find the post content', async () => {
      await sutPostsService.findById(post.id);

      const mockFoundPost = await mockPostsRepository.findById(post.id);
      const mockFoundContent = mockFoundPost.content;

      expect(mockFoundContent.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a POST_NOT_FOUND error when the post is not found', async () => {
      mockPostsRepository.findById.mockResolvedValueOnce(null);

      const findByIdPromise = sutPostsService.findById(post.id);

      await expect(findByIdPromise).rejects.toThrowError(
        expect.objectContaining({
          name: PostException.name,
          type: PostError.POST_NOT_FOUND,
        }),
      );
    });

    it('should throw a CONTENT_NOT_FOUND error when the post content is not found', async () => {
      postRepositoryOutput.content.findOne.mockResolvedValueOnce(null);

      const findByIdPromise = sutPostsService.findById(post.id);

      await expect(findByIdPromise).rejects.toThrowError(
        expect.objectContaining({
          name: PostException.name,
          type: PostError.CONTENT_NOT_FOUND,
        }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockPostsRepository.findById.mockRejectedValueOnce(untreatedException);

      const findByIdPromise = sutPostsService.findById(post.id);
      await expect(findByIdPromise).rejects.toStrictEqual(untreatedException);
    });
  });

  describe('findByTitle', () => {
    it('should find posts', async () => {
      const foundPost = await sutPostsService.findByTitle(post.title);

      const whereEqualToReturn = mockPostsRepository.whereEqualTo
        .getMockImplementation()
        .call(this);

      expect(mockPostsRepository.whereEqualTo).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.whereEqualTo).toHaveBeenCalledWith(
        'title',
        post.title,
      );
      expect(whereEqualToReturn.findOne).toHaveBeenCalledTimes(1);
      expect(foundPost).toStrictEqual(postData);
    });

    it('should find the post content', async () => {
      await sutPostsService.findByTitle(post.title);

      const mockFoundPost = await mockPostsRepository
        .whereEqualTo('title', post.title)
        .findOne();

      const mockFoundContent = mockFoundPost.content;

      expect(mockFoundContent.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw a POST_NOT_FOUND error when the post is not found', async () => {
      const whereEqualToReturn = mockPostsRepository.whereEqualTo
        .getMockImplementation()
        .call(this);

      whereEqualToReturn.findOne.mockResolvedValueOnce(null);

      const findByTitlePromise = sutPostsService.findByTitle(post.title);

      await expect(findByTitlePromise).rejects.toThrowError(
        expect.objectContaining({
          name: PostException.name,
          type: PostError.POST_NOT_FOUND,
        }),
      );
    });

    it('should throw a CONTENT_NOT_FOUND error when the post content is not found', async () => {
      postRepositoryOutput.content.findOne.mockResolvedValueOnce(null);

      const findByTitlePromise = sutPostsService.findByTitle(post.title);

      await expect(findByTitlePromise).rejects.toThrowError(
        expect.objectContaining({
          name: PostException.name,
          type: PostError.CONTENT_NOT_FOUND,
        }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      const whereEqualToReturn = mockPostsRepository.whereEqualTo
        .getMockImplementation()
        .call(this);

      whereEqualToReturn.findOne.mockRejectedValueOnce(untreatedException);

      const findByTitlePromise = sutPostsService.findByTitle(post.title);

      await expect(findByTitlePromise).rejects.toStrictEqual(
        untreatedException,
      );
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const currentPage = Math.ceil(Math.random() * 100);

      const posts = await sutPostsService.findAll(currentPage);

      const queryLimitReturn = customQuery.limit
        .getMockImplementation()
        .call(this);

      expect(mockPostsRepository.customQuery).toHaveBeenCalledTimes(1);
      expect(customQuery.limit).toHaveBeenCalledTimes(1);
      expect(queryLimitReturn.offset).toHaveBeenCalledTimes(1);
      expect(posts).toMatchObject(allPostsOutput);
    });

    it('should rethrow untreated exceptions', async () => {
      mockPostsRepository.customQuery.mockImplementationOnce(() => {
        throw untreatedException;
      });

      const findAllPromise = sutPostsService.findAll();
      await expect(findAllPromise).rejects.toStrictEqual(untreatedException);
    });
  });
});
