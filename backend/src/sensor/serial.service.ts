import {
  Injectable,
  OnModuleInit,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { StateService } from './state.service';

// Nuevo formato esperado del Arduino
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
    const envPort = process.env.SERIAL_PORT;
    if (envPort) return envPort;

    try {
      const ports = await SerialPort.list();
      if (!ports || ports.length === 0) {
        this.logger.warn('No se encontraron puertos serie.');
        return null;
      }
      // Preferimos Arduino
      const preferred = ports.find(
        (p) =>
          (p.manufacturer && /arduino/i.test(p.manufacturer)) ||
          (p.path && /com/i.test(p.path)),
      );
      return preferred ? preferred.path : ports[0].path;
    } catch (err) {
      this.logger.error('Error listando puertos', err as Error);
      return null;
    }
  }

  async iniciar() {
    const portPath = await this.elegirPuerto();
    if (!portPath) {
      this.logger.error('No hay puerto serie disponible.');
      return;
    }

    this.port = new SerialPort({
      path: portPath,
      baudRate: Number(process.env.SERIAL_BAUD || 9600),
      autoOpen: true,
    });

    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', (line: string) => {
      const text = line.trim();
      if (!text) return; // Ignorar líneas vacías

      try {
        const parsed: unknown = JSON.parse(text);

        if (isSensorMessage(parsed)) {
          // Delegamos al StateService la lógica de mapeo (Sensor ID -> Plaza ID)
          this.state.actualizarDesdeSensor(parsed.sensor, parsed.libre);
        } else {
          this.logger.debug(`JSON recibido pero formato incorrecto: ${text}`);
        }
      } catch (err) {
        // Solo logueamos si parece un intento de JSON, para no ensuciar logs con basura serial
        if (text.startsWith('{')) {
          this.logger.warn(`JSON inválido: "${text}"`);
          this.logger.error(err as Error);
        }
      }
    });

    this.port.on('open', () =>
      this.logger.log(`Puerto serie abierto: ${portPath}`),
    );
    this.port.on('error', (err) =>
      this.logger.error('Error en puerto serie:', err?.message || err),
    );
  }
}
