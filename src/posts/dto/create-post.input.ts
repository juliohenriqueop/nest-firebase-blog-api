import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsString, IsUrl, IsAlphanumeric } from 'class-validator';

export class CreatePostInputDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsOptional()
  @IsUrl()
  readonly thumbnailURL?: string;

  @IsAlphanumeric()
  readonly authorId: string;

  @IsString()
  readonly content: string;
}
