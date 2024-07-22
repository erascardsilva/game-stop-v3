import io from 'socket.io-client';

//  servidor Socket.IO
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Conectado ao servidor Socket.IO');
});

socket.on('letraSorteada', (data) => {
  console.log('Letra sorteada:', data.letra);
 });

function sendMessage(message) {
  socket.emit(message);
}

export { socket, sendMessage };
