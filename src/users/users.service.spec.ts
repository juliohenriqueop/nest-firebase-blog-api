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
    disabled: false,
    metadata: userMetadata,
    providerData: [],
    toJSON: () => new Object(),
  };

  const mockFirebaseAdmin = {
    auth: {
      getUser: jest.fn().mockResolvedValue(userRecord),
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
});
