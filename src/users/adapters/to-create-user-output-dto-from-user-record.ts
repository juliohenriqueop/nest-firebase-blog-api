import { UserRecord } from 'firebase-admin/auth';
import { CreateUserOutputDto } from '@modules/users';
import { toFindUserOutputDtoFromUserRecord } from '@modules/users';

export function toCreateUserOutputDtoFromUserRecord(
  userRecord: UserRecord,
): CreateUserOutputDto {
  return toFindUserOutputDtoFromUserRecord(userRecord);
}
