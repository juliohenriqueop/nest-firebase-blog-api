import { PostAuthor } from '@modules/posts';
import { ApiResponseProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostOutputDto {
  @ApiResponseProperty()
  readonly id: string;

  @ApiResponseProperty()
  readonly title: string;

  @ApiPropertyOptional()
  readonly thumbnailURL?: string;

  @ApiResponseProperty({ type: PostAuthor })
  readonly author: PostAuthor;

  @ApiPropertyOptional()
  readonly content: string;
}
