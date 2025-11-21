import { Injectable, Logger } from '@nestjs/common';
// CAMBIO AQUÍ: Actualizamos la ruta del import
import { SENSOR_MAPPING, SensorConfig } from './config/sensors.config';

export interface PlazaState {
  plaza: number;
  libre: boolean; // true = libre, false = ocupado
}

@Injectable()
export class StateService {
  private readonly logger = new Logger(StateService.name);

  // Importamos el mapeo desde la nueva ubicación
  private readonly sensorConfig: Record<number, SensorConfig> = SENSOR_MAPPING;

  // Estado inicial de las 10 plazas (todo libre por defecto)
  private estado: PlazaState[] = Array.from({ length: 10 }, (_, i) => ({
    plaza: i + 1,
    libre: true,
  }));

  private onChangeCallback: ((p: PlazaState) => void) | null = null;

  registerOnChange(cb: (p: PlazaState) => void) {
    this.onChangeCallback = cb;
  }

  getEstadoCompleto(): PlazaState[] {
    return this.estado.map((s) => ({ ...s }));
  }

  actualizarDesdeSensor(sensorId: number, libre: boolean): boolean {
    const config = this.sensorConfig[sensorId];

    if (!config) {
      this.logger.warn(`Señal recibida de Sensor ${sensorId} no configurado.`);
      return false;
    }

    if (!config.activo) {
      this.logger.debug(`Sensor ${sensorId} desactivado. Ignorando señal.`);
      return false;
    }

    return this.actualizarPlaza(config.targetPlaza, libre);
  }

  private actualizarPlaza(plazaId: number, libre: boolean): boolean {
    const idx = this.estado.findIndex((p) => p.plaza === plazaId);

    if (idx === -1) {
      this.logger.error(`Error de Config: La Plaza ${plazaId} no existe.`);
      return false;
    }

    const actual = this.estado[idx];
    if (actual.libre === libre) return false;

    this.estado[idx] = { plaza: plazaId, libre };

    const cb = this.onChangeCallback;
    if (cb) cb(this.estado[idx]);

    this.logger.log(
      `Cambio: Sensor -> Plaza ${plazaId} ahora está ${libre ? 'LIBRE' : 'OCUPADA'}`,
    );
    return true;
  }
}
