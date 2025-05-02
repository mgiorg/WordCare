const { db } = require('../database/Database');
const User = require('../models/User');

class UserRepository {
	/**
	 * Trova un utente in base all'ID.
	 * @param {number} id - ID dell'utente.
	 * @returns {Promise<User|null>} L'oggetto User se trovato, altrimenti null.
	 */
	async findUserById(id) {
		const query = `SELECT * FROM User WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [id], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new User(
					row.id,
					row.name,
					row.surname,
					row.email,
					row.username,
					row.password,
					row.behavior,
					row.bio,
					row.avatarUrl,
					row.city,
					row.country,
					row.phone,
					row.birthDate,
					row.lastVisit,
					row.specialization,
					row.clinicName,
					row.licenseNumber
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
					row.name,
					row.surname,
					row.email,
					row.username,
					row.password,
					row.behavior,
					row.bio,
					row.avatarUrl,
					row.city,
					row.country,
					row.phone,
					row.birthDate,
					row.lastVisit,
					row.specialization,
					row.clinicName,
					row.licenseNumber
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
					row.name,
					row.surname,
					row.email,
					row.username,
					row.password,
					row.behavior,
					row.bio,
					row.avatarUrl,
					row.city,
					row.country,
					row.phone,
					row.birthDate,
					row.lastVisit,
					row.specialization,
					row.clinicName,
					row.licenseNumber
				);
				resolve(user);
			});
		});
	}

	/**
	 * Crea un nuovo utente nel database.
	 * @param {User} user - Oggetto utente da creare.
	 * @returns {Promise<number>} ID dell'utente creato.
	 */
	async createUser(user) {
		const query = `
            INSERT INTO User (
                name, surname, email, username, password, behavior, bio, avatarUrl,
                city, country, phone, birthDate, lastVisit, specialization, clinicName, licenseNumber
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

		return new Promise((resolve, reject) => {
			db.run(query, [
				user.name,
				user.surname,
				user.email,
				user.username,
				user.password,
				user.behavior,
				user.bio || null,
				user.avatarUrl || null,
				user.city || null,
				user.country || null,
				user.phone || null,
				user.birthDate || null,
				user.lastVisit || null,
				user.specialization || null,
				user.clinicName || null,
				user.licenseNumber || null
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