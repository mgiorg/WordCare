/**
 * WordCare - AuthController
 */

const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const PatientRepository = require('../repositories/PatientRepository');
const Behavior = require('../models/enums/ProfileBehavior');
const patientRoutes = require('../routes/PatientRoutes');
const Paziente = require('../models/Paziente');

class AuthController {
	// LOGIN PAZIENTE
	async login(req, res) {
		const { username, password } = req.body;

		try {
			const user = await UserRepository.findUserByUsername(username);

			if (!user) {
				req.session.errorInfo = {
					code: 401,
					title: 'Utente non trovato',
					message: `Username "${username}" non esiste`,
					returnUrl: '/login'
				};
				return res.redirect('/views/error404.html');
			}

			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				req.session.errorInfo = {
					code: 401,
					title: 'Password errata',
					message: 'La password inserita non è corretta',
					returnUrl: '/login'
				};
				return res.redirect('/views/error404.html');
			}

			// Imposta la sessione
			req.session.userId = user.id;
			req.session.userRole = user.behavior;

			// Reindirizza alla dashboard del paziente
			if (user.behavior === Behavior.Patient) {
				const patient = await PatientRepository.findByUserId(user.id);
				req.session.patientId = patient.id;
				req.session.userName = patient.nome;
				req.session.userSurname = patient.cognome;
				return res.redirect('/paziente');
			}
			else if (user.behavior === Behavior.Professional) {
				//TODO: Implementare la sessione con tutti i dati del professionista
				res.redirect('/profilo');
			}
			else return res.status(401).sendFile('views/error404.html', { root: 'public' });
		} catch (err) {
			console.error('Errore durante il login:', err.message);
			res.status(500).sendFile('views/error404.html', { root: 'public' });
		}
	}

	// REGISTRAZIONE
	async register(req, res) {
		const { name, surname, email, username, password, userType } = req.body;

		try {
			const hashedPassword = await bcrypt.hash(password, 10);
			const behavior = userType === 'professional' ? Behavior.Professional : Behavior.Patient;
			const newUser = {
				email,
				username,
				password: hashedPassword,
				behavior: behavior,
			};

			// Crea l'utente nel database
			const userId = await UserRepository.createUser(newUser);

			if (newUser.behavior === Behavior.Patient) {
				const patient = {
					user_id: userId,
					nome: name,
					cognome: surname,
					data_nascita: null,
					patologia: null,
				};
				const patientId = await PatientRepository.new(patient);
				// Imposta la sessione per l'utente appena registrato
				req.session.userId = userId;
				req.session.userRole = newUser.behavior;
				req.session.patientId = patientId;

				// Reindirizza direttamente alla dashboard del paziente
				res.redirect('/paziente');
			}
			else {

			}
		} catch (err) {
			if (err.message.includes('UNIQUE')) {
				return res.status(400).sendFile('views/error404.html', { root: 'public' });
			}

			console.error('Errore durante la registrazione:', err.message);
			res.status(500).sendFile('views/error404.html', { root: 'public' });
			return;
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