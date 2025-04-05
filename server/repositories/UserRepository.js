/**
 * WordCare - UserRepository.js
 */

const { insertUser, getUserByUsernameAndPassword } = require('../database/Database');
const User = require('../models/User');

class UserRepository {
	// Retrieves all users from the database
	async FindAll() {
		return await User.find();
	}

	// Retrieves a user by ID from the database
	async GetById(id) {
		return await User.findById(id);
	}

	// Creates a new user and saves it to the database
	async create(userData) {
		const user = new User(userData);
		return await user.save();
	}

	// Updates an existing user by ID in the database
	async update(id, userData) {
		return await User.findbuIdAndUpdate(id, userData, { new: true });
	}

	// Deletes a user by ID from the database
	async delete(id) {
		return await User.findByIdAndDelete(id);
	}

	// Inserts a new user into the SQLite database using raw SQL query
	async createUser(nome, cognome, email, username, password) {
		const query = `
		  INSERT INTO users (nome, cognome, email, username, password)
		  VALUES (?, ?, ?, ?, ?)
		`;
		return new Promise((resolve, reject) => {
			db.run(query, [nome, cognome, email, username, password], function (err) {
				if (err) return reject(err);
				resolve(this.lastID);
			});
		});
	}

	// Finds a user by username and password from the SQLite database using raw SQL
	async findUserByUsernameAndPassword(username, password) {
		const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
		return new Promise((resolve, reject) => {
			db.get(query, [username, password], (err, row) => {
				if (err) return reject(err);
				if (!row) return resolve(null);
				const user = new User(row.id, row.nome, row.cognome, row.email, row.username, row.password);
				resolve(user);
			});
		});
	}
}

module.exports = new UserRepository();
