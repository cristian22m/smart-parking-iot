import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

import 'dotenv/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  logger.log('NestJS iniciado en http://localhost:3000');
}
bootstrap();
