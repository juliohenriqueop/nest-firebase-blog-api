import { join } from 'path';
import * as helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@modules/app';
import { AppError, AppException } from '@modules/app';
import { ConsoleColor } from '@modules/app';

async function bootstrap() {
  if (!process.env.NODE_ENV) {
    throw new AppException(
      AppError.REQUIRED_ENVIRONMENT_VARIABLE_NOT_AVAILABLE,
      'NODE_ENV environment variable is required!',
    );
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          imgSrc: ["'self'", 'data:', 'https://www.gstatic.com'],
          defaultSrc: [
            "'self'",
            configService.get<string>('FIREBASE_APP_URL'),
            process.env.NODE_ENV === 'production'
              ? 'https://identitytoolkit.googleapis.com'
              : configService.get<string>('FIREBASE_AUTH_EMULATOR_CSP'),
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://www.gstatic.com',
            'https://apis.google.com',
          ],
          styleSrc: [
            "'self'",
            'https:',
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
          ],
        },
      },
    }),
  );

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Firebase Blog Api')
    .setDescription(
      'An API to manage users and blog posts written in TypeScript using NestJS Framework.',
    )
    .setVersion('1.0')
    .addSecurity('Firebase Auth', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        '<a href="/login" target="_blank">Sign-In</a> to get an access token!',
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1', app, swaggerDocument, {
    customJs: join('..', '..', 'swagger-firebase-token.js'),
  });

  const portConfig = configService.get<string>('PORT');
  const port = parseInt(portConfig) || 3000;

  await app.listen(port, () => {
    console.log(
      '\nApp is running in',
      `${ConsoleColor.WARNING}`,
      `${process.env.NODE_ENV.toUpperCase()}`,
      `${ConsoleColor.DEFAULT}`,
      'mode !\n',
    );
  });
}
bootstrap();
