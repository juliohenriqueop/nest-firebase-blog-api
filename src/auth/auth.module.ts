import { Module } from '@nestjs/common';
import { AuthService } from '@modules/auth';

@Module({
  providers: [AuthService],
})
export class AuthModule {}
