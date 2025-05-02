/**
 * WordCare - AuthController
 */

const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const Behavior = require('../models/enums/ProfileBehavior');

class AuthController {
	// LOGIN PAZIENTE
	async login(req, res) {
		const { username, password } = req.body;

		try {
			const user = await UserRepository.findUserByUsername(username);

			if (!user) {
				return res.status(401).sendFile('views/error404.html', { root: 'public' });
			}

			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				return res.status(401).sendFile('views/error404.html', { root: 'public' });
			}

			// Imposta la sessione
			req.session.userId = user.id;
			req.session.userRole = user.behavior;
			req.session.userName = user.name;

			// Reindirizza alla dashboard del paziente
			if (user.Behavior === Behavior.Patient) {
				return res.redirect('/paziente');
			}
			else if (user.Behavior === Behavior.Professional) {
				res.redirect('/professionista');
			}
			else return res.status(401).sendFile('views/error404.html', { root: 'public' });
		} catch (err) {
			console.error('Errore durante il login:', err.message);
			res.status(500).sendFile('views/error404.html', { root: 'public' });
		}
	}

	// REGISTRAZIONE PAZIENTE
	async register(req, res) {
		const { name, surname, email, username, password } = req.body;

		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = {
				name,
				surname,
				email,
				username,
				password: hashedPassword,
				behavior: 'PATIENT', // Comportamento predefinito per i pazienti
				bio: null,
				avatarUrl: null,
				city: null,
				country: null,
				phone: null,
				birthDate: null,
				lastVisit: null,
				specialization: null,
				clinicName: null,
				licenseNumber: null
			};

			// Crea l'utente nel database
			const userId = await UserRepository.createUser(newUser);

			// Imposta la sessione per l'utente appena registrato
			req.session.userId = userId;
			req.session.userRole = newUser.behavior;
			req.session.userName = newUser.name;

			// Reindirizza direttamente alla dashboard del paziente
			res.redirect('/paziente');
		} catch (err) {
			if (err.message.includes('UNIQUE')) {
				return res.status(400).sendFile('views/error404.html', { root: 'public' });
			}

			console.error('Errore durante la registrazione:', err.message);
			res.status(500).sendFile('views/error404.html', { root: 'public' });
		}
	}

	// LOGOUT
	async logout(req, res) {
		req.session.destroy(err => {
			if (err) {
				console.error('Errore durante il logout:', err);
				return res.status(500).send('Errore durante il logout');
			}
			res.redirect('/login');
		});
	}
}

module.exports = new AuthController();