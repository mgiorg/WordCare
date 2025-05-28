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
				// Redirect alla pagina di errore con query string
				const params = new URLSearchParams({
					code: '401',
					title: 'Accesso negato',
					message: 'Le credenziali fornite non sono valide. Nessun utente trovato con questo username.',
					returnUrl: '/login'
				});

				return res.redirect(`/error.html?${params.toString()}`);
			}

			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				// Redirect alla pagina di errore con query string
				const params = new URLSearchParams({
					code: '401',
					title: 'Accesso negato',
					message: 'Le credenziali fornite non sono valide. La password non corrisponde a quella in nostro possesso.',
					returnUrl: '/login'
				});

				return res.redirect(`/error.html?${params.toString()}`);
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
			}
			else {
				// Redirect alla pagina di errore con query string
				const params = new URLSearchParams({
					code: '500',
					title: 'Accesso negato',
					message: 'Il tuo account non ha i permessi per accedere a questa applicazione.',
					returnUrl: '/login'
				});

				return res.redirect(`/error.html?${params.toString()}`);
			}
		} catch (err) {
			console.error('Errore durante il login:', err.message);
			// Redirect alla pagina di errore con query string
			const params = new URLSearchParams({
				code: '500',
				title: 'Errore imprevisto',
				message: 'Si è verificato un errore durante il login. Riprova più tardi.',
				returnUrl: '/login'
			});
			return res.redirect(`/error.html?${params.toString()}`);
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

				req.session.userName = patient.nome;
				req.session.userSurname = patient.cognome;
				req.session.patientId = patient.id;

				// Reindirizza direttamente alla dashboard del paziente
				res.redirect('/paziente');
			}
			else {
				//TODO: Aggiungi la logica per il professionista
			}
		} catch (err) {
			if (err.message.includes('UNIQUE')) {
				// Redirect alla pagina di errore con query string
				const params = new URLSearchParams({
					code: '404',
					title: 'Errore imprevisto',
					message: 'Si è verificato un errore durante la registrazione. Esiste già un utente con la tua mail o il tuo username.',
					returnUrl: '/login'
				});
				return res.redirect(`/error.html?${params.toString()}`);
			}

			console.error('Errore durante la registrazione:', err.message);
			// Redirect alla pagina di errore con query string
			const params = new URLSearchParams({
				code: '400',
				title: 'Errore imprevisto',
				message: 'Si è verificato un errore durante la registrazione. Riprova più tardi.',
				returnUrl: '/login'
			});
			return res.redirect(`/error.html?${params.toString()}`);
		}
	}

	// LOGOUT
	async logout(req, res) {
		req.session.destroy(err => {
			if (err) {
				console.error('Errore durante il logout:', err);
				// Redirect alla pagina di errore con query string
				const params = new URLSearchParams({
					code: '500',
					title: 'Errore nel logout',
					message: 'Si è verificato un errore durante il logout. Riprova più tardi.',
					returnUrl: '/login'
				});
				return res.redirect(`/error.html?${params.toString()}`);
			}
			res.redirect('/login');
		});
	}
}

module.exports = new AuthController();