import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

export function SwaggerPosts() {
  return applyDecorators(ApiTags('Posts'), ApiBearerAuth('Firebase Auth'));
}
