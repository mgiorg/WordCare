/**
 * WordCare - ProfessionalRoutes.js
 */

const express = require('express');
const ProfessionalController = require('../controllers/ProfessionalController');
const Behavior = require('../models/enums/ProfileBehavior');

const router = express.Router();

// Middleware di protezione per utenti con ruolo "PROFESSIONAL"
function VerifyProfessionalSession(req, res, next) {
	if (req.session.userId && req.session.userRole === Behavior.Professional) {
		return next();
	}
	return res.redirect('/login');
}

// Dashboard professionista
router.get('/', VerifyProfessionalSession, (req, res) => ProfessionalController.Professional(req, res));

module.exports = router;