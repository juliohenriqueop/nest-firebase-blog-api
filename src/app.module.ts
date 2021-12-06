import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';
import { FirebaseModule, FirebaseModuleOptions } from 'nestjs-firebase';
import { AppError, AppException } from '@modules/app';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: [`.${process.env.NODE_ENV || 'development'}.env`],
    }),
    FirebaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (process.env.NODE_ENV === 'production') {
          const firebasePrivateKeyBase64 = config.get<string>(
            'FIREBASE_PRIVATE_KEY_BASE64',
          );

          if (!firebasePrivateKeyBase64) {
            throw new AppException(
              AppError.REQUIRED_ENVIRONMENT_VARIABLE_NOT_AVAILABLE,
              'FIREBASE_PRIVATE_KEY_BASE64 environment variable is required in production!',
            );
          }

          const firebasePrivateKeyBuffer = Buffer.from(
            firebasePrivateKeyBase64,
            'base64',
          );

          const firebaseProjectId = config.get<string>('FIREBASE_PROJECT_ID');

          if (!firebaseProjectId) {
            throw new AppException(
              AppError.REQUIRED_ENVIRONMENT_VARIABLE_NOT_AVAILABLE,
              'FIREBASE_PROJECT_ID environment variable is required in production!',
            );
          }

          const firebaseClientEmail = config.get<string>(
            'FIREBASE_CLIENT_EMAIL',
          );

          if (!firebaseClientEmail) {
            throw new AppException(
              AppError.REQUIRED_ENVIRONMENT_VARIABLE_NOT_AVAILABLE,
              'FIREBASE_CLIENT_EMAIL environment variable is required in production!',
            );
          }

          const firebaseServiceAccount: ServiceAccount = {
            projectId: firebaseProjectId,
            clientEmail: firebaseClientEmail,
            privateKey: firebasePrivateKeyBuffer.toString(),
          };

          const firebaseModuleOptions: FirebaseModuleOptions = {
            googleApplicationCredential: firebaseServiceAccount,
          };

          return firebaseModuleOptions;
        }

        return null;
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
