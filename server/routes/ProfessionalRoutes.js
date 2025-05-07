/**
 * WordCare - ProfessionalRoutes.js
 * versione provvisoria da correggere e finire
 */

const express = require('express');
const ProfessionalController = require('../controllers/ProfessionalController');
const Behavior = require('../models/enums/ProfileBehavior');
const path=require('path');

const router = express.Router();

// Middleware di protezione per utenti con ruolo "PROFESSIONAL"
function VerifyProfessionalSession(req, res, next) {
	if (req.session.userId && req.session.userRole === Behavior.Professional) {
		return next();
	}
	return res.redirect('/login');
}

// Dashboard
router.get('/', (req, res) => {
	res.sendFile(path.join(public/professionista/homeprof/homeprof.html, '..', 'public', 'professional', 'homeprof.html'));
  });
  
  // Pazienti
  router.get('/pazienti', controller.listPazienti);
  router.get('/pazienti/:id', controller.dettaglioPaziente);
  
  // Appuntamenti
  router.get('/appuntamenti', controller.listaAppuntamenti);
  router.post('/appuntamenti', controller.creaAppuntamento);
  router.post('/appuntamenti/:id/elimina', controller.eliminaAppuntamento);
  
  // Giochi
  router.get('/giochi', controller.listaGiochi);
  router.post('/assegnazioni', controller.assegnaGioco);
  
  // Promemoria
  router.get('/promemoria', controller.listaPromemoria);
  router.post('/promemoria', controller.creaPromemoria);
  
  module.exports = router;