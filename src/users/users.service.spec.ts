import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule, FirebaseConstants } from 'nestjs-firebase';
import { UserMetadata, UserRecord, ListUsersResult } from 'firebase-admin/auth';
import { CreateRequest } from 'firebase-admin/auth';
import { FirebaseAuthError } from 'firebase-admin/lib/utils/error';
import { UsersService } from '@modules/users';
import { UserError } from '@modules/users';

describe('UsersService', () => {
  let sutUsersService: UsersService;

  const promiseReminder = 'Should await for the promise?';
  const pageToken = 'PAGE_TOKEN';

  const user = {
    id: 'USER_ID',
    name: 'User Name',
    email: 'user@email.com',
    phone: '+1 650-555-3434',
    password: 'USER_PASSWORD_123456',
  };

  const otherUser = {
    id: 'OTHER_USER_ID',
    name: 'Other User Name',
    email: 'other_user@email.com',
    phone: '+1 650-555-3434',
    password: '123456_OTHER_USER_PASSWORD',
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

  const otherUserRecord: UserRecord = {
    uid: otherUser.id,
    displayName: otherUser.name,
    email: otherUser.email,
    emailVerified: false,
    phoneNumber: otherUser.phone,
    disabled: false,
    metadata: userMetadata,
    providerData: [],
    toJSON: () => new Object(),
  };

  const createRequest: CreateRequest = {
    uid: user.id,
    disabled: false,
    displayName: user.name,
    email: user.email,
    emailVerified: true,
    phoneNumber: user.phone,
    password: user.password,
  };

  const usersRecords: UserRecord[] = [userRecord, otherUserRecord];

  const usersList: ListUsersResult = {
    pageToken: pageToken,
    users: usersRecords,
  };

  const updateUserPropertiesInputDto = {
    disabled: false,
    emailConfirmed: true,
    name: user.name,
    email: user.email,
    phoneNumber: user.phone,
  };

  const mockFirebaseAdmin = {
    auth: {
      createUser: jest.fn().mockResolvedValue(userRecord),
      getUser: jest.fn().mockResolvedValue(userRecord),
      getUserByEmail: jest.fn().mockResolvedValue(userRecord),
      getUserByPhoneNumber: jest.fn().mockResolvedValue(userRecord),
      listUsers: jest.fn().mockResolvedValue(usersList),
      updateUser: jest.fn().mockResolvedValue(userRecord),
      deleteUser: jest.fn().mockResolvedValue(undefined),
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
        ConfigModule,
      ],
      providers: [UsersService],
    }).compile();

    sutUsersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(sutUsersService).toBeDefined();
  });

  describe('create', () => {
    it('should create user once', async () => {
      const createdUser = await sutUsersService.create(createRequest);

      expect(mockFirebaseAdmin.auth.createUser).toHaveBeenCalledTimes(1);
      expect(mockFirebaseAdmin.auth.createUser).toHaveBeenCalledWith(
        createRequest,
      );
      expect(createdUser).toStrictEqual(userRecord);
    });

    it('should throw EMAIL_ALREADY_USED when user e-mail is already in use', async () => {
      mockFirebaseAdmin.auth.createUser.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'email-already-exists',
          message: promiseReminder,
        });
      });

      const createUserPromise = sutUsersService.create(createRequest);

      await expect(createUserPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.EMAIL_ALREADY_USED }),
      );
    });

    it('should throw PHONE_NUMBER_ALREADY_USED when user phone number is already in use', async () => {
      mockFirebaseAdmin.auth.createUser.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'phone-number-already-exists',
          message: promiseReminder,
        });
      });

      const createUserPromise = sutUsersService.create(createRequest);

      await expect(createUserPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.PHONE_NUMBER_ALREADY_USED }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockFirebaseAdmin.auth.createUser.mockRejectedValueOnce(
        untreatedException,
      );

      const createUserPromise = sutUsersService.create(createRequest);

      await expect(createUserPromise).rejects.toStrictEqual(untreatedException);
    });
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

  describe('findAll', () => {
    it('should find all users', async () => {
      const listUsersResult = await sutUsersService.findAll(pageToken);

      expect(mockFirebaseAdmin.auth.listUsers).toHaveBeenCalledTimes(1);
      expect(mockFirebaseAdmin.auth.listUsers).toHaveBeenCalledWith(
        expect.anything(),
        pageToken,
      );
      expect(listUsersResult.pageToken).toStrictEqual(pageToken);
      expect(listUsersResult.users).toContainEqual(userRecord);
      expect(listUsersResult.users).toContainEqual(otherUserRecord);
    });

    it('should rethrow untreated exceptions', async () => {
      mockFirebaseAdmin.auth.listUsers.mockRejectedValueOnce(
        untreatedException,
      );

      const findAllPromise = sutUsersService.findAll(user.id);

      await expect(findAllPromise).rejects.toStrictEqual(untreatedException);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updatedUser = await sutUsersService.update(
        user.id,
        updateUserPropertiesInputDto,
      );

      expect(mockFirebaseAdmin.auth.updateUser).toHaveBeenCalledTimes(1);
      expect(mockFirebaseAdmin.auth.updateUser).toHaveBeenCalledWith(
        user.id,
        expect.anything(),
      );
      expect(updatedUser).toStrictEqual(userRecord);
    });

    it('should throw NOT_FOUND when user is not found', async () => {
      mockFirebaseAdmin.auth.updateUser.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'user-not-found',
          message: promiseReminder,
        });
      });

      const updateUserPromise = sutUsersService.update(
        user.id,
        updateUserPropertiesInputDto,
      );

      await expect(updateUserPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.NOT_FOUND }),
      );
    });

    it('should throw EMAIL_ALREADY_USED when user e-mail is already in use', async () => {
      mockFirebaseAdmin.auth.updateUser.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'email-already-exists',
          message: promiseReminder,
        });
      });

      const updateUserPromise = sutUsersService.update(
        user.id,
        updateUserPropertiesInputDto,
      );

      await expect(updateUserPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.EMAIL_ALREADY_USED }),
      );
    });

    it('should throw PHONE_NUMBER_ALREADY_USED when user phone number is already in use', async () => {
      mockFirebaseAdmin.auth.updateUser.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'phone-number-already-exists',
          message: promiseReminder,
        });
      });

      const updateUserPromise = sutUsersService.update(
        user.id,
        updateUserPropertiesInputDto,
      );

      await expect(updateUserPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.PHONE_NUMBER_ALREADY_USED }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockFirebaseAdmin.auth.updateUser.mockRejectedValueOnce(
        untreatedException,
      );

      const updateUserPromise = sutUsersService.update(
        user.id,
        updateUserPropertiesInputDto,
      );

      await expect(updateUserPromise).rejects.toStrictEqual(untreatedException);
    });
  });

  describe('delete', () => {
    it('should delete users', async () => {
      await sutUsersService.delete(user.id);

      expect(mockFirebaseAdmin.auth.deleteUser).toHaveBeenCalledTimes(1);
      expect(mockFirebaseAdmin.auth.deleteUser).toHaveBeenCalledWith(user.id);
    });

    it('should throw NOT_FOUND error when user is not found', async () => {
      mockFirebaseAdmin.auth.deleteUser.mockImplementationOnce(async () => {
        throw new FirebaseAuthError({
          code: 'user-not-found',
          message: promiseReminder,
        });
      });

      const deleteUserPromise = sutUsersService.delete(user.id);

      await expect(deleteUserPromise).rejects.toThrowError(
        expect.objectContaining({ type: UserError.NOT_FOUND }),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockFirebaseAdmin.auth.deleteUser.mockRejectedValueOnce(
        untreatedException,
      );

      const deleteUserPromise = sutUsersService.delete(user.id);

      await expect(deleteUserPromise).rejects.toStrictEqual(untreatedException);
    });
  });
});
