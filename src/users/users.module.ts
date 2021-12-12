import { Module } from '@nestjs/common';
import { UsersService } from '@modules/users';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
