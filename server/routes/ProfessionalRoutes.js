/**
 * WordCare - ProfessionalRoutes.js
 * versione provvisoria da correggere e finire
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
router.get('/', (req, res) => {
  res.sendFile(path.join(public / professionista / homeprof / homeprof.html, '..', 'public', 'professional', 'homeprof.html'));
});

// Pazienti
router.get('/pazienti', ProfessionalController.listPazienti);
router.get('/pazienti/:id', ProfessionalController.dettaglioPaziente);

// Appuntamenti
router.get('/appuntamenti', ProfessionalController.listaAppuntamenti);
router.post('/appuntamenti', ProfessionalController.creaAppuntamento);
router.post('/appuntamenti/:id/elimina', ProfessionalController.eliminaAppuntamento);

// Giochi
router.get('/giochi', ProfessionalController.listaGiochi);
router.post('/assegnazioni', ProfessionalController.assegnaGioco);

// Promemoria
router.get('/promemoria', ProfessionalController.listaPromemoria);
router.post('/promemoria', ProfessionalController.creaPromemoria);

module.exports = router;