import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'nestjs-firebase';
import { UserRecord, ListUsersResult } from 'firebase-admin/auth';
import { UpdateRequest, CreateRequest } from 'firebase-admin/auth';
import { UserError, UserException } from '@modules/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,

    private readonly config: ConfigService,
  ) {}

  async create(user: CreateRequest): Promise<UserRecord> {
    try {
      return await this.firebase.auth.createUser(user);
    } catch (firebaseAuthError) {
      if (firebaseAuthError.code === 'auth/email-already-exists') {
        throw new UserException(
          UserError.EMAIL_ALREADY_USED,
          'the informed e-mail is already in use',
        );
      }

      if (firebaseAuthError.code === 'auth/phone-number-already-exists') {
        throw new UserException(
          UserError.PHONE_NUMBER_ALREADY_USED,
          'the informed phone number is already in use',
        );
      }

      throw firebaseAuthError;
    }
  }

  async findById(id: string): Promise<UserRecord> {
    try {
      return await this.firebase.auth.getUser(id);
    } catch (firebaseAuthError) {
      if (firebaseAuthError.code === 'auth/user-not-found') {
        throw new UserException(UserError.NOT_FOUND, 'user not found');
      }

      throw firebaseAuthError;
    }
  }

  async findByEmail(email: string): Promise<UserRecord> {
    try {
      return await this.firebase.auth.getUserByEmail(email);
    } catch (firebaseAuthError) {
      if (firebaseAuthError.code === 'auth/user-not-found') {
        throw new UserException(UserError.NOT_FOUND, 'user not found');
      }

      throw firebaseAuthError;
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserRecord> {
    try {
      return await this.firebase.auth.getUserByPhoneNumber(phoneNumber);
    } catch (firebaseAuthError) {
      if (firebaseAuthError.code === 'auth/user-not-found') {
        throw new UserException(UserError.NOT_FOUND, 'user not found');
      }

      throw firebaseAuthError;
    }
  }

  async findAll(pageToken: string): Promise<ListUsersResult> {
    const usersPerPageConfig = this.config.get<string>('USERS_PER_PAGE');
    const usersPerPage = parseInt(usersPerPageConfig) || 25;

    return await this.firebase.auth.listUsers(usersPerPage, pageToken);
  }

  async update(id: string, properties: UpdateRequest): Promise<UserRecord> {
    try {
      return await this.firebase.auth.updateUser(id, properties);
    } catch (firebaseAuthError) {
      if (firebaseAuthError.code === 'auth/user-not-found') {
        throw new UserException(UserError.NOT_FOUND, 'user not found');
      }

      if (firebaseAuthError.code === 'auth/email-already-exists') {
        throw new UserException(
          UserError.EMAIL_ALREADY_USED,
          'the informed e-mail is already in use',
        );
      }

      if (firebaseAuthError.code === 'auth/phone-number-already-exists') {
        throw new UserException(
          UserError.PHONE_NUMBER_ALREADY_USED,
          'the informed phone number is already in use',
        );
      }

      throw firebaseAuthError;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.firebase.auth.deleteUser(id);
    } catch (firebaseAuthError) {
      if (firebaseAuthError.code === 'auth/user-not-found') {
        throw new UserException(UserError.NOT_FOUND, 'user not found');
      }

      throw firebaseAuthError;
    }
  }
}
