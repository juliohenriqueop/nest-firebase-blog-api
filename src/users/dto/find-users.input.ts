import { IsOptional } from 'class-validator';
import { IsEmail, IsPhoneNumber, IsAlphanumeric } from 'class-validator';

export class FindUsersInputDto {
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsAlphanumeric()
  readonly page?: string;
}
