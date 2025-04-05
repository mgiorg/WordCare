/**
 * WordCare - UserLoginRepository.js
 */
const { db } = require('../database/Database');
const { randomUUID } = require('crypto');
const UserLogin = require('../models/UserLogin');

class UserLoginRepository {
	/**
	 * Crea un nuovo utente nel database.
	 * @param {string} nome - Nome dell'utente.
	 * @param {string} cognome - Cognome dell'utente.
	 * @param {string} email - Email dell'utente.
	 * @param {string} username - Nome utente.
	 * @param {string} password - Password dell'utente.
	 * @param {string} profileGuid - GUID del profilo (opzionale).
	 * @returns {Promise<number>} ID dell'utente creato.
   */
	async createUser(name, surname, email, username, password, profileGuid = randomUUID()) {
		const query = `
      INSERT INTO UserLogin (name, surname, email, username, password, profileGuid)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

		return new Promise((resolve, reject) => {
			db.run(query, [name, surname, email, username, password, profileGuid], function (err) {
				if (err) return reject(err);
				resolve(this.lastID);
			});
		});
	}

	/**
	 * Trova un utente in base al nome utente.
	 * @param {string} username - Nome utente.
	 * @returns {Promise<UserLogin|null>} L'oggetto UserLogin se trovato, altrimenti null.
	 */
	async findUserByUsername(username) {
		const query = `SELECT * FROM UserLogin WHERE username = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [username], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new UserLogin(row.id, row.name, row.surname, row.email, row.username, row.password, row.profileGuid);
				resolve(user);
			});
		});
	}

	/**
	 * Trova un utente in base all'ID.
	 * @param {number} id - ID dell'utente.
	 * @returns {Promise<UserLogin|null>} L'oggetto UserLogin se trovato, altrimenti null.
	 */
	async findById(id) {
		const query = `SELECT * FROM UserLogin WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [id], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new UserLogin(row.id, row.name, row.surname, row.email, row.username, row.password, row.profileGuid);
				resolve(user);
			});
		});
	}

	/**
	 * Elimina un utente nel database.
	 * @param {number} id - ID dell'utente da eliminare.
	 * @param {Object} userData - Dati dell'utente da eliminare.
	 * @returns {Promise<boolean>} true se l'eliminazione ha avuto successo, altrimenti false.
	 */
	async delete(id) {
		const query = `DELETE FROM UserLogin WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.run(query, [id], function (err) {
				if (err) return reject(err);
				resolve(this.changes > 0);
			});
		});
	}
}

module.exports = new UserLoginRepository();