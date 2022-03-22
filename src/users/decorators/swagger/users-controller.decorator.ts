import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

export function SwaggerUsers() {
  return applyDecorators(ApiTags('Users'), ApiBearerAuth('Firebase Auth'));
}
