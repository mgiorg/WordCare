/**
 * WordCare - AuthController
 */

const bcrypt = require('bcrypt');
const loginRepository = require('../repositories/UserLoginRepository');
const profileRepository = require('../repositories/UserProfileRepository');
const Behavior = require('../models/enums/ProfileBehavior');

class AuthController {
	// LOGIN PAZIENTE
	async login(req, res) {
		const { username, password } = req.body;

		try {
			const user = await loginRepository.findUserByUsername(username);

			if (!user)
				return res.status(401).sendFile('views/error404.html', { root: 'public' })

			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch)
				return res.status(401).sendFile('views/error404.html', { root: 'public' })

			// Imposta la sessione
			req.session.userId = user.id;
			req.session.userRole = Behavior.Patient;
			req.session.userName = user.name; // Assicurati che "user.name" sia corretto

			// Verifica se il profilo esiste già
			const profile = await profileRepository.getByGuid(user.profileGuid);
			if (!profile) {
				await profileRepository.createEmptyProfile(user.profileGuid, Behavior.Patient);
			}

			// Reindirizza alla dashboard del paziente
			return res.redirect('/paziente');
		} catch (err) {
			console.error('Errore durante il login:', err.message);
			return res.status(500).sendFile('views/error404.html', { root: 'public' });
		}
	}

	// REGISTRAZIONE PAZIENTE
	async register(req, res) {
		const { name, surname, email, username, password } = req.body;
		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			await loginRepository.createUser(name, surname, email, username, hashedPassword);

			// Reindirizza alla dashboard del paziente
			return res.redirect('/paziente');
		} catch (err) {
			if (err.message.includes('UNIQUE'))
				return res.status(400).sendFile('views/error404.html', { root: 'public' });

			console.error("Errore durante la registrazione:", err.message);
			return res.status(500).sendFile('views/error404.html', { root: 'public' });
		}
	}

	// LOGOUT
	logout(req, res) {
		req.session.destroy(err => {
			if (err) {
				return res.status(500).sendFile('views/error404.html', { root: 'public' });
			}
			res.redirect('/login');
		});
	}
}

module.exports = new AuthController();