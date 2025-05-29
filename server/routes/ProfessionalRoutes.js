/**
 * WordCare - ProfessionalRoutes.js (con path corretti per /public)
 */

const express = require('express');
const ProfessionalController = require('../controllers/ProfessionalController');
const Behavior = require('../models/enums/ProfileBehavior');
const path = require('path');

const router = express.Router();
const viewsPath = path.join(__dirname, '../../public');

function VerifyProfessionalSession(req, res, next) {
  if (req.session.userId && req.session.userRole === Behavior.Professional) {
    return next();
  }
  return res.redirect('/login');
}

router.get('/home', VerifyProfessionalSession, (req, res) => {
  res.sendFile(path.join(viewsPath, 'professionista', 'homeprof', 'home.html'));
});

router.get('/profilo/view', VerifyProfessionalSession, (req, res) => {
  res.sendFile(path.join(viewsPath, 'professionista', 'il tuo profilo', 'profilo.html'));
});
router.get('/profilo', VerifyProfessionalSession, ProfessionalController.DatiPersonali);
router.post('/profilo', VerifyProfessionalSession, ProfessionalController.SalvaDatiProfilo);

router.get('/pazienti', VerifyProfessionalSession, ProfessionalController.listPazienti);
router.post('/pazienti/aggiungi', VerifyProfessionalSession, ProfessionalController.aggiungiPaziente);
router.get('/pazienti/:id', VerifyProfessionalSession, ProfessionalController.dettaglioPaziente);
router.get('/pazienti/:id/view', VerifyProfessionalSession, (req, res) => {
  res.sendFile(path.join(viewsPath, 'professionista', 'paziente.html'));
});

router.get('/agenda', VerifyProfessionalSession, ProfessionalController.listaAppuntamenti);
router.post('/agenda', VerifyProfessionalSession, ProfessionalController.creaAppuntamento);
router.post('/agenda/:id/elimina', VerifyProfessionalSession, ProfessionalController.eliminaAppuntamento);
router.get('/appuntamenti/view', VerifyProfessionalSession, (req, res) => {
  res.sendFile(path.join(viewsPath, 'professionista', 'calendario', 'calendario.html'));
});

router.get('/giochi', VerifyProfessionalSession, ProfessionalController.listaGiochi);
router.post('/assegnazioni', VerifyProfessionalSession, ProfessionalController.assegnaGioco);

router.get('/promemoria', VerifyProfessionalSession, ProfessionalController.listaPromemoria);
router.post('/promemoria', VerifyProfessionalSession, ProfessionalController.creaPromemoria);
router.post('/promemoria/:id/elimina', VerifyProfessionalSession, ProfessionalController.eliminaPromemoria);

module.exports = router;
