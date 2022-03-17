import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function SwaggerPosts() {
  return applyDecorators(ApiTags('Posts'));
}
