/**
 * WordCare - ProfessionalRoutes.js (versione aggiornata)
 */

const express = require('express');
const ProfessionalController = require('../controllers/ProfessionalController');
const Behavior = require('../models/enums/ProfileBehavior');
const path = require('path');

const router = express.Router();

// Middleware di protezione per utenti con ruolo "PROFESSIONAL"
function VerifyProfessionalSession(req, res, next) {
  if (req.session.userId && req.session.userRole === Behavior.Professional) {
    return next();
  }
  return res.redirect('/login');
}

// Dashboard
router.get('/', VerifyProfessionalSession, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'professional', 'homeprof', 'home.html'));
});

// Profilo professionista
router.get('/profilo/view', VerifyProfessionalSession, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'professionista', 'il tuo profilo', 'profilo.html'));
});
router.get('/profilo', VerifyProfessionalSession, ProfessionalController.DatiPersonali);
router.post('/profilo', VerifyProfessionalSession, ProfessionalController.SalvaDatiProfilo);

// Pazienti
router.get('/pazienti', VerifyProfessionalSession, ProfessionalController.listPazienti);
router.post('/pazienti/aggiungi', VerifyProfessionalSession, ProfessionalController.aggiungiPaziente);
router.get('/pazienti/:id', VerifyProfessionalSession, ProfessionalController.dettaglioPaziente);
router.get('/pazienti/:id/view', VerifyProfessionalSession, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'professional', 'paziente.html'));
});

// Appuntamenti
router.get('/agenda', VerifyProfessionalSession, ProfessionalController.listaAppuntamenti);
router.post('/agenda', VerifyProfessionalSession, ProfessionalController.creaAppuntamento);
router.post('/agenda/:id/elimina', VerifyProfessionalSession, ProfessionalController.eliminaAppuntamento);
router.get('/appuntamenti/view', VerifyProfessionalSession, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'professionista', 'calendario', 'calendario.html'));
});

// Giochi
router.get('/giochi', VerifyProfessionalSession, ProfessionalController.listaGiochi);
router.post('/assegnazioni', VerifyProfessionalSession, ProfessionalController.assegnaGioco);

// Promemoria
router.get('/promemoria', VerifyProfessionalSession, ProfessionalController.listaPromemoria);
router.post('/promemoria', VerifyProfessionalSession, ProfessionalController.creaPromemoria);

module.exports = router;
