import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3005', // ใส่ origin ของ frontend
    credentials: true, // ถ้ามีการใช้ cookie
  });
  await app.listen(3000);
}
bootstrap();