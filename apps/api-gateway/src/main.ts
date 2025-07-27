import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);

  // Глобальна валідація
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Налаштування CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Налаштування Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway для мікросервісної архітектури')
    .setVersion('1.0')
    .addTag(
      'Користувачі (API Gateway)',
      'Операції з користувачами через Auth Service',
    )
    .addTag('Health', 'Перевірка стану сервісів')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Gateway Documentation',
  });

  await app.listen(configService.port);

  console.log(
    `🚀 API Gateway is running on: http://localhost:${configService.port}`,
  );
  console.log(
    `📚 Swagger documentation: http://localhost:${configService.port}/api`,
  );
}
void bootstrap();
