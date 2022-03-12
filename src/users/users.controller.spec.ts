import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserMetadata, UserRecord } from 'firebase-admin/auth';
import { UsersService, UsersController } from '@modules/users';
import { UserError, UserException } from '@modules/users';
import { FindUserOutputDto } from '@modules/users';

describe('UsersController', () => {
  let usersController: UsersController;

  const promiseReminder = 'Should await for the promise?';

  const user = {
    id: 'USER_ID',
    email: 'user@email.com',
    phone: '+1 650-555-3434',
  };

  const userMetadata: UserMetadata = {
    creationTime: new Date().toUTCString(),
    lastSignInTime: new Date().toUTCString(),
    toJSON: () => new Object(),
  };

  const userRecord: UserRecord = {
    uid: 'USER_ID',
    disabled: false,
    emailVerified: true,
    displayName: 'User Name',
    email: 'user@email.com',
    photoURL: 'https://placeimg.com/640/480/people',
    phoneNumber: user.phone,
    customClaims: {
      permissions: [],
    },
    metadata: userMetadata,
    providerData: [],
    toJSON: () => new Object(),
  };

  const findUserOutputDto: FindUserOutputDto = {
    id: 'USER_ID',
    disabled: false,
    emailConfirmed: true,
    name: 'User Name',
    email: 'user@email.com',
    photoURL: 'https://placeimg.com/640/480/people',
    phoneNumber: user.phone,
    permissions: [],
  };

  const mockUsersService = {
    findById: jest.fn().mockResolvedValue(userRecord),
  };

  const untreatedException = new Error(promiseReminder);
  untreatedException.name = 'UntreatedExceptionTest';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      controllers: [UsersController],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findById', () => {
    it('should find user', async () => {
      const userFoundById = await usersController.findById(user.id);

      expect(mockUsersService.findById).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findById).toHaveBeenCalledWith(user.id);
      expect(userFoundById).toStrictEqual(findUserOutputDto);
    });

    it('should throw NotFoundException when the user is not found', async () => {
      const userNotFoundException = new UserException(
        UserError.NOT_FOUND,
        promiseReminder,
      );

      mockUsersService.findById.mockRejectedValueOnce(userNotFoundException);

      const findByIdPromise = usersController.findById(user.id);

      await expect(findByIdPromise).rejects.toStrictEqual(
        new NotFoundException(userNotFoundException.message),
      );
    });

    it('should rethrow untreated exceptions', async () => {
      mockUsersService.findById.mockRejectedValueOnce(untreatedException);

      const findByIdPromise = usersController.findById(user.id);
      await expect(findByIdPromise).rejects.toStrictEqual(untreatedException);
    });
  });
});
