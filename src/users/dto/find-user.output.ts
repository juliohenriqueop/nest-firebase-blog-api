export class FindUserOutputDto {
  readonly id: string;
  readonly disabled: boolean;
  readonly emailConfirmed: boolean;
  readonly name?: string;
  readonly email?: string;
  readonly photoURL?: string;
  readonly phoneNumber?: string;
  readonly permissions?: string[];
}
