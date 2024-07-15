const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('meu-database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    nome TEXT,
    pais TEXT,
    objeto TEXT,
    cor TEXT,
    animal TEXT,
    pontos INT
  )`, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela "users" criada ou já existe.');
    }
  });
});

module.exports = db;
