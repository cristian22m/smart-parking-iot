/**
 * Interfaz de configuración para cada sensor.
 */
export interface SensorConfig {
  targetPlaza: number; // ID de la plaza visual en el frontend
  activo: boolean; // true = procesar señal, false = ignorar
}

/**
 * MAPEO CENTRAL: Sensor Físico (Key) -> Plaza Lógica (Value).
 * Ubicación: src/sensor/config/sensors.config.ts
 */
export const SENSOR_MAPPING: Record<number, SensorConfig> = {
  1: { targetPlaza: 1, activo: true },
  2: { targetPlaza: 2, activo: false },
  3: { targetPlaza: 3, activo: false },
  4: { targetPlaza: 4, activo: false },
  5: { targetPlaza: 5, activo: false },
  6: { targetPlaza: 6, activo: false },
  7: { targetPlaza: 7, activo: false },
  8: { targetPlaza: 8, activo: false },
  9: { targetPlaza: 9, activo: false },
  10: { targetPlaza: 10, activo: false },
};
