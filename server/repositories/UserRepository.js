const { db } = require('../database/Database');
const User = require('../models/User');

class UserRepository {
	/**
	 * Trova un utente in base all'ID.
	 * @param {number} id - ID dell'utente.
	 * @returns {Promise<User|null>} L'oggetto User se trovato, altrimenti null.
	 */
	async findById(id) {
		const query = `SELECT * FROM User WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [id], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new User(
					row.id,
					row.email,
					row.username,
					row.password,
					row.behavior
				);
				resolve(user);
			});
		});
	}

	/**
	 * Trova un utente in base all'email.
	 * @param {string} email - Email dell'utente.
	 * @returns {Promise<User|null>} L'oggetto User se trovato, altrimenti null.
	 */
	async findUserByEmail(email) {
		const query = `SELECT * FROM User WHERE email = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [email], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new User(
					row.id,
					row.email,
					row.username,
					row.password,
					row.behavior
				);
				resolve(user);
			});
		});
	}

	/**
	 * Trova un utente in base al nome utente.
	 * @param {string} username - Nome utente.
	 * @returns {Promise<User|null>} L'oggetto User se trovato, altrimenti null.
	 */
	async findUserByUsername(username) {
		const query = `SELECT * FROM User WHERE username = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [username], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new User(
					row.id,
					row.email,
					row.username,
					row.password,
					row.behavior
				);
				resolve(user);
			});
		});
	}

	async createUser(user) {
		const query = `
            INSERT INTO User (
                email, username, password, behavior
            ) VALUES (?, ?, ?, ?)
        `;

		return new Promise((resolve, reject) => {
			db.run(query, [
				user.email,
				user.username,
				user.password,
				user.behavior
			], function (err) {
				if (err) return reject(err);
				resolve(this.lastID);
			});
		});
	}

	/**
	 * Aggiorna i dati di un utente.
	 * @param {number} id - ID dell'utente da aggiornare.
	 * @param {Object} updates - Oggetto contenente i campi da aggiornare.
	 * @returns {Promise<boolean>} true se l'aggiornamento è riuscito, false altrimenti.
	 */
	async updateUser(id, updates) {
		const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
		const values = Object.values(updates);

		const query = `UPDATE User SET ${fields} WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.run(query, [...values, id], function (err) {
				if (err) return reject(err);
				resolve(this.changes > 0);
			});
		});
	}

	/**
	 * Elimina un utente dal database.
	 * @param {number} id - ID dell'utente da eliminare.
	 * @returns {Promise<boolean>} true se l'utente è stato eliminato, false altrimenti.
	 */
	async deleteUser(id) {
		const query = `DELETE FROM User WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.run(query, [id], function (err) {
				if (err) return reject(err);
				resolve(this.changes > 0);
			});
		});
	}
}

module.exports = new UserRepository();