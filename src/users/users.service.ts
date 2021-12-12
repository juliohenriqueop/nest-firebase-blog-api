import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'nestjs-firebase';
import { UserRecord, ListUsersResult } from 'firebase-admin/auth';
import { UserError, UserException } from '@modules/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,

    private readonly config: ConfigService,
  ) {}

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
}
