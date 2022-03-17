import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsString, IsUrl, IsAlphanumeric } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostInputDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  readonly title?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional()
  readonly thumbnailURL?: string;

  @IsOptional()
  @IsAlphanumeric()
  @ApiPropertyOptional()
  readonly authorId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly content?: string;
}
