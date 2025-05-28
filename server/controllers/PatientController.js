/**
 * WordCare - PatientController.js
 */

const UserRepository = require('../repositories/UserRepository');
const PatientRepository = require('../repositories/PatientRepository');
const Behavior = require('../models/enums/ProfileBehavior');
const path = require('path');

class PatientController {
	// Managing the flow of the patient dashboard
	// Route: /paziente
	async Patient(req, res) {
		try {
			// Trova l'utente tramite l'ID della sessione
			const userId = req.session.userId;
			const user = await UserRepository.findById(userId);
			if (!user) {
				// Redirect alla pagina di errore con query string
				const params = new URLSearchParams({
					code: '404',
					title: 'Utente non trovato',
					message: "Si è verificato un errore: l'utente non è stato trovato.",
					returnUrl: '/login'
				});
				return res.redirect(`/error.html?${params.toString()}`);
			}

			// Renderizza la vista del paziente
			res.sendFile(path.join(__dirname, '../../public/views/Paziente/paziente.html'));
		} catch (err) {
			console.error('Error in patient dashboard:', err);
			// Redirect alla pagina di errore con query string
			const params = new URLSearchParams({
				code: '500',
				title: 'Errore interno del server',
				message: "Si è verificato un errore durante il recupero della dashboard del paziente.",
				returnUrl: '/login'
			});
			return res.redirect(`/error.html?${params.toString()}`);
		}
	}

	async getPatientDashboard(req, res) {
		try {
			const userId = req.user.id; // Supponendo che l'ID utente sia disponibile nel token
			const user = await UserRepository.findById(userId);
			const patient = await PatientRepository.findByUserId(userId);
			if (!user) {
				// Redirect alla pagina di errore con query string
				const params = new URLSearchParams({
					code: '404',
					title: 'Utente non trovato',
					message: "Si è verificato un errore: l'utente non è stato trovato.",
					returnUrl: '/login'
				});
				return res.redirect(`/error.html?${params.toString()}`);
			}
			if (!patient) {
				// Redirect alla pagina di errore con query string
				const params = new URLSearchParams({
					code: '404',
					title: 'Paziente non trovato',
					message: "Si è verificato un errore: non è stato trovato un profilo paziente associato alle tue credenziali.",
					returnUrl: '/login'
				});
				return res.redirect(`/error.html?${params.toString()}`);
			}

			res.json({
				name: patient.nome,
				surname: patient.cognome,
				behavior: user.behavior
			});
		} catch (error) {
			console.error('Errore nel recupero della dashboard:', error);
			// Redirect alla pagina di errore con query string
			const params = new URLSearchParams({
				code: '500',
				title: 'Errore interno del server',
				message: "Si è verificato un errore durante il recupero della dashboard del paziente.",
				returnUrl: '/login'
			});
			return res.redirect(`/error.html?${params.toString()}`);
		}
	}
}

module.exports = new PatientController();
