import io from 'socket.io-client';

// Conecte-se ao servidor Socket.IO
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Conectado ao servidor Socket.IO');
});

socket.on('letraSorteada', (data) => {
  console.log('Letra sorteada:', data.letra);
  // Atualize o estado ou faça outras ações com a letra sorteada
});

function sendMessage(message) {
  socket.emit(message);
}

export { sendMessage };
