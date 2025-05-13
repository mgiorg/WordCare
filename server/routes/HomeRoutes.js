const express = require('express');
const path = require('path');

const router = express.Router();
const viewsPath = path.join(__dirname, '../../public/views');
const authRoutes = require('./AuthRoutes');

// Route to serve the main HTML page
router.get('/', (req, res) => {
	res.sendFile(path.join(viewsPath, 'Home/home.html'));
});
router.get('/home', (req, res) => {
	res.sendFile(path.join(viewsPath, 'Home/home.html'));
});

// Route to serve the about HTML page
router.get('/about', (req, res) => {
	res.sendFile(path.join(viewsPath, 'Home/ChiSiamo.html'));
});

// Route to serve the service HTML page
router.get('/services', (req, res) => {
	res.sendFile(path.join(viewsPath, 'Home/servizi.html'));
});

// Route to serve the contact HTML page
router.get('/contact', (req, res) => {
	res.sendFile(path.join(viewsPath, 'Home/Contatti.html'))
});

module.exports = router;
