/**
 * WordCare - Database.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database connection using the specified file
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  // Log error if connection fails
  if (err) {
    console.error('Errore durante la connessione al database:', err.message);
  } else {
    console.log('Connesso al database SQLite.');
  }
});

// Enable foreign key support for relational integrity
db.run('PRAGMA foreign_keys = ON');

// Function to initialize the database schema (create tables if not exist)
function initDb() {
  db.serialize(() => {
    // Create 'users' table with necessary constraints
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
  });
}

module.exports = {
  db,
  initDb
};

