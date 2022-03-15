import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export function SwaggerDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a user' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiNoContentResponse({ description: 'User deleted' }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
