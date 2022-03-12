import { Module } from '@nestjs/common';
import { UsersService } from '@modules/users';
import { UsersController } from '@modules/users';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
