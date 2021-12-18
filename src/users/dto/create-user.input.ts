import { IsOptional, IsBoolean } from 'class-validator';
import { IsAlphanumeric, IsEmail, IsUrl, IsPhoneNumber } from 'class-validator';
import { MinLength } from 'class-validator';

export class CreateUserInputDto {
  @IsOptional()
  @IsBoolean()
  readonly disabled?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly emailConfirmed?: boolean;

  @IsAlphanumeric()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsUrl()
  readonly photoURL?: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string;
}
