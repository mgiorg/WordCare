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
		// Create 'UserLogin' table with necessary constraints
		db.run(`
			CREATE TABLE IF NOT EXISTS UserLogin (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,       -- Corretto da "nome" a "name"
				surname TEXT NOT NULL,    -- Corretto da "cognome" a "surname"
				email TEXT NOT NULL UNIQUE,
				username TEXT NOT NULL UNIQUE,
				password TEXT NOT NULL,
				profileGuid TEXT NOT NULL UNIQUE
			)
		`);

		// Create 'UserProfile' table with foreign key reference to 'UserLogin'
		db.run(`
      		CREATE TABLE IF NOT EXISTS UserProfile (
				profileGuid TEXT PRIMARY KEY,
				behavior TEXT NOT NULL,
				bio TEXT,
				avatarUrl TEXT,
				city TEXT,
				country TEXT,
				phone TEXT,
				birthDate TEXT,
				lastVisit TEXT,
				specialization TEXT,
				clinicName TEXT,
				licenseNumber TEXT,
  				FOREIGN KEY (profileGuid) REFERENCES UserLogin(profileGuid) ON DELETE CASCADE			
			)
    	`);
	});
}

module.exports = {
	db,
	initDb,
};
