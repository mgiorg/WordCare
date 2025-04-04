////////////////////////////////////////////////////////////////////////////
// WordCare
// database.js
//

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connessione al database SQLite
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Errore durante la connessione al database:', err.message);
  } else {
    console.log('Connesso al database SQLite.');
  }
});

// Creazione della tabella utenti (se non esiste)
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

/**
 * Inserisce un nuovo utente nella tabella "users".
 * @param {string} nome
 * @param {string} cognome
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @param {function} callback -> callback(err)
 */
function insertUser(nome, cognome, email, username, password, callback) {
  const query = `
    INSERT INTO users (nome, cognome, email, username, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [nome, cognome, email, username, password], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
}

/**
 * Recupera un utente dalla tabella "users" filtrando per username e password.
 * @param {string} username
 * @param {string} password
 * @param {function} callback -> callback(err, row)
 */
function getUserByUsernameAndPassword(username, password, callback) {
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.get(query, [username, password], (err, row) => {
    if (err) {
      return callback(err);
    }
    callback(null, row);
  });
}

// Esportiamo sia l'istanza di db (se dovesse servire), sia le funzioni
module.exports = {
  db,
  insertUser,
  getUserByUsernameAndPassword
};
