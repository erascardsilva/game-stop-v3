const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');


//caminhos
const dbdir = path.join(__dirname, 'db')
const dbpath = path.join(dbdir, 'meu-database.db')

//cria se não existir
if (!fs.existsSync(dbdir)){
  fs.mkdirSync(dbdir, { recursive: true });
}
if (!fs.existsSync(dbpath)){
  fs.writeFile(dbpath, '', (err) => {
    if (err) {
      console.error('Erro ao criar o arquivo de dados:', err.message);
    } else {
      console.log('Arquivo de dados criado com sucesso.');
    }
  })
}
const db = new sqlite3.Database(dbpath, (err) => {
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
