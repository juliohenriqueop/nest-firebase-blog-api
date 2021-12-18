import { CreateRequest } from 'firebase-admin/auth';
import { CreateUserInputDto } from '@modules/users';

export function toCreateRequestFromCreateUserInputDto(
  createUserInputDto: CreateUserInputDto,
): CreateRequest {
  return {
    disabled: createUserInputDto.disabled,
    email: createUserInputDto.email,
    emailVerified: createUserInputDto.emailConfirmed,
    displayName: createUserInputDto.name,
    password: createUserInputDto.password,
    photoURL: createUserInputDto.photoURL,
    phoneNumber: createUserInputDto.phoneNumber,
  };
}
