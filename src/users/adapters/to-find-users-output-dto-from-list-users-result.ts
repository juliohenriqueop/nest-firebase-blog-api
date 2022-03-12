import { ListUsersResult, UserRecord } from 'firebase-admin/auth';
import { FindUsersOutputDto } from '@modules/users';
import { toFindUserOutputDtoFromUserRecord } from '@modules/users';

export function toFindUsersOutputDtoFromListUsersResult(
  listUsersResult: ListUsersResult,
): FindUsersOutputDto {
  return {
    nextPage: listUsersResult.pageToken,
    users: listUsersResult.users.map((userRecord: UserRecord) => {
      return toFindUserOutputDtoFromUserRecord(userRecord);
    }),
  };
}
