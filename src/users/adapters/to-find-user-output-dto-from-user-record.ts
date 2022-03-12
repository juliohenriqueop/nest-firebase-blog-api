import { UserRecord } from 'firebase-admin/auth';
import { FindUserOutputDto } from '@modules/users';

export function toFindUserOutputDtoFromUserRecord(
  userRecord: UserRecord,
): FindUserOutputDto {
  return {
    id: userRecord.uid,
    disabled: userRecord.disabled,
    emailConfirmed: userRecord.emailVerified,
    name: userRecord.displayName || 'Guest',
    email: userRecord.email,
    photoURL: userRecord.photoURL,
    phoneNumber: userRecord.phoneNumber,
    permissions: userRecord.customClaims?.permissions || [],
  };
}
