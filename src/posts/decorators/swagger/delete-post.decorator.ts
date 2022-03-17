import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export function SwaggerDeletePost() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a post' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiNoContentResponse({ description: 'Post deleted' }),
    ApiNotFoundResponse({ description: 'Post not found' }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
