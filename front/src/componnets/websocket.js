// websocket.js
import { io } from 'socket.io-client';

const SERVER_WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001'; // URL correta para WebSocket
const socket = io(SERVER_WS_URL);

socket.on('connect', () => {
  console.log('Conectado ao servidor Socket.IO:', SERVER_WS_URL);
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor Socket.IO');
});

socket.on('connect_error', (error) => {
  console.error('Erro de conexão Socket.IO:', error);
});

const sendMessage = (message) => {
  if (socket.connected) {
    console.log('Enviando mensagem:', message);
    socket.emit(message);
  } else {
    console.warn('Socket.IO não está conectado. Mensagem não enviada:', message);
  }
};

export { socket, sendMessage };
