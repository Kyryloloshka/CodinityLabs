import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  const port = process.env.PORT || 8200;
  await app.listen(port);
  console.log(`Assignment service is running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start assignment service:', error);
  process.exit(1);
});
