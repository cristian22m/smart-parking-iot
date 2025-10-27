import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // CORS habilitado
  const app = await NestFactory.create(AppModule, { cors: true });
  
  await app.listen(3000);
  console.log('Backend NestJS corriendo en http://localhost:3000');
}
bootstrap();