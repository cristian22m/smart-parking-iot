// src/sensor/serial.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { StateService } from './state.service';

type PlazaMessage = {
  plaza: number;
  libre: boolean;
};

function isPlazaMessage(obj: unknown): obj is PlazaMessage {
  if (typeof obj !== 'object' || obj === null) return false;
  const anyObj = obj as Record<string, unknown>;
  return (
    'plaza' in anyObj &&
    'libre' in anyObj &&
    typeof anyObj['plaza'] === 'number' &&
    typeof anyObj['libre'] === 'boolean'
  );
}

@Injectable()
export class SerialService implements OnModuleInit {
  private port: SerialPort | null = null;
  private readonly logger = new Logger(SerialService.name);

  constructor(private readonly state: StateService) {}

  async onModuleInit() {
    await this.iniciar();
  }

  private async elegirPuerto(): Promise<string | null> {
    const envPort = process.env.SERIAL_PORT;
    if (envPort) {
      this.logger.log(`Usando puerto desde SERIAL_PORT: ${envPort}`);
      return envPort;
    }

    try {
      const ports = await SerialPort.list();
      if (!ports || ports.length === 0) {
        this.logger.warn('No se encontraron puertos serie.');
        return null;
      }

      const preferred = ports.find(
        (p) =>
          (p.manufacturer && /arduino/i.test(p.manufacturer)) ||
          (p.path && /com/i.test(p.path)),
      );

      const seleccionado = preferred ? preferred.path : ports[0].path;
      this.logger.log(`Puerto auto-detectado: ${seleccionado}`);
      return seleccionado;
    } catch (err) {
      this.logger.error('Error listando puertos serie', err as Error);
      return null;
    }
  }

  async iniciar() {
    const portPath = await this.elegirPuerto();
    if (!portPath) {
      this.logger.error(
        'No se encontró puerto serie. Defina SERIAL_PORT o conecte un dispositivo.',
      );
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
      try {
        const parsed: unknown = JSON.parse(text);

        if (isPlazaMessage(parsed)) {
          // parsed ahora es PlazaMessage y TypeScript es feliz
          const changed = this.state.actualizarPlaza(
            parsed.plaza,
            parsed.libre,
          );
          if (!changed) {
            this.logger.debug(`Mensaje válido pero sin cambio real: ${text}`);
          } else {
            this.logger.log(
              `Procesado: plaza ${parsed.plaza} libre=${parsed.libre}`,
            );
          }
        } else {
          this.logger.warn(`JSON con formato inesperado: ${text}`);
        }
      } catch (err) {
        this.logger.warn(`No se pudo parsear JSON: "${text}" - ${String(err)}`);
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
