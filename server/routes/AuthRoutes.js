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
	res.sendFile(path.join(viewsPath, 'Login/login.html'));
});

// Route to handle login
router.post('/login', authController.login);

// Route to handle registration
router.post('/register', authController.register);

// Route to handle logout
router.get('/logout', authController.logout);

module.exports = router;
