import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { CreatePostOutputDto } from '@modules/posts';

export function SwaggerUpdatePost() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a post' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiBadRequestResponse({ description: 'Invalid post properties' }),
    ApiOkResponse({
      description: 'Post updated',
      type: CreatePostOutputDto,
    }),
    ApiNotFoundResponse({ description: 'Post not found' }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
