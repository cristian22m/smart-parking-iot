import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StateService, PlazaState } from './state.service';
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
    // Al registrar el cambio, pasamos todo el objeto PlazaState (con timestamp)
    this.state.registerOnChange((p) => {
      this.emitirCambio(p);
    });
  }

  afterInit(server: Server) {
    this.logger.log('Servidor WebSocket Inicializado');
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Cliente conectado: ${socket.id}`);
    const estado = this.state.getEstadoCompleto();
    socket.emit('estado-inicial', estado);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Cliente desconectado: ${socket.id}`);
  }

  // Recibimos y emitimos el objeto completo: { plaza, libre, timestamp }
  emitirCambio(payload: PlazaState) {
    this.server.emit('evento-plaza', payload);
    this.logger.log(`Emitido evento-plaza: ${JSON.stringify(payload)}`);
  }
}
