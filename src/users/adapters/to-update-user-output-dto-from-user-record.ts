import { UserRecord } from 'firebase-admin/auth';
import { UpdateUserOutputDto } from '@modules/users';
import { toFindUserOutputDtoFromUserRecord } from '@modules/users';

export function toUpdateUserOutputDtoFromUserRecord(
  userRecord: UserRecord,
): UpdateUserOutputDto {
  return toFindUserOutputDtoFromUserRecord(userRecord);
}
