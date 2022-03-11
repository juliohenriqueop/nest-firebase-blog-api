import { Controller } from '@nestjs/common';
import { Post, Get } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PostsService, PostError } from '@modules/posts';
import { CreatePostInputDto, CreatePostOutputDto } from '@modules/posts';
import { toPostPropertiesFromCreatePostInputDto } from '@modules/posts';
import { toCreatePostOutputDtoFromPostData } from '@modules/posts';
import { FindPostOutputDto } from '@modules/posts';
import { toFindPostOutputDtoFromPostData } from '@modules/posts';

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
}
