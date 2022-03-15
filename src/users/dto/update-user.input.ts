import { IsOptional, IsBoolean } from 'class-validator';
import { IsAlphanumeric, IsEmail, IsUrl, IsPhoneNumber } from 'class-validator';
import { MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserInputDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly disabled?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly emailConfirmed?: boolean;

  @IsOptional()
  @IsAlphanumeric()
  @ApiPropertyOptional()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  readonly email?: string;

  @IsOptional()
  @MinLength(6)
  @ApiPropertyOptional()
  readonly password?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional()
  readonly photoURL?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional()
  readonly phoneNumber?: string;
}
