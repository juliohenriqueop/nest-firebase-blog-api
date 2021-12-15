import { UpdateRequest } from 'firebase-admin/auth';
import { UpdateUserInputDto } from '@modules/users';

export function toUpdateRequestFromUpdateUserInputDto(
  other: UpdateUserInputDto,
): UpdateRequest {
  return {
    disabled: other?.disabled,
    emailVerified: other?.emailConfirmed,
    displayName: other?.name,
    email: other?.email,
    password: other?.password,
    photoURL: other?.photoURL,
    phoneNumber: other?.phoneNumber,
  };
}
