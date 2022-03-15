import { IsOptional } from 'class-validator';
import { IsEmail, IsPhoneNumber, IsAlphanumeric } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindUsersInputDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  readonly email?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsAlphanumeric()
  @ApiPropertyOptional()
  readonly page?: string;
}
