////////////////////////////////////////////////////////////////////////////
// WordCare
// userRepository.js
//

const { insertUser, getUserByUsernameAndPassword } = require('../database/database');
const User = require('../models/User');

class UserRepository {
	// Trova un utente in base a username e password
	findUserByUsernameAndPassword(username, password, callback) {
		getUserByUsernameAndPassword(username, password, (err, row) => {
			if (err) {
				return callback(err);
			}
			if (!row) {
				return callback(null, null);
			}
			// Se vuoi restituire un oggetto "User" ben formattato:
			const user = new User(row.id, row.nome, row.cognome, row.email, row.username, row.password);
			callback(null, user);
		});
	}

	// Crea un nuovo utente
	createUser(nome, cognome, email, username, password, callback) {
		insertUser(nome, cognome, email, username, password, (err) => {
			if (err) {
				return callback(err);
			}
			callback(null);
		});
	}
}

module.exports = new UserRepository();
