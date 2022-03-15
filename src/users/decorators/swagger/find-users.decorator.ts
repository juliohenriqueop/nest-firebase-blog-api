import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { FindUsersOutputDto } from '@modules/users';

export function SwaggerFindUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Find users' }),
    ApiUnauthorizedResponse({ description: 'Authentication is required' }),
    ApiForbiddenResponse({
      description:
        'The authenticated user account was not found or is disabled',
    }),
    ApiBadRequestResponse({ description: 'Invalid parameters' }),
    ApiOkResponse({ description: 'Users found', type: FindUsersOutputDto }),
    ApiNotFoundResponse({ status: 404, description: 'User not found' }),
    ApiInternalServerErrorResponse({ description: 'Unexpected error' }),
  );
}
