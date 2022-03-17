import { IsOptional } from 'class-validator';
import { IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindPostsInputDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly title?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  readonly page?: number = 0;
}
