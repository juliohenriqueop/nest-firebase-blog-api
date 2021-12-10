import { AuthError } from '@modules/auth';

export class AuthException extends Error {
  readonly type: AuthError;

  constructor(type: AuthError, message: string) {
    super(message);

    this.name = 'AuthException';
    this.type = type;
  }
}
