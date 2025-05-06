/**
 * WordCare - Database.js
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Initialize SQLite database connection using the specified file
const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
	// Log error if connection fails
	if (err) {
		console.error("Errore durante la connessione al database:", err.message);
	} else {
		console.log("Connesso al database SQLite.");
	}
});

// Enable foreign key support for relational integrity
db.run("PRAGMA foreign_keys = ON");

// Function to initialize the database schema (create tables if not exist)
function initDb() {
	db.serialize(() => {
		// Creazione della tabella 'User'
		db.run(`
			CREATE TABLE IF NOT EXISTS User (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				email TEXT NOT NULL UNIQUE,
				username TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				behavior TEXT NOT NULL, -- "PATIENT", "PROFESSIONAL", ecc.
				bio TEXT,
				avatarUrl TEXT,
				city TEXT,
				country TEXT,
				phone TEXT,
				lastVisit TEXT,
				clinicName TEXT,
				licenseNumber TEXT
			)
		`);
		// --- Entità Paziente
		db.run(`
			CREATE TABLE IF NOT EXISTS Paziente (
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  nome TEXT NOT NULL,
			  cognome TEXT NOT NULL,
			  eta INTEGER NOT NULL CHECK(eta >= 0 AND eta <= 150),
			  patologia TEXT NOT NULL
			  data_nascita DATE NOT NULL,
			  FOREIGN KEY(id) REFERENCES User(id) ON DELETE CASCADE
			);
		`);

		// --- Entità Professionista
		db.run(`
			CREATE TABLE IF NOT EXISTS Professionista (
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  nome TEXT NOT NULL,
			  cognome TEXT NOT NULL,
			  data_nascita DATE NOT NULL,
			  specializzazione TEXT NOT NULL,
			  sede TEXT NOT NULL
			  FOREIGN KEY(id) REFERENCES User(id) ON DELETE CASCADE
			);
		`);

		// --- Relazione in_cura (M:N Paziente - Professionista)
		db.run(`
			CREATE TABLE IF NOT EXISTS in_cura (
			  paziente_id INTEGER NOT NULL,
			  professionista_id INTEGER NOT NULL,
			  data_nascita DATE NOT NULL,
			  PRIMARY KEY(paziente_id, professionista_id),
			  FOREIGN KEY(paziente_id) REFERENCES Paziente(id) ON DELETE CASCADE,
			  FOREIGN KEY(professionista_id) REFERENCES Professionista(id) ON DELETE CASCADE
			);
		`);

		// --- Entità Promemoria
		db.run(`
			CREATE TABLE IF NOT EXISTS Promemoria (
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  data DATE NOT NULL,
			  ora_notifica TIME NOT NULL,
			  nota TEXT NOT NULL
			);
		`);

		// --- Relazione post_it (M:N Professionista - Promemoria)
		db.run(`
			CREATE TABLE IF NOT EXISTS post_it (
			  professionista_id INTEGER NOT NULL,
			  promemoria_id INTEGER NOT NULL,

			  PRIMARY KEY(professionista_id, promemoria_id),
			  FOREIGN KEY(professionista_id) REFERENCES Professionista(id) ON DELETE CASCADE,
			  FOREIGN KEY(promemoria_id) REFERENCES Promemoria(id) ON DELETE CASCADE
			);
		`);

		// --- Relazione Appuntamento (Paziente - Professionista) con attributi
		db.run(`
			CREATE TABLE IF NOT EXISTS Appuntamento (
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  paziente_id INTEGER NOT NULL,
			  professionista_id INTEGER NOT NULL,
			  data DATE NOT NULL,
			  ora TIME NOT NULL,
			  sede TEXT NOT NULL,

			  FOREIGN KEY(paziente_id) REFERENCES Paziente(id) ON DELETE CASCADE,
			  FOREIGN KEY(professionista_id) REFERENCES Professionista(id) ON DELETE CASCADE,
			  UNIQUE(paziente_id, professionista_id, data, ora)
			);
		`);

		// --- Entità Gioco
		db.run(`
			CREATE TABLE IF NOT EXISTS Gioco (
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  nome TEXT NOT NULL UNIQUE,
			  punteggio INTEGER NOT NULL CHECK(punteggio >= 0),
			  tipologia TEXT NOT NULL
			);
		`);

		// --- Relazione Assegnazione (Paziente - Professionista - Gioco) con attributi
		db.run(`
			CREATE TABLE IF NOT EXISTS Assegnazione (
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  paziente_id INTEGER NOT NULL,
			  professionista_id INTEGER NOT NULL,
			  gioco_id INTEGER NOT NULL,
			  scadenza DATE NOT NULL,
			  num_ripetizioni INTEGER NOT NULL CHECK(num_ripetizioni >= 1),
			  svolto INTEGER NOT NULL CHECK(svolto IN (0,1)),

			  FOREIGN KEY(paziente_id) REFERENCES Paziente(id) ON DELETE CASCADE,
			  FOREIGN KEY(professionista_id) REFERENCES Professionista(id) ON DELETE CASCADE,
			  FOREIGN KEY(gioco_id) REFERENCES Gioco(id) ON DELETE RESTRICT,
			  UNIQUE(paziente_id, professionista_id, gioco_id)
			);
		`);

		console.log("Tabelle inizializzate o già esistenti.");
	
	});
}

module.exports = {
	db,
	initDb,
};
