import { AppError } from '@modules/app';

export class AppException extends Error {
  readonly type: AppError;

  constructor(type: AppError, message: string) {
    super(message.concat('\n'));

    this.name = 'AppException';
    this.type = type;
  }
}
