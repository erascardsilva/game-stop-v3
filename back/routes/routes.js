const express = require('express');
const routes = express.Router();
const db = require('../data/data');
const { calcPonts, letterSort } = require('../services/game');

let letraSorteada = '';

// Rota para sortear uma letra aleatória
routes.get('/sorteia', (req, res) => {
  letraSorteada = letterSort(); // Atualiza a letra sorteada globalmente
  res.status(200).send({ letra: letraSorteada });
});

// Rota para inserir um jogador
routes.post('/insere', (req, res) => {
  const { name, nome, pais, objeto, cor, animal } = req.body;
  const pontosCalculados = calcPonts( nome, pais, objeto, cor, animal, letraSorteada);

  db.run(`INSERT INTO users (name, nome, pais, objeto, cor, animal, pontos) VALUES(?,?,?,?,?,?,?)`,
    [name, nome, pais, objeto, cor, animal, pontosCalculados], (err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).send({ message: 'Dados inseridos' });
    });
});

// Rota para obter todos os jogadores
routes.get('/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    return res.status(200).send(rows);
  });
});

// Rota para obter um jogador por ID
routes.get('/users/:id', (req, res) => {
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
routes.put('/users/:id', (req, res) => {
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
routes.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    return res.status(200).send({ message: 'Dados deletados' });
  });
});

// Rota para deletar todos os jogadores
routes.delete('/users', (req, res) => {
  db.run("DELETE FROM users", (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    return res.status(200).send({ message: 'Todos os dados deletados' });
  });
});

module.exports = routes;
