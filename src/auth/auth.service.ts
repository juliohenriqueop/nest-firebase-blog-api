import { Injectable } from '@nestjs/common';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'nestjs-firebase';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthException, AuthError } from '@modules/auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
  ) {}

  async validateBearerToken(token: string): Promise<DecodedIdToken> {
    try {
      return await this.firebase.auth.verifyIdToken(token, true);
    } catch (firebaseAuthError) {
      if (firebaseAuthError.code === 'auth/user-disabled') {
        throw new AuthException(
          AuthError.USER_DISABLED,
          'the authenticated user is disabled',
        );
      }

      if (firebaseAuthError.code === 'auth/user-not-found') {
        throw new AuthException(
          AuthError.USER_NOT_FOUND,
          'the authenticated user is not found',
        );
      }

      if (firebaseAuthError.code === 'auth/id-token-revoked') {
        throw new AuthException(
          AuthError.TOKEN_REVOKED,
          'the informed token was revoked',
        );
      }

      if (firebaseAuthError.code === 'auth/id-token-expired') {
        throw new AuthException(
          AuthError.TOKEN_EXPIRED,
          'the informed token was expired',
        );
      }

      if (firebaseAuthError.code === 'auth/argument-error') {
        throw new AuthException(
          AuthError.TOKEN_INVALID,
          'the informed token is invalid',
        );
      }

      throw firebaseAuthError;
    }
  }
}
