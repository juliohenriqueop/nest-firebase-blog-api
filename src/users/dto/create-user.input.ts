import { IsOptional, IsBoolean } from 'class-validator';
import { IsAlphanumeric, IsEmail, IsUrl, IsPhoneNumber } from 'class-validator';
import { MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserInputDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly disabled?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly emailConfirmed?: boolean;

  @IsAlphanumeric()
  @ApiProperty()
  readonly name: string;

  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @MinLength(6)
  @ApiProperty()
  readonly password: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional()
  readonly photoURL?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional()
  readonly phoneNumber?: string;
}
