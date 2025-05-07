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
				return res.status(404).send('User not found');
			}

			// Renderizza la vista del paziente
			res.sendFile(path.join(__dirname, '../../public/views/Paziente/paziente.html'));
		} catch (err) {
			console.error('Error in patient dashboard:', err);
			res.status(500).send('Internal Server Error');
		}
	}

	async getPatientDashboard(req, res) {
		try {
			const userId = req.user.id; // Supponendo che l'ID utente sia disponibile nel token
			const user = await UserRepository.findById(userId);
			const patient = await PatientRepository.findByUserId(userId);
			if (!user) {
				return res.status(404).json({ message: 'Utente non trovato' });
			}
			if (!patient) {
				return res.status(404).json({ message: 'Paziente non trovato' });
			}

			res.json({
				name: patient.nome,
				surname: patient.cognome,
				behavior: user.behavior
			});
		} catch (error) {
			console.error('Errore nel recupero della dashboard:', error);
			res.status(500).json({ message: 'Errore interno del server' });
		}
	}
}

module.exports = new PatientController();
