import { Module } from '@nestjs/common';
import { AuthService } from '@modules/auth';
import { PassportModule } from '@nestjs/passport';
import { FirebaseBearerStrategy } from '@modules/auth';

@Module({
  imports: [PassportModule.register({ session: false })],
  providers: [AuthService, FirebaseBearerStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
