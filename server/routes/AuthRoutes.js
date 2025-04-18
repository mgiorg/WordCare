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

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;
