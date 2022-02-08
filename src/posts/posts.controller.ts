import { Controller } from '@nestjs/common';
import { Post, Get, Patch, Delete } from '@nestjs/common';
import { Body, Param, Query } from '@nestjs/common';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PostsService, PostError } from '@modules/posts';
import { CreatePostInputDto, CreatePostOutputDto } from '@modules/posts';
import { toPostPropertiesFromCreatePostInputDto } from '@modules/posts';
import { toCreatePostOutputDtoFromPostData } from '@modules/posts';
import { FindPostsInputDto, FindPostOutputDto } from '@modules/posts';
import { toFindPostOutputDtoFromPostData } from '@modules/posts';
import { FindPostsOutputDto } from '@modules/posts';
import { UpdatePostInputDto, UpdatePostOutputDto } from '@modules/posts';
import { toPostPropertiesFromUpdatePostInputDto } from '@modules/posts';
import { toUpdatePostOutputDtoFromPostData } from '@modules/posts';

@Controller({ path: 'posts', version: '1' })
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() post: CreatePostInputDto): Promise<CreatePostOutputDto> {
    try {
      const postProperties = toPostPropertiesFromCreatePostInputDto(post);
      const postData = await this.postsService.create(postProperties);

      return toCreatePostOutputDtoFromPostData(postData);
    } catch (createException) {
      if (createException.type === PostError.AUTHOR_NOT_FOUND) {
        throw new NotFoundException(createException.message);
      }

      throw createException;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<FindPostOutputDto> {
    try {
      const postData = await this.postsService.findById(id);
      return toFindPostOutputDtoFromPostData(postData);
    } catch (findByIdException) {
      if (findByIdException.type === PostError.POST_NOT_FOUND) {
        throw new NotFoundException(findByIdException.message);
      }

      throw findByIdException;
    }
  }

  @Get()
  async find(@Query() findBy: FindPostsInputDto): Promise<FindPostsOutputDto> {
    try {
      const response: FindPostsOutputDto = {
        posts: [],
      };

      if (findBy.title) {
        const postData = await this.postsService.findByTitle(findBy.title);
        response.posts.push(toFindPostOutputDtoFromPostData(postData));

        return response;
      }

      const postsData = await this.postsService.findAll(findBy.page);
      postsData.map((postsData) =>
        response.posts.push(toFindPostOutputDtoFromPostData(postsData)),
      );

      return response;
    } catch (findException) {
      if (findException.type === PostError.POST_NOT_FOUND) {
        throw new NotFoundException(findException.message);
      }

      throw findException;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() properties: UpdatePostInputDto,
  ): Promise<UpdatePostOutputDto> {
    try {
      const postProperties = toPostPropertiesFromUpdatePostInputDto(properties);
      const postData = await this.postsService.update(id, postProperties);

      return toUpdatePostOutputDtoFromPostData(postData);
    } catch (updateException) {
      if (updateException.type === PostError.POST_NOT_FOUND) {
        throw new NotFoundException(updateException.message);
      }

      if (updateException.type === PostError.AUTHOR_NOT_FOUND) {
        throw new NotFoundException(updateException.message);
      }

      throw updateException;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return await this.postsService.delete(id);
    } catch (deletePostException) {
      if (deletePostException.type === PostError.POST_NOT_FOUND) {
        throw new NotFoundException(deletePostException.message);
      }

      throw deletePostException;
    }
  }
}
