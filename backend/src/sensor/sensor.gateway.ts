import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StateService } from './state.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SensorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(SensorGateway.name);

  constructor(private readonly state: StateService) {
    this.logger.log('>>> SensorGateway: Constructor instanciado');

    this.state.registerOnChange((p) => {
      this.logger.log(
        `>>> SensorGateway: Detectado cambio en state -> Plaza ${p.plaza}`,
      );
      this.emitirCambio(p.plaza, p.libre);
    });
  }

  afterInit() {
    this.logger.log(
      '>>> SensorGateway: Servidor WebSocket Inicializado (afterInit)',
    );
  }

  handleConnection(socket: Socket) {
    this.logger.log(
      `>>> SensorGateway: Intento de conexión entrante: ${socket.id}`,
    );

    const estado = this.state.getEstadoCompleto();
    // Forzar emisión inmediata para debug
    socket.emit('estado-inicial', estado);

    this.logger.log(
      `>>> SensorGateway: Cliente conectado y evento 'estado-inicial' enviado a ${socket.id}`,
    );
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`>>> SensorGateway: Cliente desconectado: ${socket.id}`);
  }

  emitirCambio(plaza: number, libre: boolean) {
    const payload = { plaza, libre };
    this.server.emit('evento-plaza', payload);
    this.logger.log(
      `>>> SensorGateway: Emitido 'evento-plaza': ${JSON.stringify(payload)}`,
    );
  }
}
