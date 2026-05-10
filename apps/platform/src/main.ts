import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger } from './common/logger';
import { config } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Request logging (only in dev)
  if (config.nodeEnv === 'development') {
    app.useLogger(new Logger());
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  Logger.log(`Application is running on: http://localhost:${port}/api/v1`);
  Logger.log(`Environment: ${config.nodeEnv}`);
}

bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});
