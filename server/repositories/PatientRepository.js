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
					row.data_nascita,
					row.patologia
				);
				resolve(patient);
			});
		});
	}

	async new(patient) {
		const query = `INSERT INTO Paziente (user_id, nome, cognome, data_nascita, patologia)
					   VALUES (?, ?, ?, ?, ?)`;

		return new Promise((resolve, reject) => {
			db.run(query, [patient.user_id, patient.nome, patient.cognome, patient.data_nascita, patient.patologia], function (err) {
				if (err) return reject(err);
				resolve(this.lastID);
			});
		});
	}

	/**
	 * Aggiorna i dati anagrafici del paziente.
	 * @param {number} userId - ID dell'utente associato.
	 * @param {Object} data - Oggetto contenente nome, cognome, data_nascita, patologia.
	 * @returns {Promise<void>}
	 */
	async updateByUserId(userId, data) {
		const query = `
			UPDATE Paziente
			SET nome = ?, cognome = ?, data_nascita = ?, patologia = ?
			WHERE user_id = ?
		`;

		return new Promise((resolve, reject) => {
			db.run(query, [
				data.nome,
				data.cognome,
				data.data_nascita,
				data.patologia,
				userId
			], function (err) {
				if (err) return reject(err);
				resolve();
			});
		});
	}

	async getNomeProfessionistaInCura(userId) {
		const query = `SELECT p.nome, p.cognome
					   FROM Paziente pa
					   JOIN InCura ic ON pa.id = ic.paziente
					   JOIN Professionista p ON ic.professionista = p.id
					   WHERE pa.user_id = ? AND ic.data_fine IS NULL`;

		return new Promise((resolve, reject) => {
			db.get(query, [userId], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);
				resolve(`${row.nome} ${row.cognome}`);
			});
		});
	}

	async getUltimaVisita(userId) {
		const query = `
		SELECT a.data
		FROM Paziente pa
		JOIN InCura ic ON pa.id = ic.paziente
		JOIN Appuntamento a ON a.paziente = pa.id AND a.professionista = ic.professionista
		WHERE pa.user_id = ?
		AND ic.data_fine IS NULL
		AND a.data <= DATE('now')
		ORDER BY a.data DESC
		LIMIT 1
	`;
		return new Promise((resolve, reject) => {
			db.get(query, [userId], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);

				const [year, month, day] = row.data.split('-'); // '2025-05-28' → ['2025', '05', '28']
				const formattedDate = `${day}-${month}-${year}`; // → '28/05/2025'

				resolve(formattedDate);
			});
		});
	}
}

module.exports = new PatientRepository();