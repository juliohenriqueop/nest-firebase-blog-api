import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsString, IsUrl, IsAlphanumeric } from 'class-validator';

export class UpdatePostInputDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly title?: string;

  @IsOptional()
  @IsUrl()
  readonly thumbnailURL?: string;

  @IsOptional()
  @IsAlphanumeric()
  readonly authorId?: string;

  @IsOptional()
  @IsString()
  readonly content?: string;
}
