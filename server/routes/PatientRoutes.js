/**
 * WordCare - PatientRoutes.js
 */

const express = require('express');
const PatientController = require('../controllers/PatientController');
const Behavior = require('../models/enums/ProfileBehavior');

const router = express.Router();

// Middleware di protezione per utenti con ruolo "PATIENT"
function VerifyPatientSession(req, res, next) {
	console.log("SESSION DEBUG", req.session);
	if (req.session.userId && req.session.userRole === Behavior.Patient) {
		return next();
	}
	return res.redirect('/login');
}

// Dashboard paziente
router.get('/paziente', VerifyPatientSession, (req, res) => PatientController.Patient(req, res));

// In futuro potrai aggiungere:
// router.get('/profilo', onlyLoggedPatients, PatientController.profile);
// router.post('/esercizi', onlyLoggedPatients, PatientController.saveExerciseData);

module.exports = router;