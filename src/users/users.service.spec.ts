import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseModule, FirebaseConstants } from 'nestjs-firebase';
import { UserMetadata, UserRecord } from 'firebase-admin/auth';
import { FirebaseAuthError } from 'firebase-admin/lib/utils/error';
import { UsersService } from '@modules/users';
import { UserError } from '@modules/users';

describe('UsersService', () => {
  let sutUsersService: UsersService;

  const promiseReminder = 'Should await for the promise?';

  const user = {
    id: 'USER_ID',
    name: 'User Name',
    email: 'user@email.com',
    phone: '+1 650-555-3434',
  };

  const userMetadata: UserMetadata = {
    creationTime: new Date().toUTCString(),
    lastSignInTime: new Date().toUTCString(),
    toJSON: () => new Object(),
  };

  const userRecord: UserRecord = {
    uid: user.id,
    displayName: user.name,
    email: user.email,
    emailVerified: false,
    phoneNumber: user.phone,
    disabled: false,
    metadata: userMetadata,
    providerData: [],
    toJSON: () => new Object(),
  };

  const mockFirebaseAdmin = {
    auth: {
      getUser: jest.fn().mockResolvedValue(userRecord),
      getUserByEmail: jest.fn().mockResolvedValue(userRecord),
      getUserByPhoneNumber: jest.fn().mockResolvedValue(userRecord),
    },
  };

  const untreatedException = new Error(promiseReminder);
  untreatedException.name = 'UntreatedExceptionTest';

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
      providers: [UsersService],
    }).compile();

    sutUsersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(sutUsersService).toBeDefined();
  });

  describe('findById', () => {
    it('should find a user', async () => {
      const userFoundById = await sutUsersService.findById(user.id);

      expect(mockFirebaseAdmin.auth.getUser).toHaveBeenCalledTimes(1);
      expect(mockFirebaseAdmin.auth.getUser).toHaveBeenCalledWith(user.id);
      expect(userFoundById).toStrictEqual(userRecord);
    });

    it('should throw NOT_FOUND when the user is not found', async () => {
      mockFirebaseAdmin.auth.getUser.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'user-not-found',
          message: promiseReminder,
        });
      });

      const findByIdPromise = sutUsersService.findById(user.id);

      await expect(findByIdPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.NOT_FOUND }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockFirebaseAdmin.auth.getUser.mockRejectedValueOnce(untreatedException);

      const findByIdPromise = sutUsersService.findById(user.id);

      await expect(findByIdPromise).rejects.toStrictEqual(untreatedException);
    });
  });

  describe('findByEmail', () => {
    it('should find a user', async () => {
      const userFoundByEmail = await sutUsersService.findByEmail(user.email);

      expect(mockFirebaseAdmin.auth.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(mockFirebaseAdmin.auth.getUserByEmail).toHaveBeenCalledWith(
        user.email,
      );
      expect(userFoundByEmail).toStrictEqual(userRecord);
    });

    it('should throw NOT_FOUND when the user is not found', async () => {
      mockFirebaseAdmin.auth.getUserByEmail.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'user-not-found',
          message: promiseReminder,
        });
      });

      const findByEmailPromise = sutUsersService.findByEmail(user.id);

      await expect(findByEmailPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.NOT_FOUND }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockFirebaseAdmin.auth.getUserByEmail.mockRejectedValueOnce(
        untreatedException,
      );

      const findByEmailPromise = sutUsersService.findByEmail(user.id);

      await expect(findByEmailPromise).rejects.toStrictEqual(
        untreatedException,
      );
    });
  });

  describe('getUserByPhoneNumber', () => {
    it('should find a user', async () => {
      const userFoundByPhoneNumber = await sutUsersService.findByPhoneNumber(
        user.phone,
      );

      expect(mockFirebaseAdmin.auth.getUserByPhoneNumber).toHaveBeenCalledTimes(
        1,
      );
      expect(mockFirebaseAdmin.auth.getUserByPhoneNumber).toHaveBeenCalledWith(
        user.phone,
      );
      expect(userFoundByPhoneNumber).toStrictEqual(userRecord);
    });

    it('should throw NOT_FOUND when the user is not found', async () => {
      mockFirebaseAdmin.auth.getUserByPhoneNumber.mockImplementationOnce(
        async () => {
          throw new FirebaseAuthError({
            code: 'user-not-found',
            message: promiseReminder,
          });
        },
      );

      const findByPhoneNumberPromise = sutUsersService.findByPhoneNumber(
        user.id,
      );

      await expect(findByPhoneNumberPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.NOT_FOUND }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockFirebaseAdmin.auth.getUserByPhoneNumber.mockRejectedValueOnce(
        untreatedException,
      );

      const findByPhoneNumberPromise = sutUsersService.findByPhoneNumber(
        user.id,
      );

      await expect(findByPhoneNumberPromise).rejects.toStrictEqual(
        untreatedException,
      );
    });
  });
});
