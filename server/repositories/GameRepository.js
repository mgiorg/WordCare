// repositories/GameRepository.js
const { db } = require('../database/Database');

class GameRepository {
	/**
	 * Restituisce il numero di esercizi svolti da un determinato utente
	 * @param {number} userId
	 * @returns {Promise<number>}
	 */
	async countEserciziSvolti(userId) {
		const query = `
			SELECT COUNT(*) AS totale
			FROM Assegnazione AS a
			JOIN Paziente AS p ON a.paziente = p.id
			WHERE p.user_id = ? AND a.svolto = 1
		`;

		return new Promise((resolve, reject) => {
			db.get(query, [userId], (err, row) => {
				if (err) return reject(err);
				resolve(row?.totale || 0);
			});
		});
	}

	async getAllEserciziByUser(userId) {
		const query = `
			SELECT 
				a.id AS assegnazione_id,
				g.nome,
				g.tipologia,
				-- Se prevedi di usare immagini per i giochi, aggiungile qui
				g.note,
				a.scadenza,
				a.ripetizioni_assegnate,
				a.ripetizioni_svolte,
				a.punteggio,
				a.svolto
			FROM Assegnazione a
			JOIN Paziente p ON a.paziente = p.id
			JOIN Gioco g ON a.gioco = g.id
			WHERE p.user_id = ?
			ORDER BY a.svolto ASC, g.nome ASC
		`;
	
		return new Promise((resolve, reject) => {
			db.all(query, [userId], (err, rows) => {
				if (err) return reject(err);
				resolve(rows);
			});
		});
	}
}

module.exports = new GameRepository();