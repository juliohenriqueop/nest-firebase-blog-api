import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function SwaggerUsers() {
  return applyDecorators(ApiTags('Users'));
}
