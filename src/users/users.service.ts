import { Injectable } from '@nestjs/common';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'nestjs-firebase';
import { UserRecord } from 'firebase-admin/auth';
import { UserError, UserException } from '@modules/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
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
}
