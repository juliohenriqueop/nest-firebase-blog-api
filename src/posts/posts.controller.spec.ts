import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '@modules/posts';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from '@modules/posts';
import { CreatePostInputDto, CreatePostOutputDto } from '@modules/posts';
import { FindPostOutputDto, FindPostsOutputDto } from '@modules/posts';
import { UpdatePostInputDto, UpdatePostOutputDto } from '@modules/posts';
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

  const otherPost = {
    id: 'OTHER_POSTS_ID',
    title: 'OTHER_POST_TITLE',
    thumbnailURL: 'OTHER_THUMBNAIL_URL',
    authorId: 'OTHER_POSTS_ID',
    content: 'OTHER_POSTS_CONTENT',
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

  const otherPostOutputDto: FindPostOutputDto = {
    id: otherPost.id,
    title: otherPost.title,
    thumbnailURL: otherPost.thumbnailURL,
    author: author,
    content: otherPost.content,
  };

  const allPosts = [createPostOutputDto, otherPostOutputDto];

  const findPostOutputDto: FindPostOutputDto = createPostOutputDto;

  const findPostByTitleOutputDto: FindPostsOutputDto = {
    posts: [createPostOutputDto],
  };

  const findAllPostsOutputDto: FindPostsOutputDto = {
    posts: allPosts,
  };

  const postsPage = Number.MAX_SAFE_INTEGER;

  const updatePostInputDto: UpdatePostInputDto = createPostInputDto;
  const updatePostOutputDto: UpdatePostOutputDto = createPostOutputDto;

  const mockPostsService = {
    create: jest.fn().mockResolvedValue(createPostOutputDto),
    findById: jest.fn().mockResolvedValue(findPostOutputDto),
    findByTitle: jest.fn().mockResolvedValue(findPostOutputDto),
    findAll: jest.fn().mockResolvedValue(allPosts),
    update: jest.fn().mockResolvedValue(updatePostOutputDto),
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

  describe('findById', () => {
    it('should find posts', async () => {
      const postFoundById = await sutPostsController.findById(post.id);

      expect(mockPostsService.findById).toHaveBeenCalledTimes(1);
      expect(mockPostsService.findById).toHaveBeenCalledWith(post.id);
      expect(postFoundById).toStrictEqual(findPostOutputDto);
    });

    it('should throw NotFoundException when the post is not found', async () => {
      const postNotFoundException = new PostException(
        PostError.POST_NOT_FOUND,
        promiseReminder,
      );

      mockPostsService.findById.mockRejectedValueOnce(postNotFoundException);

      const findByIdPromise = sutPostsController.findById(post.id);

      await expect(findByIdPromise).rejects.toStrictEqual(
        new NotFoundException(postNotFoundException.message),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockPostsService.findById.mockRejectedValueOnce(untreatedException);

      const findByIdPromise = sutPostsController.findById(post.id);
      await expect(findByIdPromise).rejects.toStrictEqual(untreatedException);
    });
  });

  describe('find', () => {
    describe('by title', () => {
      it('should find posts', async () => {
        const createdPost = await sutPostsController.find({
          title: post.title,
        });

        expect(mockPostsService.findByTitle).toHaveBeenCalledTimes(1);
        expect(mockPostsService.findByTitle).toHaveBeenCalledWith(post.title);
        expect(createdPost).toStrictEqual(findPostByTitleOutputDto);
      });

      it('should throw NotFoundException when the post is not found', async () => {
        const postNotFoundException = new PostException(
          PostError.POST_NOT_FOUND,
          promiseReminder,
        );

        mockPostsService.findByTitle.mockRejectedValueOnce(
          postNotFoundException,
        );

        const findByTitlePromise = sutPostsController.find({
          title: post.title,
        });

        await expect(findByTitlePromise).rejects.toStrictEqual(
          new NotFoundException(postNotFoundException.message),
        );
      });

      it('should rethrow untreated exceptions', async () => {
        mockPostsService.findByTitle.mockRejectedValueOnce(untreatedException);

        const findByTitlePromise = sutPostsController.find({
          title: post.title,
        });

        await expect(findByTitlePromise).rejects.toStrictEqual(
          untreatedException,
        );
      });
    });

    describe('All', () => {
      it('should find all posts', async () => {
        const posts = await sutPostsController.find({ page: postsPage });

        expect(mockPostsService.findAll).toHaveBeenCalledTimes(1);
        expect(mockPostsService.findAll).toHaveBeenCalledWith(postsPage);
        expect(posts).toStrictEqual(findAllPostsOutputDto);
      });

      it('should rethrow untreated exceptions', async () => {
        mockPostsService.findAll.mockRejectedValueOnce(untreatedException);

        const findAllPromise = sutPostsController.find({ page: postsPage });
        await expect(findAllPromise).rejects.toStrictEqual(untreatedException);
      });
    });
  });

  describe('update', () => {
    it('should update posts', async () => {
      const updatedPost = await sutPostsController.update(
        post.id,
        updatePostInputDto,
      );

      expect(mockPostsService.update).toHaveReturnedTimes(1);
      expect(mockPostsService.update).toHaveBeenCalledWith(
        post.id,
        updatePostInputDto,
      );
      expect(updatedPost).toStrictEqual(updatePostOutputDto);
    });

    it('should throw NotFoundException when the post is not found', async () => {
      const postNotFoundException = new PostException(
        PostError.POST_NOT_FOUND,
        promiseReminder,
      );

      mockPostsService.update.mockRejectedValueOnce(postNotFoundException);

      const updatePostPromise = sutPostsController.update(
        post.id,
        updatePostInputDto,
      );

      await expect(updatePostPromise).rejects.toStrictEqual(
        new NotFoundException(postNotFoundException.message),
      );
    });

    it('should throw NotFoundException when the author is not found', async () => {
      const authorNotFoundException = new PostException(
        PostError.AUTHOR_NOT_FOUND,
        promiseReminder,
      );

      mockPostsService.update.mockRejectedValueOnce(authorNotFoundException);

      const updatePostPromise = sutPostsController.update(
        post.id,
        updatePostInputDto,
      );

      await expect(updatePostPromise).rejects.toStrictEqual(
        new NotFoundException(authorNotFoundException.message),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockPostsService.update.mockRejectedValueOnce(untreatedException);

      const updatePostPromise = sutPostsController.update(
        post.id,
        updatePostInputDto,
      );

      await expect(updatePostPromise).rejects.toStrictEqual(untreatedException);
    });
  });
});
