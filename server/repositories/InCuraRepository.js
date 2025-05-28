const { db } = require('../database/Database');

class InCuraRepository {
	async findActiveByPazienteId(pazienteId) {
		const query = `SELECT * FROM InCura WHERE paziente = ? AND data_fine IS NULL`;
		return new Promise((resolve, reject) => {
			db.get(query, [pazienteId], (err, row) => {
				if (err) return reject(err);
				if (!row) return reject(new Error("Nessun professionista attivo trovato"));
				resolve(row);
			});
		});
	}
}

module.exports = new InCuraRepository();