import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { UsersModule } from '@modules/users';
import { Post, PostsService } from '@modules/posts';

@Module({
  imports: [FireormModule.forFeature([Post]), UsersModule],
  providers: [PostsService],
})
export class PostsModule {}
