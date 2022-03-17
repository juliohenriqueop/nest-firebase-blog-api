import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { FindPostsOutputDto } from '@modules/posts';

export function SwaggerFindPosts() {
  return applyDecorators(
    ApiOperation({ summary: 'Find posts' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiBadRequestResponse({ description: 'Invalid parameters' }),
    ApiOkResponse({ description: 'Posts found', type: FindPostsOutputDto }),
    ApiNotFoundResponse({ description: 'Post not found' }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
