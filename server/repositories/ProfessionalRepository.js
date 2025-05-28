/**
 * WordCare - PatientRepository.js
 */

const { db } = require('../database/Database');
const Profesional = require('../models/Professionista');

class ProfessionalRepository {
	/**
	 * Trova un paziente in base all'ID.
	 * @param {number} id - ID del paziente.
	 * @returns {Promise<Profesional|null>} L'oggetto Patient se trovato, altrimenti null.
	 */
	async findById(id) {
		const query = `SELECT * FROM Professionista WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [id], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new Profesional(
					row.id,
					row.user_id,
					row.nome,
					row.cognome,
					row.data_nascita,
					row.specializzazione,
					row.sede
				);
				resolve(user);
			});
		});
	}

	/**
	 * Trova un paziente in base all'ID.
	 * @param {number} id - ID del paziente.
	 * @returns {Promise<Profesional|null>} L'oggetto Patient se trovato, altrimenti null.
	 */
	async findByUserId(id) {
		const query = `SELECT * FROM Professionista WHERE user_id = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [id], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new Profesional(
					row.id,
					row.user_id,
					row.nome,
					row.cognome,
					row.data_nascita,
					row.specializzazione,
					row.sede
				);
				resolve(user);
			});
		});
	}

	async new(userId, nome, cognome, dataNascita = null, specializzazione = null, sede = null) {
		const query = `INSERT INTO Professionista (user_id, nome, cognome, data_nascita, specializzazione, sede)
					   VALUES (?, ?, ?, ?, ?, ?, ?)`;

		return new Promise((resolve, reject) => {
			db.run(query, [userId, nome, cognome, dataNascita, specializzazione, sede], function (err) {
				if (err) return reject(err);
				resolve(this.lastID);
			});
		});
	}
}

module.exports = new ProfessionalRepository();
