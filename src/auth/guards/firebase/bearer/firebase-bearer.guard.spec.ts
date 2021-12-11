import { AuthGuard } from '@nestjs/passport';
import { FirebaseBearerGuard } from '@modules/auth';

describe('FirebaseBearerGuard', () => {
  let sutFirebaseBearerGuard: FirebaseBearerGuard;

  beforeEach(async () => {
    sutFirebaseBearerGuard = new FirebaseBearerGuard();
  });

  it('should be defined', () => {
    expect(sutFirebaseBearerGuard).toBeDefined();
  });

  it('should extend AuthGuard with firebase-jwt strategy', () => {
    expect(sutFirebaseBearerGuard).toBeInstanceOf(AuthGuard('firebase-jwt'));
  });
});
