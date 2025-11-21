// src/app.module.ts
import { Module } from '@nestjs/common';
import { SensorModule } from './sensor/sensor.module';

@Module({
  imports: [SensorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
