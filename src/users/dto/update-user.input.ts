import { IsOptional, IsBoolean } from 'class-validator';
import { IsAlphanumeric, IsEmail, IsUrl, IsPhoneNumber } from 'class-validator';
import { MinLength } from 'class-validator';

export class UpdateUserInputDto {
  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly emailConfirmed?: boolean;

  @IsOptional()
  @IsAlphanumeric()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @MinLength(6)
  readonly password?: string;

  @IsOptional()
  @IsUrl()
  readonly photoURL?: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string;
}
