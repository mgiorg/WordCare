/**
 * WordCare - AuthRoutes.js
 */

const express = require('express');
const path = require('path');
const authController = require('../controllers/AuthController');

const router = express.Router();
const viewsPath = path.join(__dirname, '../../public/views');

// Route for default redirect to the login page
router.get('/', (req, res) => res.redirect('/login'));

// Route to serve the login HTML page
router.get('/login', (req, res) => {
  res.sendFile(path.join(viewsPath, 'login.html'));
});

// Route to handle login requests using authController
router.post('/login', authController.login);

// Route to handle user registration requests using authController
router.post('/register', authController.register);

// Route to serve the patient welcome page after login
router.get('/paziente', (req, res) => {
  res.send('<h1>Benvenuto, utente loggato!</h1>');
});

module.exports = router;

