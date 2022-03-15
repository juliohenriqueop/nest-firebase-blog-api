import { ApiResponseProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindUserOutputDto {
  @ApiResponseProperty()
  readonly id: string;

  @ApiResponseProperty()
  readonly disabled: boolean;

  @ApiResponseProperty()
  readonly emailConfirmed: boolean;

  @ApiPropertyOptional()
  readonly name?: string;

  @ApiPropertyOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  readonly photoURL?: string;

  @ApiPropertyOptional()
  readonly phoneNumber?: string;

  @ApiResponseProperty()
  readonly permissions: string[];
}
