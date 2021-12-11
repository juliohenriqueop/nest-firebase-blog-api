import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService, FirebaseBearerStrategy } from '@modules/auth';
import { AuthException, AuthError } from '@modules/auth';

describe('FirebaseBearerStrategy', () => {
  let sutFirebaseBearerStrategy: FirebaseBearerStrategy;

  const mockAuthService = {
    validateBearerToken: jest.fn(),
  };

  const token = 'USER_ID_TOKEN';

  const promiseReminder = 'Should await for the promise?';
  const throwMessageReminder =
    'Use AuthException.message to throw a new exception!';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, FirebaseBearerStrategy],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    sutFirebaseBearerStrategy = module.get<FirebaseBearerStrategy>(
      FirebaseBearerStrategy,
    );
  });

  it('should be defined', () => {
    expect(sutFirebaseBearerStrategy).toBeDefined();
  });

  it('should verify token', async () => {
    await sutFirebaseBearerStrategy.validate(token);

    expect(mockAuthService.validateBearerToken).toBeCalledTimes(1);
    expect(mockAuthService.validateBearerToken).toHaveBeenCalledWith(token);
  });

  it('should throw ForbiddenException when the user account is disabled', async () => {
    const userAccountDisabledException = new AuthException(
      AuthError.USER_DISABLED,
      throwMessageReminder,
    );

    mockAuthService.validateBearerToken.mockRejectedValueOnce(
      userAccountDisabledException,
    );

    const validationPromise = sutFirebaseBearerStrategy.validate(token);

    await expect(validationPromise).rejects.toStrictEqual(
      new ForbiddenException(userAccountDisabledException.message),
    );
  });

  it('should throw ForbiddenException when the user account is not found', async () => {
    const userAccountNotFoundException = new AuthException(
      AuthError.USER_NOT_FOUND,
      throwMessageReminder,
    );

    mockAuthService.validateBearerToken.mockRejectedValueOnce(
      userAccountNotFoundException,
    );

    const validationPromise = sutFirebaseBearerStrategy.validate(token);

    await expect(validationPromise).rejects.toStrictEqual(
      new ForbiddenException(userAccountNotFoundException.message),
    );
  });

  it('should throw ForbiddenException when the token is revoked', async () => {
    const tokenRevokedException = new AuthException(
      AuthError.TOKEN_REVOKED,
      throwMessageReminder,
    );

    mockAuthService.validateBearerToken.mockRejectedValueOnce(
      tokenRevokedException,
    );

    const validationPromise = sutFirebaseBearerStrategy.validate(token);

    await expect(validationPromise).rejects.toStrictEqual(
      new ForbiddenException(tokenRevokedException.message),
    );
  });

  it('should throw ForbiddenException when the token is expired', async () => {
    const tokenExpiredException = new AuthException(
      AuthError.TOKEN_EXPIRED,
      throwMessageReminder,
    );

    mockAuthService.validateBearerToken.mockRejectedValueOnce(
      tokenExpiredException,
    );

    const validationPromise = sutFirebaseBearerStrategy.validate(token);

    await expect(validationPromise).rejects.toStrictEqual(
      new ForbiddenException(tokenExpiredException.message),
    );
  });

  it('should throw UnauthorizedException when the token is invalid', async () => {
    const tokenInvalidException = new AuthException(
      AuthError.TOKEN_INVALID,
      throwMessageReminder,
    );

    mockAuthService.validateBearerToken.mockRejectedValueOnce(
      tokenInvalidException,
    );

    const validationPromise = sutFirebaseBearerStrategy.validate(token);

    await expect(validationPromise).rejects.toStrictEqual(
      new UnauthorizedException(tokenInvalidException.message),
    );
  });

  it('should rethrow untreated exceptions', async () => {
    const untreatedException = new Error(promiseReminder);
    untreatedException.name = 'UntreatedExceptionTest';

    mockAuthService.validateBearerToken.mockRejectedValueOnce(
      untreatedException,
    );

    const validationPromise = sutFirebaseBearerStrategy.validate(token);

    await expect(validationPromise).rejects.toStrictEqual(untreatedException);
  });
});
