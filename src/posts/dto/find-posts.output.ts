import { ApiResponseProperty } from '@nestjs/swagger';
import { FindPostOutputDto } from '@modules/posts';

export class FindPostsOutputDto {
  @ApiResponseProperty({ type: [FindPostOutputDto] })
  readonly posts: FindPostOutputDto[];
}
