import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsString, IsUrl, IsAlphanumeric } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostInputDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly title: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional()
  readonly thumbnailURL?: string;

  @IsAlphanumeric()
  @ApiProperty()
  readonly authorId: string;

  @IsString()
  @ApiProperty()
  readonly content: string;
}
