import { ApiResponseProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostAuthor {
  @ApiResponseProperty()
  readonly id: string;

  @ApiPropertyOptional()
  readonly name: string;
}
