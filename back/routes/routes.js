const express = require('express');
const router = express.Router();
const db = require('../data/data');
const { calcPonts, letterSort } = require('../services/game');

let letraSorteada = '';

// Função para garantir que a letra sorteada esteja atualizada
const ensureLetraSorteada = () => {
  if (!letraSorteada) {
    letraSorteada = letterSort(); // Gere uma letra se ainda não estiver definida
  }
};

// Rota para sortear uma letra aleatória
router.post('/sorteiaLetra', (req, res) => {
  letraSorteada = letterSort(); // Atualiza a letra sorteada globalmente
  res.status(200).send({ letra: letraSorteada });
});

// Rota para inserir um jogador
router.post('/insere', (req, res) => {
  const { name, nome, pais, objeto, cor, animal, letra } = req.body;



  // Certifique-se de que a letra sorteada foi definida
  if (!letra) {
    return res.status(400).send({ message: 'Letra sorteada não definida.' });
  }

  const pontos = calcPonts(nome, pais, objeto, cor, animal, letra);

  db.run(`INSERT INTO users (name, nome, pais, objeto, cor, animal, pontos) VALUES(?,?,?,?,?,?,?)`,
    [name, nome, pais, objeto, cor, animal, pontos], (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).send({ message: 'Dados inseridos' });
    });
});

// Rota para obter todos os jogadores
router.get('/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    return res.status(200).send(rows);
  });
});

// Rota para obter um jogador por ID
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (!row) {
      return res.status(404).send({ message: 'Jogador não encontrado' });
    }
    return res.status(200).send(row);
  });
});

// Rota para atualizar um jogador por ID
router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, nome, pais, objeto, cor, animal, pontos } = req.body;
  db.run(`UPDATE users SET name = ?, nome = ?, pais = ?, objeto = ?, cor = ?, animal = ?, pontos = ? WHERE id = ?`,
    [name, nome, pais, objeto, cor, animal, pontos, id], (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).send({ message: 'Dados atualizados' });
    });
});

// Rota para deletar um jogador por ID
router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    return res.status(200).send({ message: 'Dados deletados' });
  });
});

// Rota para deletar todos os jogadores
router.delete('/users', (req, res) => {
  db.run("DELETE FROM users", (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    return res.status(200).send({ message: 'Todos os dados deletados' });
  });
});

module.exports = router;
