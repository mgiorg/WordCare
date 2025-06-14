/**
 * WordCare - PatientRoutes.js
 */

const express = require('express');
const PatientController = require('../controllers/PatientController');
const Behavior = require('../models/enums/ProfileBehavior');
const AppuntamentoRepository = require('../repositories/AppuntamentoRepository');
const { VERSION_NUMBER } = require('sqlite3');

const path = require('path');
const viewsPath = path.join(__dirname, '../../public/views');

const router = express.Router();

// Middleware di protezione per utenti con ruolo "PATIENT"
function VerifyPatientSession(req, res, next) {
	console.log("SESSION DEBUG", req.session);
	if (req.session.userId && req.session.userRole === Behavior.Patient) {
		return next();
	}
	// Redirect alla pagina di errore con query string
	const params = new URLSearchParams({
		code: '401',
		title: 'Accesso negato',
		message: 'Non hai i permessi per accedere a questa risorsa.',
		returnUrl: '/login'
	});

	return res.redirect(`/error.html?${params.toString()}`);
}

// Dashboard paziente
router.get('/paziente', VerifyPatientSession, (req, res) => PatientController.Patient(req, res));

router.get('/paziente/agenda', VerifyPatientSession, (req, res) => {
	res.sendFile(path.join(viewsPath, '/Paziente/agenda.html'));
});

router.get("/paziente/profilo", VerifyPatientSession, (req, res) => {
	res.sendFile(path.join(viewsPath, '/Paziente/profilo.html'));
});

router.get('/paziente/professionista-in-cura', VerifyPatientSession, (req, res) => {
	PatientController.getProfessionistaInCura(req, res)
});

router.get("/paziente/esercizi", VerifyPatientSession, (req, res) => {
	res.sendFile(path.join(viewsPath, '/DashBoardGiochi/DashBoardGiochi.html'));
});

router.get('/paziente/appuntamenti', VerifyPatientSession, async (req, res) => {
	try {
		const appuntamenti = await AppuntamentoRepository.getByPazienteUserId(req.session.userId);
		res.json(appuntamenti);
	} catch (err) {
		console.error("Errore recupero appuntamenti:", err);
		res.status(500).json({ error: 'Errore interno' });
	}
});

router.get('/paziente/prossimo-appuntamento', VerifyPatientSession, async (req, res) => {
	try {
		const userId = req.session.userId; // o req.user.id, secondo come gestisci la sessione
		if (!userId) {
			const params = new URLSearchParams({
				code: '401',
				title: 'Accesso negato',
				message: 'Non hai i permessi per accedere a questa risorsa.',
				returnUrl: '/login'
			});

			return res.redirect(`/error.html?${params.toString()}`);
		}

		const app = await AppuntamentoRepository.getProssimoAppuntamento(userId);
		res.json(app || null);
	} catch (err) {
		console.error('Errore recupero prossimo appuntamento:', err);
		const params = new URLSearchParams({
			code: '401',
			title: 'Accesso negato',
			message: 'Non hai i permessi per accedere a questa risorsa.',
			returnUrl: '/login'
		});

		return res.redirect(`/error.html?${params.toString()}`);
	}
});

module.exports = router;