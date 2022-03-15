import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { FindUserOutputDto } from '@modules/users';

export function SwaggerFindUserById() {
  return applyDecorators(
    ApiOperation({ summary: 'Find user by id' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiOkResponse({ description: 'User found', type: FindUserOutputDto }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
