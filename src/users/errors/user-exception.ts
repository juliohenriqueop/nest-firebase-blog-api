import { UserError } from '@modules/users';

export class UserException extends Error {
  readonly type: UserError;

  constructor(type: UserError, message: string) {
    super(message);

    this.name = 'UserException';
    this.type = type;
  }
}
