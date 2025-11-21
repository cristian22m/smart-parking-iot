import { Injectable, Logger } from '@nestjs/common';
import { SENSOR_MAPPING, SensorConfig } from './config/sensors.config';

export interface PlazaState {
  plaza: number;
  libre: boolean; // true = libre, false = ocupado
  timestamp: number; // Momento exacto del último cambio
}

@Injectable()
export class StateService {
  private readonly logger = new Logger(StateService.name);

  // Importamos el mapeo desde la configuración externa
  private readonly sensorConfig: Record<number, SensorConfig> = SENSOR_MAPPING;

  // Estado inicial de las 10 plazas
  // Inicializamos timestamp con la hora de arranque del servidor
  private estado: PlazaState[] = Array.from({ length: 10 }, (_, i) => ({
    plaza: i + 1,
    libre: true,
    timestamp: Date.now(),
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
      this.logger.warn(`Señal de Sensor ${sensorId} no configurado.`);
      return false;
    }

    if (!config.activo) {
      return false;
    }

    return this.actualizarPlaza(config.targetPlaza, libre);
  }

  private actualizarPlaza(plazaId: number, libre: boolean): boolean {
    const idx = this.estado.findIndex((p) => p.plaza === plazaId);
    if (idx === -1) return false;

    const actual = this.estado[idx];
    if (actual.libre === libre) return false; // Sin cambio real

    // ACTUALIZAMOS EL ESTADO CON LA HORA ACTUAL (TIMESTAMP)
    this.estado[idx] = {
      plaza: plazaId,
      libre,
      timestamp: Date.now(),
    };

    const cb = this.onChangeCallback;
    if (cb) cb(this.estado[idx]);

    this.logger.log(`Cambio: Plaza ${plazaId} ${libre ? 'LIBRE' : 'OCUPADA'}`);
    return true;
  }
}
