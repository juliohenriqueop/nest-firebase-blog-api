import { IsOptional } from 'class-validator';
import { IsString, IsInt } from 'class-validator';

export class FindPostsInputDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsInt()
  readonly page?: number = 0;
}
