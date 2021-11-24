import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: [`.${process.env.NODE_ENV || 'development'}.env`],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
