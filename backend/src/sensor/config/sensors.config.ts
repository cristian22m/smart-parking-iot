/**
 * Interfaz de configuración para cada sensor.
 */
export interface SensorConfig {
  targetPlaza: number;
  activo: boolean;
}

/**
 * CONFIGURACIÓN DEL PUERTO SERIE
 * - port: Puede ser 'AUTO' (para detectar Arduino solo) o un puerto fijo (ej: 'COM3', '/dev/ttyUSB0').
 * - baudRate: Velocidad de comunicación (9600 es el estándar de Arduino).
 */
export const SERIAL_CONFIG = {
  port: 'AUTO', // Cambiar a 'COMX' si quieres forzar uno específico
  baudRate: 9600,
};

/**
 * MAPEO CENTRAL: Sensor Físico -> Plaza Lógica
 */
export const SENSOR_MAPPING: Record<number, SensorConfig> = {
  1: { targetPlaza: 1, activo: true },
  2: { targetPlaza: 2, activo: false }, // Ejemplo desactivado
  3: { targetPlaza: 3, activo: false },
  4: { targetPlaza: 4, activo: false },
  5: { targetPlaza: 5, activo: false },
  6: { targetPlaza: 6, activo: false },
  7: { targetPlaza: 7, activo: false },
  8: { targetPlaza: 8, activo: false },
  9: { targetPlaza: 9, activo: false },
  10: { targetPlaza: 10, activo: false },
};
