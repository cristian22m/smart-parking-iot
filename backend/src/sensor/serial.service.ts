import {
  Injectable,
  OnModuleInit,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { StateService } from './state.service';
import { SERIAL_CONFIG } from './config/sensors.config';

type SensorMessage = {
  sensor: number;
  libre: boolean;
};

function isSensorMessage(obj: unknown): obj is SensorMessage {
  if (typeof obj !== 'object' || obj === null) return false;
  const anyObj = obj as Record<string, unknown>;
  return (
    'sensor' in anyObj &&
    'libre' in anyObj &&
    typeof anyObj['sensor'] === 'number' &&
    typeof anyObj['libre'] === 'boolean'
  );
}

@Injectable()
export class SerialService implements OnModuleInit, OnModuleDestroy {
  private port: SerialPort | null = null;
  private readonly logger = new Logger(SerialService.name);

  constructor(private readonly state: StateService) {}

  async onModuleInit() {
    await this.iniciar();
  }

  async onModuleDestroy() {
    if (this.port && this.port.isOpen) {
      this.logger.log('Cerrando puerto serie...');
      await new Promise<void>((resolve) => {
        this.port?.close(() => resolve());
      });
      this.logger.log('Puerto serie cerrado.');
    }
  }

  private async elegirPuerto(): Promise<string | null> {
    // 1. Revisar configuración manual
    const configPort = SERIAL_CONFIG.port;
    if (configPort && configPort !== 'AUTO') {
      this.logger.log(`Usando puerto fijo desde config: ${configPort}`);
      return configPort;
    }

    // 2. Búsqueda inteligente
    this.logger.log('Modo AUTO: Buscando Arduino conectado...');
    try {
      const ports = await SerialPort.list();
      if (!ports || ports.length === 0) {
        this.logger.warn('No se encontraron puertos serie disponibles.');
        return null;
      }

      // LOG DE DEBUG: Ver qué hay conectado
      this.logger.debug(
        `Puertos detectados: ${ports
          .map((p) => `[${p.path} - ${p.manufacturer || 'Sin fab.'}]`)
          .join(', ')}`,
      );

      // A) BÚSQUEDA POR PRIORIDAD (Drivers comunes de Arduino y Clones)
      // wch.cn = Chips CH340 (muy comunes en clones)
      // silicon labs = Chips CP210x (ESP32, NodeMCU)
      // ftdi = Chips FTDI
      // arduino = Arduinos originales
      const whitelist = /arduino|wch\.cn|silicon labs|ftdi|usb/i;

      // B) LISTA NEGRA (Puertos internos de Windows a ignorar)
      // standard serial = Puertos COM internos viejos
      // intel = Intel Management Engine (suele ser COM3)
      // microsoft = Puertos virtuales del sistema
      const blacklist = /intel|microsoft|standard serial/i;

      // Primer intento: Buscar coincidencia exacta en Whitelist y que NO esté en Blacklist
      let bestPort = ports.find((p) => {
        const man = (p.manufacturer || '').toLowerCase();
        return whitelist.test(man) && !blacklist.test(man);
      });

      // Segundo intento: Si no hay match de fabricante, buscar el COM más alto (asumiendo que COM1-3 son sistema)
      if (!bestPort) {
        // Filtramos los que seguro NO son
        const candidates = ports.filter((p) => {
          const man = (p.manufacturer || '').toLowerCase();
          const isBlocked = blacklist.test(man);
          // Ignorar COM1 y COM2 explícitamente si no tenemos más info
          const isLowCom = p.path === 'COM1' || p.path === 'COM2';
          return !isBlocked && !isLowCom;
        });

        if (candidates.length > 0) {
          bestPort = candidates[0];
        }
      }

      if (bestPort) {
        this.logger.log(
          `Puerto seleccionado (${bestPort.manufacturer}): ${bestPort.path}`,
        );
        return bestPort.path;
      }

      // Último recurso: Devolver el primero que haya si no pudimos filtrar nada
      this.logger.warn(
        'No se detectó Arduino obvio. Probando el primer puerto disponible...',
      );
      return ports[0].path;
    } catch (err) {
      this.logger.error('Error listando puertos', err as Error);
      return null;
    }
  }

  async iniciar() {
    const portPath = await this.elegirPuerto();
    if (!portPath) {
      this.logger.error(
        'No se pudo establecer conexión serial. Verifique src/sensor/config/sensors.config.ts o conecte el dispositivo.',
      );
      return;
    }

    this.port = new SerialPort({
      path: portPath,
      baudRate: SERIAL_CONFIG.baudRate,
      autoOpen: true,
    });

    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', (line: string) => {
      const text = line.trim();
      if (!text) return;

      try {
        const parsed: unknown = JSON.parse(text);
        if (isSensorMessage(parsed)) {
          this.state.actualizarDesdeSensor(parsed.sensor, parsed.libre);
        } else {
          this.logger.debug(`JSON formato incorrecto: ${text}`);
        }
      } catch (err) {
        if (text.startsWith('{')) {
          this.logger.warn(`JSON inválido: "${text}"`);
        }
      }
    });

    this.port.on('open', () =>
      this.logger.log(`Puerto serie abierto exitosamente: ${portPath}`),
    );
    this.port.on('error', (err) =>
      this.logger.error('Error en puerto serie:', err?.message || err),
    );
  }
}
