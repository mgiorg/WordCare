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
}

module.exports = new AppuntamentoRepository();