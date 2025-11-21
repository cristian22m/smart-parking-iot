import { io } from 'socket.io-client';

// La URL de tu backend NestJS
const URL = 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false, // Para tener control de cuándo se conecta en el componente
  transports: ['websocket', 'polling'], // Forzar websocket preferiblemente
});
