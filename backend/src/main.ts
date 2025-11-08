import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 Configura el puerto serie (ajusta el nombre según tu puerto actual)
  const port = new SerialPort({
    path: 'COM8', // cambia si tu puerto es diferente
    baudRate: 9600, // debe coincidir con Serial.begin(9600)
  });

  // 👇 Parser para leer líneas completas
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  // 👂 Escucha los datos entrantes
  parser.on('data', (data) => {
    console.log('📥 Dato recibido desde Arduino:', data);
  });

  // 👂 Captura errores
  port.on('error', (err) => {
    console.error('❌ Error en el puerto serie:', err.message);
  });

  await app.listen(3000);
  console.log('🚀 Aplicación NestJS iniciada en http://localhost:3000');
}

bootstrap();
