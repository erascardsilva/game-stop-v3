const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./data/data'); // Importa o banco de dados
const routes = require('./routes/routes'); // Importa as rotas
const { letterSort, calcPonts } = require('./services/game');
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/api', routes); // Use as rotas do arquivo routes.js
// Cria o servidor HTTP
const server = http.createServer(app);

// Inicializa o Socket.io
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', // URL do frontend
    methods: ['GET', 'POST']
  }
});

// Evento de conexão do Socket.io
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Evento para sortear letra e calcular pontos
  socket.on('sorteiaLetra', () => {
    const letra = letterSort();
    console.log('Letra sorteada:', letra);
    // Atualiza os pontos no banco de dados
    db.serialize(() => {
      db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          throw err;
        }
        const updatedUsers = rows.map(user => {
          const pontos = calcPonts(user.nome, user.pais, user.objeto, user.cor, user.animal, letra);
          db.run(`UPDATE users SET pontos = ? WHERE id = ?`, [pontos, user.id]);
          return { ...user, pontos };
        });
        // Emite a letra sorteada e os pontos atualizados para todos os clientes
        io.emit('letraSorteada', { letra, users: updatedUsers });
      });
    });
  });
  // Evento de desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});
// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Rodando API na porta ${PORT}`);
});
