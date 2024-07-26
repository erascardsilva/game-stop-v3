const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./data/data'); 
const routes = require('./routes/routes'); 
const { letterSort } = require('./services/game'); 
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', routes); 

// Cria o servidor HTTP
const server = http.createServer(app);

// Inicializa o Socket.io
const io = socketIo(server, {
  cors: {
    origin: '*', // Permite qualquer origem
    methods: ['GET', 'POST']
  }
});

// Função para buscar e emitir pontos de todos os usuários
const emitirPontos = () => {
  db.serialize(() => {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        console.error('Erro ao buscar pontos dos usuários:', err.message);
        return;
      }
      // Emite os pontos de todos os usuários para todos os clientes
      io.emit('atualizaPontos', { users: rows });
    });
  });
};

// Evento de conexão do Socket.io
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Evento para sortear letra
  socket.on('sorteiaLetra', () => {
    const letra = letterSort();
    console.log('Letra sorteada:', letra);
    // Emite a letra sorteada para todos os clientes
    io.emit('letraSorteada', { letra });
  });

  // Emitir pontos 
  emitirPontos();

  // Evento de desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Inicia o servidor HTTP com Socket.io e API
server.listen(PORT, () => {
  console.log(`Rodando API na porta ${PORT}`);
});
