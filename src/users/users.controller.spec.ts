import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserMetadata, UserRecord, ListUsersResult } from 'firebase-admin/auth';
import { UsersService, UsersController } from '@modules/users';
import { UserError, UserException } from '@modules/users';
import { FindUserOutputDto } from '@modules/users';
import { FindUsersOutputDto } from '@modules/users';

describe('UsersController', () => {
  let usersController: UsersController;

  const pageToken = 'PAGE_TOKEN';
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

  const otherUserRecord: UserRecord = {
    uid: 'OTHER_USER_ID',
    disabled: false,
    emailVerified: true,
    displayName: 'Other User Name',
    email: 'other_user@email.com',
    photoURL: 'https://placeimg.com/640/480/people',
    phoneNumber: '+1 650-555-3434',
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

  const otherFindUserOutputDto: FindUserOutputDto = {
    id: 'OTHER_USER_ID',
    disabled: false,
    emailConfirmed: true,
    name: 'Other User Name',
    email: 'other_user@email.com',
    photoURL: 'https://placeimg.com/640/480/people',
    phoneNumber: '+1 650-555-3434',
    permissions: [],
  };

  const listUsersResult: ListUsersResult = {
    pageToken: 'NEXT_PAGE_TOKEN',
    users: [userRecord, otherUserRecord],
  };

  const findOneUserOutputDto: FindUsersOutputDto = {
    nextPage: '',
    users: [findUserOutputDto],
  };

  const findAllUsersOutputDto: FindUsersOutputDto = {
    nextPage: listUsersResult.pageToken,
    users: [findUserOutputDto, otherFindUserOutputDto],
  };

  const mockUsersService = {
    findByEmail: jest.fn().mockResolvedValue(userRecord),
    findByPhoneNumber: jest.fn().mockResolvedValue(userRecord),
    findById: jest.fn().mockResolvedValue(userRecord),
    findAll: jest.fn().mockResolvedValue(listUsersResult),
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

  describe('find', () => {
    describe('by email', () => {
      it('should find user', async () => {
        const userFoundByEmail = await usersController.find({
          email: user.email,
        });

        expect(mockUsersService.findByEmail).toHaveBeenCalledTimes(1);
        expect(mockUsersService.findByEmail).toHaveBeenCalledWith(user.email);
        expect(userFoundByEmail).toStrictEqual(findOneUserOutputDto);
      });

      it('should throw NotFoundException when the user is not found', async () => {
        const userNotFoundException = new UserException(
          UserError.NOT_FOUND,
          promiseReminder,
        );

        mockUsersService.findByEmail.mockRejectedValueOnce(
          userNotFoundException,
        );

        const findByEmailPromise = usersController.find({
          email: user.email,
        });

        await expect(findByEmailPromise).rejects.toStrictEqual(
          new NotFoundException(userNotFoundException.message),
        );
      });

      it('should rethrow untreated exceptions', async () => {
        mockUsersService.findByEmail.mockRejectedValueOnce(untreatedException);

        const findByEmailPromise = usersController.find({
          email: user.email,
        });

        await expect(findByEmailPromise).rejects.toStrictEqual(
          untreatedException,
        );
      });
    });

    describe('by phone number', () => {
      it('should find user', async () => {
        const userFoundByPhoneNumber = await usersController.find({
          phoneNumber: user.phone,
        });

        expect(mockUsersService.findByPhoneNumber).toHaveBeenCalledTimes(1);
        expect(mockUsersService.findByPhoneNumber).toHaveBeenCalledWith(
          user.phone,
        );
        expect(userFoundByPhoneNumber).toStrictEqual(findOneUserOutputDto);
      });

      it('should throw NotFoundException when the user is not found', async () => {
        const userNotFoundException = new UserException(
          UserError.NOT_FOUND,
          promiseReminder,
        );

        mockUsersService.findByPhoneNumber.mockRejectedValueOnce(
          userNotFoundException,
        );

        const findByPhoneNumberPromise = usersController.find({
          phoneNumber: user.phone,
        });

        await expect(findByPhoneNumberPromise).rejects.toStrictEqual(
          new NotFoundException(userNotFoundException.message),
        );
      });

      it('should rethrow untreated exceptions', async () => {
        mockUsersService.findByPhoneNumber.mockRejectedValueOnce(
          untreatedException,
        );

        const findByPhoneNumberPromise = usersController.find({
          phoneNumber: user.phone,
        });

        await expect(findByPhoneNumberPromise).rejects.toStrictEqual(
          untreatedException,
        );
      });
    });

    describe('findAll', () => {
      it('should find all users once', async () => {
        const usersPage = await usersController.find({ page: pageToken });

        expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
        expect(mockUsersService.findAll).toHaveBeenLastCalledWith(pageToken);
        expect(usersPage).toStrictEqual(findAllUsersOutputDto);
      });

      it('should rethrow untreated exceptions', async () => {
        mockUsersService.findAll.mockRejectedValueOnce(untreatedException);

        const findAllUsersPromise = usersController.find({ page: pageToken });

        await expect(findAllUsersPromise).rejects.toStrictEqual(
          untreatedException,
        );
      });
    });
  });
});
