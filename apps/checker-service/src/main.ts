import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8300);
  console.log(`Checker service is running on port ${process.env.PORT ?? 8300}`);
}
void bootstrap();
