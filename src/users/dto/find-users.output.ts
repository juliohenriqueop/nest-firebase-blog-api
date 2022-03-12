import { FindUserOutputDto } from '@modules/users';

export class FindUsersOutputDto {
  readonly nextPage: string;
  readonly users: FindUserOutputDto[];
}
