import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FireormModule } from 'nestjs-fireorm';
import { UsersModule } from '@modules/users';
import { Post, PostsService } from '@modules/posts';
import { PostsController } from '@modules/posts';

@Module({
  imports: [FireormModule.forFeature([Post]), ConfigModule, UsersModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
