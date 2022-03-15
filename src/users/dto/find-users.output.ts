import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponseProperty } from '@nestjs/swagger';
import { FindUserOutputDto } from '@modules/users';

export class FindUsersOutputDto {
  @ApiPropertyOptional()
  readonly nextPage: string;

  @ApiResponseProperty({ type: [FindUserOutputDto] })
  readonly users: FindUserOutputDto[];
}
