// src/sensor/sensor.module.ts
import { Module } from '@nestjs/common';
import { SerialService } from './serial.service';
import { StateService } from './state.service';
import { SensorGateway } from './sensor.gateway';
import { SensorController } from './sensor.controller';

@Module({
  imports: [],
  providers: [StateService, SerialService, SensorGateway],
  controllers: [SensorController],
})
export class SensorModule {}
