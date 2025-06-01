/**
 * WordCare - AppuntamentoRepository
 */

const { db } = require('../database/Database');

class AppuntamentoRepository {
	async getByPazienteUserId(userId) {
		const query = `
      SELECT a.data, a.ora, p.nome || ' ' || p.cognome AS professionista, 'Appuntamento' AS tipo
      FROM Appuntamento a
      JOIN Paziente pa ON a.paziente = pa.id
      JOIN Professionista p ON a.professionista = p.id
      WHERE pa.user_id = ?
      ORDER BY a.data ASC, a.ora ASC
    `;
		return new Promise((resolve, reject) => {
			db.all(query, [userId], (err, rows) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}

	async getByProfessionistaId(professionalId) {
		const query = `
			SELECT a.*, p.nome AS paziente_nome, p.cognome AS paziente_cognome
			FROM Appuntamento a
			JOIN Paziente p ON a.paziente = p.id
			WHERE a.professionista = ?
		`;
		return new Promise((resolve, reject) => {
			db.all(query, [professionalId], (err, rows) => {
			if (err) return reject(err);
			resolve(rows);
			});
		});
		}

	async getProssimoAppuntamento(userId) {
		const sql = `
			SELECT 
				a.data, a.ora, a.sede, p.nome || ' ' || p.cognome AS professionista
			FROM Appuntamento a
			INNER JOIN Professionista p ON a.professionista = p.id
			WHERE a.paziente = ?
				AND datetime(a.data || 'T' || a.ora) >= datetime('now')
			ORDER BY a.data ASC, a.ora ASC
			LIMIT 1;
		`;

		return new Promise((resolve, reject) => {
			db.get(sql, [userId], (err, row) => {
				if (err) {
					console.error('Errore getProssimoAppuntamento:', err);
					return reject(err);
				}
				resolve(row);
			});
		});
	}

	async crea({ paziente_id, data, ora, sede, professionalId }) {
		const query = `
			INSERT INTO Appuntamento (paziente, professionista, data, ora, sede)
			VALUES (?, ?, ?, ?, ?)
		`;
		return new Promise((resolve, reject) => {
			db.run(query, [paziente_id, professionalId, data, ora, sede], function (err) {
			if (err) return reject(err);
			resolve(this.lastID);
			});
		});
		}

	async elimina(id) {
		const query = `DELETE FROM appuntamento WHERE id = ?`;
		return new Promise((resolve, reject) => {
			db.run(query, [id], function (err) {
				if (err) return reject(err);
				resolve(this.changes);
			});
		});
	}
}

module.exports = new AppuntamentoRepository();
