import { Injectable } from '@nestjs/common';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthService, AuthError } from '@modules/auth';

@Injectable()
export class FirebaseBearerStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string): Promise<DecodedIdToken> {
    try {
      return await this.authService.validateBearerToken(token);
    } catch (authException) {
      if (authException.type === AuthError.USER_DISABLED) {
        throw new ForbiddenException(authException.message);
      }

      if (authException.type === AuthError.USER_NOT_FOUND) {
        throw new ForbiddenException(authException.message);
      }

      if (authException.type === AuthError.TOKEN_REVOKED) {
        throw new ForbiddenException(authException.message);
      }

      if (authException.type === AuthError.TOKEN_EXPIRED) {
        throw new ForbiddenException(authException.message);
      }

      if (authException.type === AuthError.TOKEN_INVALID) {
        throw new UnauthorizedException(authException.message);
      }

      throw authException;
    }
  }
}
