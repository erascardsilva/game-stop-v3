const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (ws) => {
  console.log('Novo cliente WebSocket conectado');

  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
    if (message === 'sorteiaLetra') {
      const letra = letterSort();
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`letraSorteada:${letra}`);
        }
      });
    } else {
      ws.send(`Você disse: ${message}`);
    }
  });

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
  });

  ws.send('Bem-vindo ao servidor WebSocket!');
});

console.log('Servidor WebSocket está ouvindo na porta 8080');