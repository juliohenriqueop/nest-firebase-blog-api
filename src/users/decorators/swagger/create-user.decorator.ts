import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiConflictResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { CreateUserOutputDto } from '@modules/users';

export function SwaggerCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a user' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiBadRequestResponse({ description: 'Invalid user properties' }),
    ApiCreatedResponse({
      description: 'User created',
      type: CreateUserOutputDto,
    }),
    ApiConflictResponse({
      description: 'Email or phone number is already in use',
    }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
