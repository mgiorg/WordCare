// File: models/AgendaRepository.js

const { db } = require('../database/Database');
const AgendaEntry = require('../models/AgendaEntry');

/**
 * Repository per la gestione delle note in Agenda
 */
class AgendaRepository {
	/**
	 * Restituisce tutte le note del paziente.
	 * @param {number} pazienteId
	 * @returns {Promise<AgendaEntry[]>}
	 */
	async findByPatientId(pazienteId) {
		const sql = `
      SELECT id, paziente, data, titolo, note, segnalazione
      FROM Agenda
      WHERE paziente = ?
      ORDER BY data ASC, id ASC
    `;

		return new Promise((resolve, reject) => {
			db.all(sql, [pazienteId], (err, rows) => {
				if (err) return reject(err);
				const entries = rows.map(row => AgendaEntry.fromRow(row));
				resolve(entries);
			});
		});
	}

	/**
	 * Inserisce una nuova nota per il paziente.
	 * @param {AgendaEntry|Object} entry - Oggetto AgendaEntry o POJO con { paziente, data, titolo, note, segnalazione }
	 * @returns {Promise<AgendaEntry>} L'istanza salvata con id valorizzato
	 */
	async create(entry) {
		const agendaEntry = entry instanceof AgendaEntry
			? entry
			: new AgendaEntry(entry);

		const sql = `
      INSERT INTO Agenda (paziente, data, titolo, note, segnalazione)
      VALUES (?, ?, ?, ?, ?)
    `;

		return new Promise((resolve, reject) => {
			db.run(sql, agendaEntry.toDbParams(), function (err) {
				if (err) return reject(err);
				// this.lastID è l'id generato da SQLite
				const saved = new AgendaEntry({
					id: this.lastID,
					paziente: agendaEntry.paziente,
					data: agendaEntry.data,
					titolo: agendaEntry.titolo,
					note: agendaEntry.note,
					segnalazione: agendaEntry.segnalazione
				});
				resolve(saved);
			});
		});
	}

	/**
	 * Elimina tutte le note di un paziente per una data specifica.
	 * @param {number} pazienteId
	 * @param {string} date - Formato 'YYYY-MM-DD'
	 * @returns {Promise<number>} Numero di righe cancellate
	 */
	async deleteByDate(pazienteId, date) {
		const sql = `DELETE FROM Agenda WHERE paziente = ? AND data = ?`;
		return new Promise((resolve, reject) => {
			db.run(sql, [pazienteId, date], function (err) {
				if (err) return reject(err);
				resolve(this.changes);
			});
		});
	}

	/**
 * Aggiorna una nota esistente.
 * @param {Object|AgendaEntry} entry - Deve contenere { id, paziente, data, titolo, note, segnalazione }
 * @returns {Promise<AgendaEntry>}
 */
	async update(entry) {
		const agendaEntry = entry instanceof AgendaEntry
			? entry
			: new AgendaEntry(entry);
		const sql = `
      UPDATE Agenda
      SET titolo = ?, note = ?, segnalazione = ?
      WHERE id = ? AND paziente = ?
    `;
		const params = [
			agendaEntry.titolo,
			agendaEntry.note,
			agendaEntry.segnalazione ? 1 : 0,
			agendaEntry.id,
			agendaEntry.paziente
		];
		return new Promise((resolve, reject) => {
			db.run(sql, params, function (err) {
				if (err) return reject(err);
				// restituisco l’entrata aggiornata
				resolve(agendaEntry);
			});
		});
	}

	/**
	 * Elimina una nota per ID (solo se appartiene al paziente)
	 * @param {number} pazienteId
	 * @param {number} noteId
	 * @returns {Promise<number>} numero di record cancellati
	 */
	async deleteById(pazienteId, noteId) {
		const sql = `
      DELETE FROM Agenda
      WHERE id = ? AND paziente = ?
    `;
		return new Promise((resolve, reject) => {
			db.run(sql, [noteId, pazienteId], function (err) {
				if (err) return reject(err);
				resolve(this.changes);
			});
		});
	}
}

module.exports = new AgendaRepository();
