import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiConflictResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { UpdateUserOutputDto } from '@modules/users';

export function SwaggerUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiBadRequestResponse({ description: 'Invalid user properties' }),
    ApiOkResponse({ description: 'User updated', type: UpdateUserOutputDto }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiConflictResponse({
      description: 'Email or phone number is already in use',
    }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
