import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseModule, FirebaseConstants } from 'nestjs-firebase';
import { FirebaseAuthError } from 'firebase-admin/lib/utils/error';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthService } from '@modules/auth';
import { AuthError } from '@modules/auth';

describe('AuthService', () => {
  let sutAuthService: AuthService;

  const token = 'USER_ID_TOKEN';
  const promiseReminder = 'Should await for the promise?';
  const currentTimeInSeconds = new Date().getTime() / 1000;

  const decodedToken: DecodedIdToken = {
    aud: 'TOKEN_AUDIENCE',
    auth_time: currentTimeInSeconds,
    exp: 0,
    firebase: {
      identities: {},
      sign_in_provider: 'FIREBASE_SIGN_IN_PROVIDER',
      sign_in_second_factor: 'FIREBASE_SIGN_IN_SECOND_FACTOR',
      second_factor_identifier: 'FIREBASE_SECOND_FACTOR_IDENTIFIER',
      tenant: 'FIREBASE_TENANT',
    },
    iat: currentTimeInSeconds,
    iss: 'TOKEN_ISSUER',
    sub: 'TOKEN_SUBJECT',
    uid: 'FIREBASE_USER_ID',
  };

  const mockFirebaseAdmin = {
    auth: {
      verifyIdToken: jest.fn().mockResolvedValue(decodedToken),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        {
          module: FirebaseModule,
          providers: [
            {
              provide: FirebaseConstants.FIREBASE_TOKEN,
              useValue: mockFirebaseAdmin,
            },
          ],
          exports: [FirebaseConstants.FIREBASE_TOKEN],
        },
      ],
      providers: [AuthService],
    }).compile();

    sutAuthService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(sutAuthService).toBeDefined();
  });

  describe('validateBearerToken', () => {
    it('should verify token', async () => {
      const returnedToken = await sutAuthService.validateBearerToken(token);

      expect(mockFirebaseAdmin.auth.verifyIdToken).toHaveBeenCalledTimes(1);
      expect(mockFirebaseAdmin.auth.verifyIdToken).toHaveBeenCalledWith(
        token,
        true,
      );
      expect(returnedToken).toStrictEqual(decodedToken);
    });

    it('should throw a USER_DISABLED error when the user account is disabled', async () => {
      mockFirebaseAdmin.auth.verifyIdToken.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'user-disabled',
          message: promiseReminder,
        });
      });

      const validationPromise = sutAuthService.validateBearerToken(token);

      await expect(validationPromise).rejects.toThrowError(
        expect.objectContaining({ type: AuthError.USER_DISABLED }),
      );
    });

    it('should throw a USER_NOT_FOUND error when the user account is not found', async () => {
      mockFirebaseAdmin.auth.verifyIdToken.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'user-not-found',
          message: promiseReminder,
        });
      });

      const validationPromise = sutAuthService.validateBearerToken(token);

      await expect(validationPromise).rejects.toThrowError(
        expect.objectContaining({ type: AuthError.USER_NOT_FOUND }),
      );
    });

    it('should throw a TOKEN_REVOKED error when the token is revoked', async () => {
      mockFirebaseAdmin.auth.verifyIdToken.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'id-token-revoked',
          message: promiseReminder,
        });
      });

      const validationPromise = sutAuthService.validateBearerToken(token);

      await expect(validationPromise).rejects.toThrowError(
        expect.objectContaining({ type: AuthError.TOKEN_REVOKED }),
      );
    });

    it('should throw a TOKEN_EXPIRED error when the token is expired', async () => {
      mockFirebaseAdmin.auth.verifyIdToken.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'id-token-expired',
          message: promiseReminder,
        });
      });

      const validationPromise = sutAuthService.validateBearerToken(token);

      await expect(validationPromise).rejects.toThrowError(
        expect.objectContaining({ type: AuthError.TOKEN_EXPIRED }),
      );
    });

    it('should throw a TOKEN_INVALID error when the token is invalid', async () => {
      mockFirebaseAdmin.auth.verifyIdToken.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'argument-error',
          message: promiseReminder,
        });
      });

      const validationPromise = sutAuthService.validateBearerToken(token);

      await expect(validationPromise).rejects.toThrowError(
        expect.objectContaining({ type: AuthError.TOKEN_INVALID }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      const untreatedException = new Error(promiseReminder);
      untreatedException.name = 'UntreatedExceptionTest';

      mockFirebaseAdmin.auth.verifyIdToken.mockRejectedValueOnce(
        untreatedException,
      );

      const validationPromise = sutAuthService.validateBearerToken(token);

      await expect(validationPromise).rejects.toStrictEqual(untreatedException);
    });
  });
});
