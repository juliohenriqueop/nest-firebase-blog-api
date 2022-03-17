import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { FindPostOutputDto } from '@modules/posts';

export function SwaggerFindPostById() {
  return applyDecorators(
    ApiOperation({ summary: 'Find post by id' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiOkResponse({ description: 'Post found', type: FindPostOutputDto }),
    ApiNotFoundResponse({ description: 'Post not found' }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
