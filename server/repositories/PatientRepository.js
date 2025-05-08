/**
 * WordCare - PatientRepository.js
 */

const { db } = require('../database/Database');
const Patient = require('../models/Paziente');

class PatientRepository {
	/**
	 * Trova un paziente in base all'ID.
	 * @param {number} id - ID del paziente.
	 * @returns {Promise<Patient|null>} L'oggetto Patient se trovato, altrimenti null.
	 */
	async findById(id) {
		const query = `SELECT * FROM Paziente WHERE id = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [id], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const user = new Patient(
					row.id,
					row.user_id,
					row.nome,
					row.cognome,
					row.eta,
					row.data_nascita,
					row.patologia
				);
				resolve(user);
			});
		});
	}

	/**
	 * Trova un paziente in base all'ID.
	 * @param {number} id - ID del paziente.
	 * @returns {Promise<Patient|null>} L'oggetto Patient se trovato, altrimenti null.
	 */
	async findByUserId(id) {
		const query = `SELECT * FROM Paziente WHERE user_id = ?`;

		return new Promise((resolve, reject) => {
			db.get(query, [id], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const patient = new Patient(
					row.id,
					row.user_id,
					row.nome,
					row.cognome,
					row.eta,
					row.data_nascita,
					row.patologia
				);
				resolve(patient);
			});
		});
	}
}

module.exports = new PatientRepository();
