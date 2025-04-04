////////////////////////////////////////////////////////////////////////////
// WordCare
// authRoutes.js
//

const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');

const router = express.Router();

// Rotta per la root: reindirizza a /login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Rotta per la pagina di login
router.get('/login', (req, res) => {
  // Manda il file login.html
  res.sendFile(path.join(__dirname, '../../public/views/login.html'));
});

// Rotta per gestire il login (POST)
router.post('/login', authController.login);

// Rotta per gestire la registrazione (POST)
// => se vuoi una pagina di registrazione, puoi creare una rotta GET /register
router.post('/register', authController.register);

// Rotta per la pagina "successo login" (es. /paziente)
router.get('/paziente', (req, res) => {
  // Semplice risposta testuale, oppure:
  // res.sendFile(path.join(__dirname, '../../public/views/paziente.html'));
  res.send('<h1>Benvenuto, utente loggato!</h1>');
});

module.exports = router;
