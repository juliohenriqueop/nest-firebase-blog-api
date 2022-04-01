import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
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