// src/sensor/sensor.controller.ts
import { Controller, Get } from '@nestjs/common';
import { StateService } from './state.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly state: StateService) {}

  @Get('last')
  obtenerUltimoEstado() {
    return this.state.getEstadoCompleto();
  }
}
